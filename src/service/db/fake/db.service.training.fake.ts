import { BddService } from '@service/db/db.service';
import { hiit } from '@src/service/db/fake/mock/hiit';
import { TrainingDbModel } from '../model/training.db.model';

export class BdbServiceTrainingFake
  implements
    Pick<BddService, 'getTrainings' | 'getTraining'>
{
  trainingCollection: TrainingDbModel[];

  getUserCollection(): TrainingDbModel[] {
    if (!this.trainingCollection) {
      this.trainingCollection = [hiit];
    }
    return this.trainingCollection;
  }

  getTrainings(): Promise<TrainingDbModel[]> {
    return Promise.resolve(this.getUserCollection());
  }

  getTraining(): Promise<TrainingDbModel> {
    return Promise.resolve(null);
  }
}
