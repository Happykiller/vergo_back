import { Inversify } from '@src/inversify/investify';
import { TrainingStatUsecaseModel } from '@usecase/training-stat/model/training-stat.usecase.model';
import {
  TrainingVolumePeriodUsecaseModel,
  TrainingVolumeUsecaseModel,
} from '@usecase/training-stat/model/training-volume.usecase.model';

export class GetTrainingVolumeUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(userId: string): Promise<TrainingVolumeUsecaseModel> {
    const stats = await this.inversify.getTrainingStatsByUserIdUsecase.execute(userId);

    return {
      last15Days: this.computeSinceDays(stats, 15),
      last30Days: this.computeSinceDays(stats, 30),
      last90Days: this.computeSinceDays(stats, 90),
      last6Months: this.computeSinceMonths(stats, 6),
      last1Year: this.computeSinceYears(stats, 1),
    };
  }

  private computeSinceDays(stats: TrainingStatUsecaseModel[], days: number): TrainingVolumePeriodUsecaseModel {
    const from = new Date();
    from.setDate(from.getDate() - days);
    return this.computeSinceDate(stats, from);
  }

  private computeSinceMonths(stats: TrainingStatUsecaseModel[], months: number): TrainingVolumePeriodUsecaseModel {
    const from = new Date();
    from.setMonth(from.getMonth() - months);
    return this.computeSinceDate(stats, from);
  }

  private computeSinceYears(stats: TrainingStatUsecaseModel[], years: number): TrainingVolumePeriodUsecaseModel {
    const from = new Date();
    from.setFullYear(from.getFullYear() - years);
    return this.computeSinceDate(stats, from);
  }

  private computeSinceDate(stats: TrainingStatUsecaseModel[], from: Date): TrainingVolumePeriodUsecaseModel {
    const filteredStats = stats.filter((stat) => new Date(stat.start) >= from);
    const totalSeconds = filteredStats.reduce((acc, stat) => {
      return acc + Math.max(0, stat.durationInSeconds || 0);
    }, 0);

    const sessionsCount = filteredStats.length;
    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.round((totalSeconds / 3600) * 100) / 100;

    return { sessionsCount, minutes, hours };
  }
}
