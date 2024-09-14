import { UserSession } from "@presentation/auth/jwt.strategy";
import { WorkoutDbModel } from "@service/db/model/training.db.model";

export interface UpdateTrainingUsecaseDto {
  session: UserSession,
  training: {
    id: string;
    slug?: string;
    label?: string;
    gender?: string;
    isPrivate?: boolean;
    workout?: WorkoutDbModel[];
  }
}