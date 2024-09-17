import { WorkoutDbModel } from "@service/db/model/training.db.model";

export interface CreateTrainingDbDto {
  slug: string;
  label?: string;
  gender?: string;
  workout: WorkoutDbModel[];
  creator_id?: string;
  contributors_id?: [string];
}
