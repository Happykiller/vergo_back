import { hiit } from '@service/db/fake/mock/hiit';
import { BddService } from '@service/db/db.service';
import { TrainingDbModel } from '@service/db/model/training.db.model';
import { UpdateTrainingDbDto } from '@service/db/dto/update.training.db.dto';
import { CreateTrainingDbDto } from '@service/db/dto/create.training.db.dto';

export class BdbServiceTrainingFake
  implements
    Pick<BddService, 'getTrainings' | 'getTraining' | 'updateTraining' | 'createTraining'>
{
  trainingCollection: TrainingDbModel[];

  getTrainingCollection(): TrainingDbModel[] {
    if (!this.trainingCollection) {
      this.trainingCollection = [hiit];
    }
    return this.trainingCollection;
  }

  getTrainings(): Promise<TrainingDbModel[]> {
    return Promise.resolve(this.getTrainingCollection());
  }

  getTraining(): Promise<TrainingDbModel> {
    return Promise.resolve(null);
  }

  updateTraining(dto: UpdateTrainingDbDto): Promise<boolean> {
    return Promise.resolve(true);
  }

  createTraining(dto: CreateTrainingDbDto): Promise<TrainingDbModel> {
    return Promise.resolve(null);
  }
}
