import { UserSession } from '@presentation/auth/jwt.strategy';
import { LanguageDbModel } from "@service/db/model/language.db.model";

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