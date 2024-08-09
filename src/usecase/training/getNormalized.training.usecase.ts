import { Inversify } from '@src/inversify/investify';
import { GetTraingUsecaseDto } from '@usecase/training/dto/get.training.usecase.dto';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';

export class GetNormalizedTrainingUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetTraingUsecaseDto): Promise<any> {
    const training: TrainingUsecaseModel =
      await this.inversify.bddService.getTraining(dto);

    const normalized = this.flatten(training);
      
    return normalized;
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

  flattenSequence = (set: any, slugs: string[]): [] => {
    let response:any = [];
    let last_slug = null;
    for (let i = 0; i < set.rep; i++) {
      let under_slugs = [...slugs]
      if(set.slugs && set.slugs[i]) {
        last_slug = set.slugs[i];
        under_slugs.push(set.slugs[i]);
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
        slugs,
        type: 'pause',
        duration: set.pause
      });
    }
    return response;
  }
}
