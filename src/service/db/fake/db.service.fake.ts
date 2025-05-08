// src\service\db\fake\db.service.fake.ts
import { BddServiceImageFake } from '@service/db/fake/db.service.image.fake';
import { BdbServiceWorkoutFake } from '@service/db/fake/db.service.workout.fake';
import { BdbServiceTrainingFake } from '@service/db/fake/db.service.training.fake';
import { BdbServiceExerciceFake } from '@service/db/fake/db.service.exercice.fake';
import { BdbServiceGlossaryFake } from '@service/db/fake/db.service.glossary.fake';
import { applyMixins, BddServicePasskeyFake, BddServiceTestFake, BddServiceUserFake } from '@happykiller/sunny-apis';

class BddServiceFake {}

applyMixins(BddServiceFake, [
  BddServiceUserFake,
  BddServiceTestFake,
  BddServiceImageFake,
  BddServicePasskeyFake,
  BdbServiceWorkoutFake,
  BdbServiceTrainingFake,
  BdbServiceExerciceFake,
  BdbServiceGlossaryFake,
]);

export { BddServiceFake };
