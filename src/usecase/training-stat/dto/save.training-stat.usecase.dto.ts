// src\usecase\training-stat\dto\save.training-stat.usecase.dto.ts
import { UserSession } from "@happykiller/sunny-apis/dist/graphql/auth/jwt.strategy";

export interface SaveTrainingStatUsecaseDto {
  training_id: string;
  start: string; // ISO
  end: string;   // ISO
  durationInSeconds: number;
  completed: boolean;
  session: UserSession;
}
