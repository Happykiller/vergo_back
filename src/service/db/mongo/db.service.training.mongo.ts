import { Collection, ObjectId } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import { TrainingDbModel } from '@service/db/model/training.db.model';
import { GetTrainingDbDto } from '@service/db/dto/get.training.db.dto';
import { UpdateTrainingDbDto } from '@service/db/dto/update.training.db.dto';

export class BddServiceTrainingMongo
  implements Pick<BddService, 'getTrainings' | 'getTraining' | 'updateTraining'>
{
  private async getTrainingCollection(): Promise<Collection> {
    return inversify.mongo.collection('trainings');
  }

  async getTrainings(): Promise<TrainingDbModel[]> {
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    // Execute query
    const results = (await this.getTrainingCollection()).find(query, options);

    const response: TrainingDbModel[] = [];

    // Print returned documents
    for await (const doc of results) {
      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      delete tmp._id;
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
        await this.getTrainingCollection()
      ).findOne(query, options);

      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      delete tmp._id;

      return Promise.resolve(tmp);
    } catch (e) {
      return null;
    }
  }

  async updateTraining(dto: UpdateTrainingDbDto): Promise<boolean> {
    const set: any = {};

    if (dto.gender) {
      set.gender = dto.gender;
    }

    if (dto.label) {
      set.label = dto.label;
    }

    if (dto.slug) {
      set.slug = dto.slug;
    }

    if (dto.workout) {
      set.workout = dto.workout;
    }

    await (
      await this.getTrainingCollection()
    ).updateOne(
      { _id: new ObjectId(dto.id) },
      {
        $set: set,
      },
    );

    return true;
  }
}