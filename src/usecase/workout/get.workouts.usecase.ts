import { Inversify } from '@src/inversify/investify';
import { WorkoutDefUsecaseModel } from '@usecase/workout/model/workout.def.usecase.model';

export class GetWorkoutsUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<WorkoutDefUsecaseModel[]> {
    const entities: WorkoutDefUsecaseModel[] =
      await this.inversify.bddService.getWorkouts();
      
    return entities;
  }
}
