import { Inversify } from '@src/inversify/investify';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';
import { GetTraingUsecaseDto } from './dto/get.training.usecase.dto';

export class GetTrainingUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetTraingUsecaseDto): Promise<TrainingUsecaseModel> {
    const entity: TrainingUsecaseModel =
      await this.inversify.bddService.getTraining(dto);
      
    return entity;
  }
}
