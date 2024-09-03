import { Inversify } from '@src/inversify/investify';
import { GetTraingUsecaseDto } from '@usecase/training/dto/get.training.usecase.dto';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';

export class GetNormalizedTrainingUsecase {
  inversify: Inversify;
  mapping_slug:any;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetTraingUsecaseDto): Promise<any> {
    try {
      this.mapping_slug = {};
      const training: TrainingUsecaseModel =
        await this.inversify.bddService.getTraining(dto);

      const exercices = await this.inversify.getExercicesUsecase.execute();
      const exercices_db = [];
      for(let exercice of exercices) {
        exercices_db.push({
          slug: exercice.slug,
          words: await this.inversify.tokenizeUsecase.execute(exercice.slug)
        })
      }

      const exercice_slugs_asked = this.getExercices(training);
      for(let exercice_slug_asked of exercice_slugs_asked) {
        const words:string[] = await this.inversify.tokenizeUsecase.execute(exercice_slug_asked);
        let resp = this.inversify.findMostAccurateFileUsecase.execute(exercices_db, words);
        if (resp) {
          this.mapping_slug[exercice_slug_asked] = resp.slug;
        }
      }
  
      const normalized = this.flatten(training);
        
      return normalized;
    } catch (ex) {
      this.inversify.loggerService.error(ex.message)
      return []
    }
  }

  flatten = (training: TrainingUsecaseModel): [] => {
    let response:any = [];
    for(const workout of training.workout) {
      for(const set of workout.sets) {
        response = response.concat(this.flattenSequence(set, [workout.slug]));
      }
    }

    return response;
  }

  getExercices = (training: TrainingUsecaseModel): Set<string> => {
    let response:Set<string> = new Set();
    for(const workout of training.workout) {
      for(const set of workout.sets) {
        response = new Set([...response, ...this.getExerciesDeep(set)]);
      }
    }

    return response;
  }

  getExerciesDeep = (set: any): Set<string> => {
    let response:Set<string> = new Set();
    if(set.slugs) {
      response = new Set([...response, ...set.slugs]);
    }
    if(set.sets) {
      for(const seq of set.sets) {
        response = new Set([...response, ...this.getExerciesDeep(seq)]);
      }
    }
    return response;
  }

  flattenSequence = (set: any, slugs: string[]): [] => {
    let response:any = [];
    let last_slug = null;
    for (let i = 0; i < set.rep; i++) {
      let under_slugs = [...slugs.map(slug => (this.mapping_slug[slug]??slug))]
      if(set.slugs && set.slugs[i]) {
        last_slug = this.mapping_slug[set.slugs[i]]??set.slugs[i];
        under_slugs.push(last_slug);
      } else if (set.slugs && last_slug) {
        under_slugs.push(last_slug);
      }
      if(set.duration) {
        response.push({
          slugs: under_slugs,
          type: 'effort',
          duration: set.duration,
          ite: set.ite,
          weight: set.weight
        });
      }
      if(set.sets) {
        for(const seq of set.sets) {
          response = response.concat(this.flattenSequence(seq, under_slugs));
        }
      }
      if(set.rest) {
        response.push({
          slugs: under_slugs,
          type: 'rest',
          duration: set.rest
        });
      }
    }
    if(set.pause) {
      response.push({
        slugs: slugs.map(slug => (this.mapping_slug[slug]??slug)),
        type: 'pause',
        duration: set.pause
      });
    }
    return response;
  }
}
