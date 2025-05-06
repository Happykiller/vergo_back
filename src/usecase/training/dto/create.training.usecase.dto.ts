// src\usecase\training\dto\create.training.usecase.dto.ts
import { WorkoutDbModel } from "@service/db/model/training.db.model";
import { UserSession } from "@happykiller/sunny-apis/dist/graphql/auth/jwt.strategy";

export interface CreateTrainingUsecaseDto {
  session: UserSession,
  training: {
    slug: string;
    label?: string;
    gender?: string;
    isPrivate?: boolean;
    workout: WorkoutDbModel[];
  }
}