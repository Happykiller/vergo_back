import { Inversify } from '@src/inversify/investify';
import { ExerciceUsecaseModel } from '@usecase/exercice/model/exercice.usecase.model';

export class GetExercicesUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<ExerciceUsecaseModel[]> {
    const entities: ExerciceUsecaseModel[] =
      await this.inversify.bddService.getExercices();
      
    return entities;
  }
}
