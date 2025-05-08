// src\service\db\db.service.ts
import { BddServiceBase } from '@happykiller/sunny-apis';
import { ImageDbModel } from '@service/db/model/image.db.model';
import GlossaryDbModel from '@service/db/model/glossary.db.model';
import { TrainingDbModel } from '@service/db/model/training.db.model';
import { ExerciceDbModel } from '@service/db/model/exercice.db.model';
import { GetTrainingDbDto } from '@service/db/dto/get.training.db.dto';
import { GetExerciceDbDto } from '@service/db/dto/get.exercice.db.dto';
import { WorkoutDefDbModel } from '@service/db/model/workout.def.db.model';
import { UpdateTrainingDbDto } from '@service/db/dto/update.training.db.dto';
import { CreateTrainingDbDto } from '@service/db/dto/create.training.db.dto';
import { CreateExerciceDbDto } from '@service/db/dto/create.exercice.db.dto';
import { UpdateExerciceDbDto } from '@service/db/dto/update.exercice.db.dto';

export interface BddService extends BddServiceBase {
  /**
   * Training
   */
  getTrainings(): Promise<TrainingDbModel[]>;
  getTraining(dto: GetTrainingDbDto): Promise<TrainingDbModel>;
  updateTraining(dto: UpdateTrainingDbDto): Promise<boolean>;
  createTraining(dto: CreateTrainingDbDto): Promise<TrainingDbModel>;
  /**
   * Exercice
   */
  getExercice(dto: GetExerciceDbDto): Promise<ExerciceDbModel>;
  getExercices(): Promise<ExerciceDbModel[]>;
  createExercice(dto: CreateExerciceDbDto): Promise<ExerciceDbModel>;
  updateExercice(dto: UpdateExerciceDbDto): Promise<ExerciceDbModel>;
  /**
   * Workout
   */
  getWorkouts(): Promise<WorkoutDefDbModel[]>;
  /**
   * Glossary
   */
  getGlossary(): Promise<GlossaryDbModel>;
  /**
   * Image
   */
  getImages(): Promise<ImageDbModel[]>;
  setImages(dto: ImageDbModel[]): Promise<ImageDbModel[]>;
}
