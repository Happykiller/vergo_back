// src\usecase\workout\search.workouts.usecase.ts
import { Inversify } from '@src/inversify/investify';
import { WorkoutDefUsecaseModel } from '@usecase/workout/model/workout.def.usecase.model';

export class SearchWorkoutsUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto?: { workouts_slug: string[] }): Promise<WorkoutDefUsecaseModel[]> {
    const entities: WorkoutDefUsecaseModel[] = await this.inversify.bddService.getWorkouts();

    /**
     * tokenize request
     */
    const new_entities = [];
    for (const entity of entities) {
      const new_entity = {
        ...entity,
        words: [],
      };
      new_entity.words = await this.inversify.tokenizeUsecase.execute(new_entity.slug);
      new_entities.push(new_entity);
    }

    const response = [];
    for (const workout_slug of dto.workouts_slug) {
      const workout_slug_tokenised = await this.inversify.tokenizeUsecase.execute(workout_slug);
      /**
       * find response
       */
      const found = this.inversify.findMostAccurateFileUsecase.execute(
        new_entities,
        workout_slug_tokenised
      );
      response.push({
        search: workout_slug,
        search_token: workout_slug_tokenised,
        found,
      });
    }

    return response;
  }
}
