import { BddService } from '@service/db/db.service';
import { workoutsFake } from '@service/db/fake/mock/workouts';
import { WorkoutDefDbModel } from '@service/db/model/workout.def.db.model';

export class BdbServiceWorkoutFake
  implements
    Pick<BddService, 'getWorkouts'>
{
  workoutCollection: WorkoutDefDbModel[];

  getWorkoutCollection(): WorkoutDefDbModel[] {
    if (!this.workoutCollection) {
      this.workoutCollection = workoutsFake;
    }
    return this.workoutCollection;
  }

  getWorkouts(): Promise<WorkoutDefDbModel[]> {
    return Promise.resolve(this.getWorkoutCollection());
  }

  getWorkout(): Promise<WorkoutDefDbModel> {
    return Promise.resolve(null);
  }
}
