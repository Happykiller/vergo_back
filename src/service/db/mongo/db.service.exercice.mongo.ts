import { Collection, ObjectId } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import { ExerciceDbModel } from '@service/db/model/exercice.db.model';

export class BdbServiceExerciceMongo
  implements
    Pick<BddService, 'getExercices'>
{
  private async getTraingCollection(): Promise<Collection> {
    return inversify.mongo.collection('exercices');
  }

  async getExercices(): Promise<ExerciceDbModel[]> {
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    // Execute query
    const results = (await this.getTraingCollection()).find(query, options);

    const response: ExerciceDbModel[] = [];
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
