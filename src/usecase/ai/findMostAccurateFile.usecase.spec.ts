import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { ERRORS } from '@src/common/ERROR';
import { LoggerService } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { FindMostAccurateFileUsecase } from '@usecase/ai/findMostAccurateFile.usecase';

describe('FindMostAccurateFileUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockLoggerService: MockProxy<LoggerService> = mock<LoggerService>();
  mockLoggerService.error.mockImplementation(() => jest.fn());

  mockInversify.loggerService = mockLoggerService;

  const usecase: FindMostAccurateFileUsecase = new FindMostAccurateFileUsecase(mockInversify);

  describe('#execute', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    })

    it('should found', async () => {
      // arrange
      // act
      const response = await usecase.execute(
        [{
          words: ['one', 'two']
        }]
        , ['one']);
      // assert
      expect(response).toEqual({"found_stats": {"accurency": 1, "wordsWeight": 0.5}, "words": ["one", "two"]});
    });

    it('should AI_FIND_INSUFFISANT_ACCURACY', async () => {
      // arrange
      // act
      await usecase.execute(
        [{
          words: ['one', 'two', 'tree', 'four'],
        }]
        , ['one', 'five', 'six', 'seven']);
      // assert
      expect(mockLoggerService.error).toHaveBeenCalledWith(ERRORS.AI_FIND_INSUFFISANT_ACCURACY);
    });

    it('should AI_FIND_NOTHING_FOUND', async () => {
      // arrange
      // act
      await usecase.execute(
        [{
          words: ['one', 'two', 'tree', 'four'],
        }]
        , ['five', 'six', 'seven']);
      // assert
      expect(mockLoggerService.error).toHaveBeenCalledWith(ERRORS.AI_FIND_NOTHING_FOUND);
    });
  })
})