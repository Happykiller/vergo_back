// src/usecase/training-stat/get.training-stats.sessions.usecase.ts
import { Inversify } from '@src/inversify/investify';

export interface TrainingStatActivityModel {
  date: string;
  duration: number;
}

export class getTrainingStatsActivitiesUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(userId: string): Promise<TrainingStatActivityModel[]> {
    const stats = await this.inversify.getTrainingStatsByUserIdUsecase.execute(userId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const enriched = await Promise.all(
      stats.map(async (stat) => {
        return {
          date: stat.start,
          duration: stat.durationInSeconds
        };
      }),
    );

    return enriched
      .filter((s) => new Date(s.date) >= sixMonthsAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
