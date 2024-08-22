import { applyMixins } from '@src/common/applyMixins';
import { BddServiceUserMongo } from '@service/db/mongo/db.service.user.mongo';
import { BddServiceTestMongo } from '@service/db/mongo/db.service.test.mongo';
import { BddServicePasskeyMongo } from '@service/db/mongo/db.service.passkey.mongo';
import { BdbServiceWorkoutMongo } from '@service/db/mongo/db.service.workout.mongo';
import { BddServiceTrainingMongo } from '@service/db/mongo/db.service.training.mongo';
import { BdbServiceExerciceMongo } from '@service/db/mongo/db.service.exercice.mongo';
import { BdbServiceGlossaryMongo } from '@service/db/mongo/db.service.glossary.mongo';

class BddServiceMongo {}

applyMixins(BddServiceMongo, [
  BddServiceUserMongo,
  BddServiceTestMongo,
  BddServicePasskeyMongo,
  BdbServiceWorkoutMongo,
  BddServiceTrainingMongo,
  BdbServiceExerciceMongo,
  BdbServiceGlossaryMongo,
]);

export { BddServiceMongo };
