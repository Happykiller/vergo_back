import { Inversify } from '@src/inversify/investify';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';
import { CreateTrainingUsecaseDto } from '@usecase/training/dto/create.training.usecase.dto';

export class CreateTrainingUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: CreateTrainingUsecaseDto,
  ): Promise<TrainingUsecaseModel> {
    const training = await this.inversify.bddService.createTraining({
      slug: dto.training.slug,
      label: dto.training.label,
      gender: dto.training.gender,
      workout: dto.training.workout,
      creator_id: dto.session.id,
      contributors_id: [dto.session.id]
    });
    return training;
  }
}
