import { UserSession } from '@presentation/auth/jwt.strategy';
import { LanguageDbModel } from "@service/db/model/language.db.model";

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
  }
}