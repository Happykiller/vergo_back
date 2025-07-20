// src\usecase\training-stat\save.training-stat.usecase.ts
import { Inversify } from '@src/inversify/investify';
import { TrainingStatUsecaseModel } from '@usecase/training-stat/model/training-stat.usecase.model';
import { SaveTrainingStatUsecaseDto } from '@usecase/training-stat/dto/save.training-stat.usecase.dto';

export class SaveTrainingStatUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(
    dto: SaveTrainingStatUsecaseDto
  ): Promise<TrainingStatUsecaseModel> {
    const created = await this.inversify.bddService.insertTrainingStat({
      training_id: dto.training_id,
      start: dto.start,
      end: dto.end,
      durationInSeconds: dto.durationInSeconds,
      completed: dto.completed,
      user_id: dto.session.id,
    });

    return {
      id: created.id,
      training_id: created.training_id,
      start: created.start,
      end: created.end,
      durationInSeconds: created.durationInSeconds,
      completed: created.completed,
      user_id: created.user_id,
      created_at: created.created_at,
    };
  }
}
