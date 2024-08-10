import { Db } from 'mongodb';
import { config } from '@src/config';
import { logger } from '@src/common/logger/logger';
import { BddService } from '@service/db/db.service';
import { AuthUsecase } from '@usecase/auth/auth.usecase';
import { ImageService } from '@service/image/image.service';
import { CryptService } from '@service/crypt/crypt.service';
import { EncodeService } from '@service/encode/encode.service';
import { TokenizeUsecase } from '@usecase/ai/tokenize.usecase';
import { GetUserUsecase } from '@usecase/user/get.user.usecase';
import { BddServiceFake } from '@service/db/fake/db.service.fake';
import { PasswordService } from '@service/password/password.service';
import { CryptServiceReal } from '@service/crypt/crypt.service.real';
import { BddServiceMongo } from '@service/db/mongo/db.service.mongo';
import { CreateUserUsecase } from '@usecase/user/create.user.usecase';
import { GetAllUserUsecase } from '@usecase/user/get_all.user.usecase';
import { UpdPasswordUsecase } from '@usecase/auth/updPassword.usecase';
import { LoggerServiceFake } from '@service/logger/logger.service.fake';
import { EncodeServiceReal } from '@service/encode/encode.service.real';
import { AuthPasskeyUsecase } from '@usecase/auth/passkey.auth.usecase';
import { GetTrainingUsecase } from '@usecase/training/getTraining.usecase';
import { GetTrainingsUsecase } from '@usecase/training/getTrainings.usecase';
import { GetExercicesUsecase } from '@usecase/exercice/getExercices.usecase';
import { PasswordServiceReal } from '@service/password/password.service.real';
import { DeletePasskeyUsecase } from '@usecase/passkey/delete.passkey.usecase';
import { CreatePasskeyUsecase } from '@usecase/passkey/create.passkey.usecase';
import { PasswordLessService } from '@service/passwordless/passwordless.service';
import { FindMostAccurateFileUsecase } from '@usecase/ai/findMostAccurateFile.usecase';
import { GetByUserIdPasskeyUsecase } from '@usecase/passkey/getByUserId.passkey.usecase';
import { PasswordLessServiceFake } from '@service/passwordless/passwordless.service.fake';
import { PasswordLessServiceReal } from '@service/passwordless/passwordlless.service.real';
import { GetNormalizedTrainingUsecase } from '@usecase/training/getNormalized.training.usecase';


export class Inversify {
  mongo: Db;
  loggerService: any;
  bddService: BddService;
  authUsecase: AuthUsecase;
  cryptService: CryptService;
  imageService: ImageService;
  encodeService: EncodeService;
  getUserUsecase: GetUserUsecase;
  tokenizeUsecase: TokenizeUsecase;
  passwordService: PasswordService;
  getAllUserUsecase: GetAllUserUsecase;
  createUserUsecase: CreateUserUsecase;
  getTrainingUsecase: GetTrainingUsecase;
  updPasswordUsecase: UpdPasswordUsecase;
  authPasskeyUsecase: AuthPasskeyUsecase;
  getTrainingsUsecase: GetTrainingsUsecase;
  passwordLessService: PasswordLessService;
  getExercicesUsecase: GetExercicesUsecase;
  deletePasskeyUsecase: DeletePasskeyUsecase;
  createPasskeyUsecase: CreatePasskeyUsecase;
  getByUserIdPasskeyUsecase: GetByUserIdPasskeyUsecase;
  findMostAccurateFileUsecase: FindMostAccurateFileUsecase;
  getNormalizedTrainingUsecase: GetNormalizedTrainingUsecase;

  constructor() {
    /**
     * Services
     */
    this.cryptService = new CryptServiceReal();
    this.encodeService = new EncodeServiceReal();
    this.passwordService = new PasswordServiceReal();
    this.imageService = new ImageService(this);
    if (config.env.mode === 'prod') {
      this.loggerService = logger;
      this.bddService = new BddServiceMongo() as BddService;
      this.bddService.initConnection();
      this.passwordLessService = new PasswordLessServiceReal();
    } else if (config.env.mode === 'dev') {
      this.loggerService = new LoggerServiceFake();
      this.bddService = new BddServiceMongo() as BddService;
      this.bddService.initConnection();
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
    this.createUserUsecase = new CreateUserUsecase(this);
    this.getTrainingUsecase = new GetTrainingUsecase(this);
    this.authPasskeyUsecase = new AuthPasskeyUsecase(this);
    this.updPasswordUsecase = new UpdPasswordUsecase(this);
    this.getExercicesUsecase = new GetExercicesUsecase(this);
    this.getTrainingsUsecase = new GetTrainingsUsecase(this);
    this.deletePasskeyUsecase = new DeletePasskeyUsecase(this);
    this.createPasskeyUsecase = new CreatePasskeyUsecase(this);
    this.getByUserIdPasskeyUsecase = new GetByUserIdPasskeyUsecase(this);
    this.findMostAccurateFileUsecase = new FindMostAccurateFileUsecase(this);
    this.getNormalizedTrainingUsecase = new GetNormalizedTrainingUsecase(this);
  }
}

const inversify = new Inversify();

export default inversify;
