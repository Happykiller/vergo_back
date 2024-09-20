import { Inversify } from '@src/inversify/investify';
import { ExerciceUsecaseModel } from '@usecase/exercice/model/exercice.usecase.model';
import { GetExerciceExerciceDto } from '@usecase/exercice/dto/get.exercice.usecase.dto';

export class GetExerciceUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetExerciceExerciceDto): Promise<ExerciceUsecaseModel> {
    const entity: ExerciceUsecaseModel =
      await this.inversify.bddService.getExercice(dto);
      
    return entity;
  }
}
