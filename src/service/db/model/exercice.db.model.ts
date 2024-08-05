export class LanguageDbModel {
  lang: string;
  value: string;
}

export class ExerciceDbModel {
  id: string;
  slug: string;
  title: LanguageDbModel[];
  description: LanguageDbModel[];
  image: string;
}