import { UserSession } from "@presentation/auth/jwt.strategy";
import { WorkoutDbModel } from "@service/db/model/training.db.model";

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