// src\service\db\mongo\db.service.training-stat.mongo.ts
import { Collection } from 'mongodb';
import { TrainingStatDbModel } from '@service/db/model/training-stat.db.model';

import inversify from '@src/inversify/investify';

export class BddServiceTrainingStatMongo {
  private async getCollection(): Promise<Collection> {
    return inversify.mongo.collection('training_stats');
  }

  async insertTrainingStat(stat: Omit<TrainingStatDbModel, 'id'>): Promise<TrainingStatDbModel> {
    const doc = { ...stat, created_at: new Date().toISOString() };

    const result = await (await this.getCollection()).insertOne(doc);

    return {
      id: result.insertedId.toString(),
      ...doc,
    };
  }

  async getStatsByUserId(user_id: string): Promise<TrainingStatDbModel[]> {
    const cursor = (await this.getCollection()).find({ user_id });
    const results: TrainingStatDbModel[] = [];

    for await (const doc of cursor) {
      results.push({
        id: doc._id.toString(),
        training_id: doc.training_id,
        start: doc.start,
        end: doc.end,
        durationInSeconds: doc.durationInSeconds,
        completed: doc.completed,
        created_at: doc.created_at,
        user_id: doc.user_id,
      });
    }

    return results;
  }
}
