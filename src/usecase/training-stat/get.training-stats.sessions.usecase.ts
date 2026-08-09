// src/usecase/training-stat/get.training-stats.sessions.usecase.ts
import { Inversify } from '@src/inversify/investify';

export interface TrainingStatSessionModel {
  id: string;
  label: string;
  date: string;
  duration: number;
  completed: boolean;
}

export class GetTrainingStatsSessionsUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(userId: string): Promise<TrainingStatSessionModel[]> {
    const stats = await this.inversify.getTrainingStatsByUserIdUsecase.execute(userId);

    const enriched = await Promise.all(
      stats.map(async (stat) => {
        const training = await this.inversify.getTrainingUsecase.execute({ id: stat.training_id });

        return {
          id: stat.id,
          label: training.label,
          date: stat.start,
          duration: stat.durationInSeconds,
          completed: stat.completed,
        };
      })
    );

    return enriched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }
}
