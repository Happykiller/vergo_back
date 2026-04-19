export interface TrainingVolumePeriodUsecaseModel {
  sessionsCount: number;
  minutes: number;
  hours: number;
}

export interface TrainingVolumeUsecaseModel {
  last15Days: TrainingVolumePeriodUsecaseModel;
  last30Days: TrainingVolumePeriodUsecaseModel;
  last90Days: TrainingVolumePeriodUsecaseModel;
  last6Months: TrainingVolumePeriodUsecaseModel;
  last1Year: TrainingVolumePeriodUsecaseModel;
}
