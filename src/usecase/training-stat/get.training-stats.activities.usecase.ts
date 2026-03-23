import { Inversify } from '@src/inversify/investify';

export interface TrainingStatActivityModel {
  date: string;
  duration: number;
}

export class GetTrainingStatsActivitiesUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(userId: string): Promise<TrainingStatActivityModel[]> {
    const stats = await this.inversify.getTrainingStatsByUserIdUsecase.execute(userId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return stats
      .map((stat) => ({ date: stat.start, duration: stat.durationInSeconds }))
      .filter((s) => new Date(s.date) >= sixMonthsAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
