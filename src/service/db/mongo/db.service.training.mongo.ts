import { Collection, ObjectId } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import { TrainingDbModel } from '@service/db/model/training.db.model';
import { GetTrainingDbDto } from '@service/db/dto/get.training.db.dto';

export class BddServiceTrainingMongo
  implements Pick<BddService, 'getTrainings' | 'getTraining'>
{
  private async getTraingCollection(): Promise<Collection> {
    return inversify.mongo.collection('trainings');
  }

  async getTrainings(): Promise<TrainingDbModel[]> {
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    // Execute query
    const results = (await this.getTraingCollection()).find(query, options);

    const response: TrainingDbModel[] = [];
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

  async getTraining(dto: GetTrainingDbDto): Promise<TrainingDbModel> {
    try {
      const query = {
        _id: new ObjectId(dto.id)
      };
      const options = {};
      // Execute query
      const doc: any = await (
        await this.getTraingCollection()
      ).findOne(query, options);

      return Promise.resolve({
        id: doc._id.toString(),
        ... doc
      });
    } catch (e) {
      return null;
    }
  }
}