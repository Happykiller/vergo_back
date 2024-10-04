import { LanguageDbModel } from "@service/db/model/language.db.model";

export class UpdateExerciceDbDto {
  id: string;
  slug: string;
  title: LanguageDbModel[];
  description: LanguageDbModel[];
  image: string;
  creator_id?: string;
  contributors_id?: string[];
  active?: boolean;
}