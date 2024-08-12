import { BddService } from '@service/db/db.service';
import { ExerciceDbModel } from '../model/exercice.db.model';
import { jumping_jacks } from '@service/db/fake/mock/jumping_jacks';

export class BdbServiceExerciceFake
  implements
    Pick<BddService, 'getExercices'>
{
  exerciceCollection: ExerciceDbModel[];

  getExerciceCollection(): ExerciceDbModel[] {
    if (!this.exerciceCollection) {
      this.exerciceCollection = [jumping_jacks];
    }
    return this.exerciceCollection;
  }

  getExercices(): Promise<ExerciceDbModel[]> {
    return Promise.resolve(this.getExerciceCollection());
  }

  getExercice(): Promise<ExerciceDbModel> {
    return Promise.resolve(null);
  }
}
