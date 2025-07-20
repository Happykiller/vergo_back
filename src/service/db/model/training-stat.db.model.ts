// src\service\db\model\training-stat.db.model.ts
export interface TrainingStatDbModel {
  id: string;
  training_id: string;
  start: string; // ISO string
  end: string;   // ISO string
  durationInSeconds: number;
  completed: boolean;
  user_id?: string;
  created_at?: string;
}
