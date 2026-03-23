// src\usecase\training-stat\get.training-stats-by-user.usecase.ts
import { Inversify } from '@src/inversify/investify';
import { TrainingStatUsecaseModel } from '@usecase/training-stat/model/training-stat.usecase.model';

export class GetTrainingStatsByUserIdUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(user_id: string): Promise<TrainingStatUsecaseModel[]> {
    const results = await this.inversify.bddService.getStatsByUserId(user_id);

    return results.map((s) => ({
      id: s.id,
      training_id: s.training_id,
      start: s.start,
      end: s.end,
      durationInSeconds: s.durationInSeconds,
      completed: s.completed,
      created_at: s.created_at,
      user_id: s.user_id,
    }));
  }
}
