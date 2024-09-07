import { LanguageDbModel } from "@service/db/model/language.db.model";

export class WorkoutDefDbModel {
  id: string;
  slug: string;
  title: LanguageDbModel[];
  description: LanguageDbModel[];
  image?: string;
}