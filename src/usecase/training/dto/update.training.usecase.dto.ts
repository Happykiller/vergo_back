// src\usecase\training\dto\update.training.usecase.dto.ts
import { WorkoutDbModel } from '@service/db/model/training.db.model';
import { UserSession } from '@happykiller/sunny-apis/dist/graphql/auth/jwt.strategy';

export interface UpdateTrainingUsecaseDto {
  session: UserSession;
  training: {
    id: string;
    slug?: string;
    label?: string;
    gender?: string;
    isPrivate?: boolean;
    workout?: WorkoutDbModel[];
  };
}
