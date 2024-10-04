import { LanguageDbModel } from "@service/db/model/language.db.model";

export class CreateExerciceDbDto {
  slug: string;
  title: LanguageDbModel[];
  description: LanguageDbModel[];
  image: string;
  creator_id?: string;
  contributors_id?: string[];
  active?: boolean;
}