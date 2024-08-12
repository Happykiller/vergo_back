import { LanguageDbModel } from "@service/db/model/language.db.model";

export class ExerciceDbModel {
  id: string;
  slug: string;
  title: LanguageDbModel[];
  description: LanguageDbModel[];
  image: string;
}