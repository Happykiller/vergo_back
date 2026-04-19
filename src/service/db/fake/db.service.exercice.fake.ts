import { BddService } from '@service/db/db.service';
import { ExerciceDbModel } from '../model/exercice.db.model';
import { jumping_jacks } from '@service/db/fake/mock/jumping_jacks';
import { CreateExerciceDbDto } from '../dto/create.exercice.db.dto';
import { UpdateExerciceDbDto } from '../dto/update.exercice.db.dto';

export class BdbServiceExerciceFake
  implements
    Pick<BddService, 'getExercices' | 'getExercice' | 'createExercice' | 'updateExercice'> {
  exerciceCollection: ExerciceDbModel[];

  getExerciceCollection(): ExerciceDbModel[] {
    if (!this.exerciceCollection) {
      this.exerciceCollection = [jumping_jacks];
    }
    return this.exerciceCollection;
  }

  createExercice(dto: CreateExerciceDbDto): Promise<ExerciceDbModel> {
    throw new Error('Method not implemented.');
  }

  getExercices(): Promise<ExerciceDbModel[]> {
    return Promise.resolve(this.getExerciceCollection());
  }

  getExercice(): Promise<ExerciceDbModel> {
    return Promise.resolve(null);
  }

  updateExercice(dto: UpdateExerciceDbDto): Promise<ExerciceDbModel> {
    const exercice = this.getExerciceCollection().find(e => e.id === dto.id);
    if (!exercice) return Promise.resolve(null);
    if (dto.slug !== undefined) exercice.slug = dto.slug;
    if (dto.title !== undefined) exercice.title = dto.title;
    if (dto.description !== undefined) exercice.description = dto.description;
    if (dto.image !== undefined) exercice.image = dto.image;
    return Promise.resolve({ ...exercice });
  }
}
