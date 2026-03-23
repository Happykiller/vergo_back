// src\service\db\fake\bdd.service.training-stat.fake.ts
import { v4 as uuid } from 'uuid';
import { TrainingStatDbModel } from '@service/db/model/training-stat.db.model';

export class BddServiceTrainingStatFake {
  private collection: TrainingStatDbModel[] = [];

  async insertTrainingStat(stat: Omit<TrainingStatDbModel, 'id'>): Promise<TrainingStatDbModel> {
    const trainingStat: TrainingStatDbModel = {
      id: uuid(),
      ...stat,
      created_at: new Date().toISOString(),
    };

    this.collection.push(trainingStat);
    return trainingStat;
  }

  async getStatsByUserId(user_id: string): Promise<TrainingStatDbModel[]> {
    return this.collection.filter((s) => s.user_id === user_id);
  }
}
