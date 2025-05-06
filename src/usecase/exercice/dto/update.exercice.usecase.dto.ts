// src\usecase\exercice\dto\update.exercice.usecase.dto.ts
import { LanguageDbModel } from "@service/db/model/language.db.model";
import { UserSession } from "@happykiller/sunny-apis/dist/graphql/auth/jwt.strategy";

export class UpdateExerciceUsecaseDto {
  session: UserSession;
  exercice: {
    id: string;
    slug?: string;
    title?: LanguageDbModel[];
    description?: LanguageDbModel[];
    image?: string;
  }
}