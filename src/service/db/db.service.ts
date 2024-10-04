import { UserDbModel } from '@service/db/model/user.db.model';
import { GetUserDbDto } from '@service/db/dto/get.user.db.dto';
import PasskeyDbModel from '@service/db/model/passkey.db.model';
import GlossaryDbModel from '@service/db/model/glossary.db.model';
import { CreateUserDbDto } from '@service/db/dto/create.user.db.dto';
import { UpdateUserDbDto } from '@service/db/dto/update.user.db.dto';
import { GetPasskeyDbDto } from '@service/db/dto/get.passkey.db.dto';
import { TrainingDbModel } from '@service/db/model/training.db.model';
import { ExerciceDbModel } from '@service/db/model/exercice.db.model';
import CreatePasskeyDbDto from '@service/db/dto/create.passkey.db.dto';
import { GetTrainingDbDto } from '@service/db/dto/get.training.db.dto';
import { GetExerciceDbDto } from '@service/db/dto/get.exercice.db.dto';
import { WorkoutDefDbModel } from '@service/db/model/workout.def.db.model';
import { DeletePasskeyDbDto } from '@service/db/dto/delete.passkey.db.dto';
import { UpdateTrainingDbDto } from '@service/db/dto/update.training.db.dto';
import { CreateTrainingDbDto } from '@service/db/dto/create.training.db.dto';
import { CreateExerciceDbDto } from '@service/db/dto/create.exercice.db.dto';
import { UpdateExerciceDbDto } from '@service/db/dto/update.exercice.db.dto';
import { GetPasskeyByUserIdDbDto } from '@service/db/dto/getByUserId.passkey.db.dto';

export interface BddService {
  test(): Promise<boolean>;
  initConnection(): Promise<void>;
  /**
   * User
   */
  getAllUser(): Promise<UserDbModel[]>;
  getUser(dto: GetUserDbDto): Promise<UserDbModel>;
  createUser(dto: CreateUserDbDto): Promise<UserDbModel>;
  updateUser(dto: UpdateUserDbDto): Promise<UserDbModel>;
  /**
   * Passkey
   */
  createPasskey(dto: CreatePasskeyDbDto): Promise<PasskeyDbModel>;
  getPasskeyByUserId(dto: GetPasskeyByUserIdDbDto): Promise<PasskeyDbModel[]>;
  getPasskey(dto: GetPasskeyDbDto): Promise<PasskeyDbModel>;
  deletePasskey(dto: DeletePasskeyDbDto): Promise<boolean>;
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
}
