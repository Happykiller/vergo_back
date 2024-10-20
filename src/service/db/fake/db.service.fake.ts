import { applyMixins } from '@src/common/applyMixins';
import { BddServiceUserFake } from '@service/db/fake/db.service.user.fake';
import { BddServiceTestFake } from '@service/db/fake/db.service.test.fake';
import { BddServicePasskeyFake } from '@service/db/fake/db.service.passkey.fake';
import { BdbServiceWorkoutFake } from '@service/db/fake/db.service.workout.fake';
import { BdbServiceTrainingFake } from '@service/db/fake/db.service.training.fake';
import { BdbServiceExerciceFake } from '@service/db/fake/db.service.exercice.fake';
import { BdbServiceGlossaryFake } from '@service/db/fake/db.service.glossary.fake';

class BddServiceFake {}

applyMixins(BddServiceFake, [
  BddServiceUserFake,
  BddServiceTestFake,
  BddServicePasskeyFake,
  BdbServiceWorkoutFake,
  BdbServiceTrainingFake,
  BdbServiceExerciceFake,
  BdbServiceGlossaryFake,
]);

export { BddServiceFake };
