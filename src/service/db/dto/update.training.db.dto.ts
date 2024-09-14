import { WorkoutDbModel } from "@service/db/model/training.db.model";

export interface UpdateTrainingDbDto {
  id: string;
  slug?: string;
  label?: string;
  gender?: string;
  workout?: WorkoutDbModel[];
}
