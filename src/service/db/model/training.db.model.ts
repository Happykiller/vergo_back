export interface TrainingDbModel {
  id: string;
  slug: string;
  label?: string;
  gender?: string;
  isPrivate?: boolean;
  workout: WorkoutDbModel[];
}

export interface WorkoutDbModel {
  slug: string;
  sets: SetDbModel[];
}

export interface SetDbModel {
  rep?: number;
  slugs?: string[];
  ite?: number,
  weight?: number,
  duration?: number;
  rest?: number;
  pause?: number;
  sets?: SetDbModel[];
}