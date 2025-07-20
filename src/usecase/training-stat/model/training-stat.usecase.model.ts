// src\usecase\training-stat\model\training-stat.usecase.model.ts
export interface TrainingStatUsecaseModel {
  id: string;
  training_id: string;
  start: string;
  end: string;
  durationInSeconds: number;
  completed: boolean;
  created_at: string;
  user_id?: string;
}
