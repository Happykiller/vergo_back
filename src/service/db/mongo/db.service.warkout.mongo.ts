import { Collection, ObjectId } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import { WorkoutDefDbModel } from '@service/db/model/workout.def.db.model';

export class BdbServiceWorkoutMongo
  implements
    Pick<BddService, 'getWorkouts'>
{
  private async getWorkoutCollection(): Promise<Collection> {
    return inversify.mongo.collection('workouts');
  }

  async getWorkouts(): Promise<WorkoutDefDbModel[]> {
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    // Execute query
    const results = (await this.getWorkoutCollection()).find(query, options);

    const response: WorkoutDefDbModel[] = [];
    // Print returned documents
    for await (const doc of results) {
      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      response.push(tmp);
    }

    return response;
  }
}
