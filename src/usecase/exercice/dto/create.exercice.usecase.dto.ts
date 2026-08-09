// src\usecase\exercice\dto\create.exercice.usecase.dto.ts
import { LanguageDbModel } from '@service/db/model/language.db.model';
import { UserSession } from '@happykiller/sunny-apis/dist/graphql/auth/jwt.strategy';

export class CreateExerciceUsecaseDto {
  session: UserSession;
  exercice: {
    slug: string;
    title: LanguageDbModel[];
    description: LanguageDbModel[];
    image: string;
    creator_id?: string;
    contributors_id?: string[];
    active?: boolean;
  };
}
