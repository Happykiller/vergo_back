// src\inversify\investify.ts
import { Db } from 'mongodb';
import { config } from '@src/config';
import { logger } from '@src/common/logger/logger';
import { BddService } from '@service/db/db.service';
import { ImageService } from '@service/image/image.service';
import { TokenizeUsecase } from '@usecase/ai/tokenize.usecase';
import { BddServiceFake } from '@service/db/fake/db.service.fake';
import { BddServiceMongo } from '@service/db/mongo/db.service.mongo';
import { GetTokenizedUsecase } from '@usecase/ai/get.tokenized.usecase';
import { GetTrainingUsecase } from '@usecase/training/getTraining.usecase';
import { GetWorkoutsUsecase } from '@usecase/workout/get.workouts.usecase';
import { GetGlossaryUsecase } from '@usecase/glossary/get.glossary.usecase';
import { GetExerciceUsecase } from '@usecase/exercice/get.exercice.usecase';
import { GetTrainingsUsecase } from '@usecase/training/getTrainings.usecase';
import { GetExercicesUsecase } from '@usecase/exercice/getExercices.usecase';
import { GetTrainingDatasUsecase } from '@usecase/ai/get.training.datas.usecase';
import { SearchWorkoutsUsecase } from '@usecase/workout/search.workouts.usecase';
import { UpdateTrainingUsecase } from '@usecase/training/update.training.usecase';
import { CreateTrainingUsecase } from '@usecase/training/create.training.usecase';
import { CreateExerciceUsecase } from '@usecase/exercice/create.exercice.usecase';
import { UpdateExerciceUsecase } from '@usecase/exercice/update.exercice.usecase';
import { FindMostAccurateFileUsecase } from '@usecase/ai/findMostAccurateFile.usecase';
import { GetImagesTokenizedUsecase } from '@usecase/image/get.images.tokenized.usecase';
import { SaveTrainingStatUsecase } from '@usecase/training-stat/save.training-stat.usecase';
import { GetUserBadgesUsecase } from '@usecase/training-stat/badges/get.user-badges.usecase';
import { GetNormalizedTrainingUsecase } from '@usecase/training/getNormalized.training.usecase';
import { GetUserGamificationUsecase } from '@usecase/training-stat/get.user-gamification.usecase';
import { GetTrainingStatsByUserIdUsecase } from '@usecase/training-stat/get.training-stats-by-user.usecase';
import { GetTrainingStatsSessionsUsecase } from '@usecase/training-stat/get.training-stats.sessions.usecase';
import { GetTrainingStatsActivitiesUsecase } from '@usecase/training-stat/get.training-stats.activities.usecase';
import { GetTrainingVolumeUsecase } from '@usecase/training-stat/get.training-volume.usecase';
import {
  CreateUserUsecase,
  GetAllUserUsecase,
  GetUserUsecase,
  AuthUsecase,
  CryptService,
  CryptServiceReal,
  HttpService,
  HttpServiceReal,
  LoggerServiceFake,
  MorgansService,
  MorgansServiceReal,
  PasswordLessService,
  PasswordLessServiceFake,
  PasswordLessServiceReal,
  UpdPasswordUsecase,
  AuthPasskeyUsecase,
  DeletePasskeyUsecase,
  CreatePasskeyUsecase,
  GetByUserIdPasskeyUsecase,
} from '@happykiller/sunny-apis';
import type { ConfigurationBase, InversifyInterface } from '@happykiller/sunny-apis';


export class Inversify implements InversifyInterface {
  mongo: Db;
  loggerService: any;
  bddService: BddService;
  authUsecase: AuthUsecase;
  httpService: HttpService;
  cryptService: CryptService;
  imageService: ImageService;
  morgansService: MorgansService;
  getUserUsecase: GetUserUsecase;
  tokenizeUsecase: TokenizeUsecase;
  getAllUserUsecase: GetAllUserUsecase;
  createUserUsecase: CreateUserUsecase;
  getWorkoutsUsecase: GetWorkoutsUsecase;
  getGlossaryUsecase: GetGlossaryUsecase;
  getTrainingUsecase: GetTrainingUsecase;
  updPasswordUsecase: UpdPasswordUsecase;
  authPasskeyUsecase: AuthPasskeyUsecase;
  getExerciceUsecase: GetExerciceUsecase;
  getTokenizedUsecase: GetTokenizedUsecase;
  getTrainingsUsecase: GetTrainingsUsecase;
  passwordLessService: PasswordLessService;
  getExercicesUsecase: GetExercicesUsecase;
  deletePasskeyUsecase: DeletePasskeyUsecase;
  getUserBadgesUsecase: GetUserBadgesUsecase;
  createPasskeyUsecase: CreatePasskeyUsecase;
  createExerciceUsecase: CreateExerciceUsecase;
  updateExerciceUsecase: UpdateExerciceUsecase;
  createTrainingUsecase: CreateTrainingUsecase;
  updateTrainingUsecase: UpdateTrainingUsecase;
  searchWorkoutsUsecase: SearchWorkoutsUsecase;
  saveTrainingStatUsecase: SaveTrainingStatUsecase;
  getTrainingDatasUsecase: GetTrainingDatasUsecase;
  getImagesTokenizedUsecase: GetImagesTokenizedUsecase;
  getByUserIdPasskeyUsecase: GetByUserIdPasskeyUsecase;
  getUserGamificationUsecase: GetUserGamificationUsecase;
  findMostAccurateFileUsecase: FindMostAccurateFileUsecase;
  getNormalizedTrainingUsecase: GetNormalizedTrainingUsecase;
  getTrainingStatsByUserIdUsecase: GetTrainingStatsByUserIdUsecase;
  getTrainingStatsSessionsUsecase: GetTrainingStatsSessionsUsecase;
  getTrainingStatsActivitiesUsecase: GetTrainingStatsActivitiesUsecase;
  getTrainingVolumeUsecase: GetTrainingVolumeUsecase;

  constructor() {
    /**
     * Services
     */
    this.morgansService = new MorgansServiceReal(this, config.morgans.url);
    this.httpService = new HttpServiceReal();
    this.cryptService = new CryptServiceReal(config);
    this.imageService = new ImageService(this);
    if (config.env.mode === 'prod') {
      this.loggerService = logger;
      this.bddService = new BddServiceMongo(this, config) as BddService;
      this.passwordLessService = new PasswordLessServiceReal();
    } else if (config.env.mode === 'dev') {
      this.loggerService = new LoggerServiceFake();
      this.bddService = new BddServiceMongo(this, config) as BddService;
      this.passwordLessService = new PasswordLessServiceReal();
    } else {
      this.loggerService = new LoggerServiceFake();
      this.bddService = new BddServiceFake() as BddService;
      this.passwordLessService = new PasswordLessServiceFake();
    }

    /**
     * Usecases
     */
    this.authUsecase = new AuthUsecase(this);
    this.getUserUsecase = new GetUserUsecase(this);
    this.tokenizeUsecase = new TokenizeUsecase(this);
    this.getAllUserUsecase = new GetAllUserUsecase(this);
    this.createUserUsecase = new CreateUserUsecase(this, config as ConfigurationBase);
    this.getTrainingUsecase = new GetTrainingUsecase(this);
    this.authPasskeyUsecase = new AuthPasskeyUsecase(this);
    this.updPasswordUsecase = new UpdPasswordUsecase(this);
    this.getGlossaryUsecase = new GetGlossaryUsecase(this);
    this.getWorkoutsUsecase = new GetWorkoutsUsecase(this);
    this.getExerciceUsecase = new GetExerciceUsecase(this);
    this.getExercicesUsecase = new GetExercicesUsecase(this);
    this.getTokenizedUsecase = new GetTokenizedUsecase(this);
    this.getTrainingsUsecase = new GetTrainingsUsecase(this);
    this.getUserBadgesUsecase = new GetUserBadgesUsecase(this);
    this.deletePasskeyUsecase = new DeletePasskeyUsecase(this);
    this.createPasskeyUsecase = new CreatePasskeyUsecase(this);
    this.createExerciceUsecase = new CreateExerciceUsecase(this);
    this.updateExerciceUsecase = new UpdateExerciceUsecase(this);
    this.createTrainingUsecase = new CreateTrainingUsecase(this);
    this.updateTrainingUsecase = new UpdateTrainingUsecase(this);
    this.searchWorkoutsUsecase = new SearchWorkoutsUsecase(this);
    this.saveTrainingStatUsecase = new SaveTrainingStatUsecase(this);
    this.getTrainingDatasUsecase = new GetTrainingDatasUsecase(this);
    this.getImagesTokenizedUsecase = new GetImagesTokenizedUsecase(this);
    this.getByUserIdPasskeyUsecase = new GetByUserIdPasskeyUsecase(this);
    this.getUserGamificationUsecase = new GetUserGamificationUsecase(this);
    this.findMostAccurateFileUsecase = new FindMostAccurateFileUsecase(this);
    this.getNormalizedTrainingUsecase = new GetNormalizedTrainingUsecase(this);
    this.getTrainingStatsByUserIdUsecase = new GetTrainingStatsByUserIdUsecase(this);
    this.getTrainingStatsSessionsUsecase = new GetTrainingStatsSessionsUsecase(this);
    this.getTrainingStatsActivitiesUsecase = new GetTrainingStatsActivitiesUsecase(this);
    this.getTrainingVolumeUsecase = new GetTrainingVolumeUsecase(this);
  }

  async init() {
    if (config.env.mode === 'prod' || config.env.mode === 'dev') {
      await this.bddService.initConnection();
    }
  }
}

const inversify = new Inversify();

export default inversify;
