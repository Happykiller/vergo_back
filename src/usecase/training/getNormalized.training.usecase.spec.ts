import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { hiit } from '@service/db/fake/mock/hiit';
import { BddService } from '@service/db/db.service';
import { Inversify } from '@src/inversify/investify';
import { glossaryFake } from '@service/db/fake/mock/glossary';
import { TokenizeUsecase } from '@usecase/ai/tokenize.usecase';
import { LoggerService } from '@service/logger/logger.service';
import { man_chest_arm } from '@service/db/fake/mock/man_chest_arm';
import { training_test } from '@service/db/fake/mock/training.test';
import { jumping_jacks } from '@service/db/fake/mock/jumping_jacks';
import { woman_fullbody } from '@service/db/fake/mock/woman_fullbody';
import { hiit_normalized } from '@service/db/fake/mock/hiit.normalized';
import { GetGlossaryUsecase } from '@usecase/glossary/get.glossary.usecase';
import { GetExercicesUsecase } from '@usecase/exercice/getExercices.usecase';
import { FindMostAccurateFileUsecase } from '@usecase/ai/findMostAccurateFile.usecase';
import { man_chest_arm_normalized } from '@service/db/fake/mock/man_chest_arm.normalized';
import { training_test_normalized } from '@service/db/fake/mock/training.test.normalized';
import { woman_fullbody_normalized } from '@service/db/fake/mock/woman_fullbody.normalized';
import { GetNormalizedTrainingUsecase } from '@usecase/training/getNormalized.training.usecase';

describe('GetNormalizedTrainingUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockBddService: MockProxy<BddService> = mock<BddService>();
  const mockLoggerService: MockProxy<LoggerService> = mock<LoggerService>();
  const mockGetGlossaryUsecase: MockProxy<GetGlossaryUsecase> = mock<GetGlossaryUsecase>();
  const mockGetExercicesUsecase: MockProxy<GetExercicesUsecase> = mock<GetExercicesUsecase>();

  mockGetGlossaryUsecase.execute.mockResolvedValue(glossaryFake);
  mockGetExercicesUsecase.execute.mockResolvedValue([jumping_jacks]);

  mockInversify.bddService = mockBddService;
  mockInversify.loggerService = mockLoggerService;
  mockInversify.getGlossaryUsecase = mockGetGlossaryUsecase;
  mockInversify.getExercicesUsecase = mockGetExercicesUsecase;
  mockInversify.tokenizeUsecase = new TokenizeUsecase(mockInversify);
  mockInversify.findMostAccurateFileUsecase = new FindMostAccurateFileUsecase(mockInversify);

  const usecase: GetNormalizedTrainingUsecase = new GetNormalizedTrainingUsecase(mockInversify);

  describe('#execute', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    });

    it('should transform hiit', async () => {
      // arrange
      mockBddService.getTraining.mockResolvedValue(hiit);
      // act
      const response = await usecase.execute({
        id: '65d4d015261e894a1da31a64',
      });
      // assert
      expect(response).toEqual(hiit_normalized);
    });

    it('should transform woman_fullbody', async () => {
      // arrange
      mockBddService.getTraining.mockResolvedValue(woman_fullbody);
      // act
      const response = await usecase.execute({
        id: '65d4d015261e894a1da31a64',
      });
      // assert
      expect(response).toEqual(woman_fullbody_normalized);
    });

    it('should transform man_chest_arm', async () => {
      // arrange
      mockBddService.getTraining.mockResolvedValue(man_chest_arm);
      // act
      const response = await usecase.execute({
        id: '65d4d015261e894a1da31a64',
      });
      // assert
      expect(response).toEqual(man_chest_arm_normalized);
    });

    it('should transform training_test', async () => {
      // arrange
      mockBddService.getTraining.mockResolvedValue(training_test);
      // act
      const response = await usecase.execute({
        id: '65d4d015261e894a1da31a64',
      });
      //console.log(JSON.stringify(response))
      // assert
      expect(response).toEqual(training_test_normalized);
    });

    it('should error handler', async () => {
      // arrange
      mockBddService.getTraining.mockRejectedValue(new Error('ERROR'));
      // act
      const response = await usecase.execute({
        id: '65d4d015261e894a1da31a64',
      });
      // assert
      expect(response).toEqual([]);
    });
  });
});
