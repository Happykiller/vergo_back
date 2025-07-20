// src\service\db\mongo\db.service.mongo.ts
import { BdbServiceImageMongo } from '@service/db/mongo/db.service.image.mongo';
import { BdbServiceWorkoutMongo } from '@service/db/mongo/db.service.workout.mongo';
import { BddServiceTrainingMongo } from '@service/db/mongo/db.service.training.mongo';
import { BdbServiceExerciceMongo } from '@service/db/mongo/db.service.exercice.mongo';
import { BdbServiceGlossaryMongo } from '@service/db/mongo/db.service.glossary.mongo';
import { BddServiceTrainingStatMongo } from '@service/db/mongo/db.service.training-stat.mongo';
import { applyInstanceMixins, BddServiceInitMongo, BddServicePasskeyMongo, BddServiceTestMongo, BddServiceUserMongo } from '@happykiller/sunny-apis';

class BddServiceMongo {
  constructor(inversify:any, config:any) {
    applyInstanceMixins(this, [
      // Sunny
      BddServiceUserMongo, 
      BddServiceInitMongo,
      BddServiceTestMongo,
      BddServiceUserMongo, 
      BddServicePasskeyMongo,
      // Project
      BdbServiceImageMongo,
      BdbServiceWorkoutMongo,
      BddServiceTrainingMongo,
      BdbServiceExerciceMongo,
      BdbServiceGlossaryMongo,
      BddServiceTrainingStatMongo
    ], [inversify, config]);
  }
}

export { BddServiceMongo };
