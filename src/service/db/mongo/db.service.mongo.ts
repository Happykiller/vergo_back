import { applyMixins } from '@src/common/applyMixins';
import { BddServiceUserMongo } from '@service/db/mongo/db.service.user.mongo';
import { BddServiceTestMongo } from '@service/db/mongo/db.service.test.mongo';
import { BddServicePasskeyMongo } from '@service/db/mongo/db.service.passkey.mongo';
import { BdbServiceWorkoutMongo } from '@service/db/mongo/db.service.warkout.mongo';
import { BddServiceTrainingMongo } from '@service/db/mongo/db.service.training.mongo';
import { BdbServiceExerciceMongo } from '@service/db/mongo/db.service.exercice.mongo';

class BddServiceMongo {}

applyMixins(BddServiceMongo, [
  BddServiceUserMongo,
  BddServiceTestMongo,
  BddServicePasskeyMongo,
  BdbServiceWorkoutMongo,
  BddServiceTrainingMongo,
  BdbServiceExerciceMongo,
]);

export { BddServiceMongo };
