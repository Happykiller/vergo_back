import { describe, expect, it } from '@jest/globals';
import { mock, MockProxy } from 'jest-mock-extended';

import { Inversify } from '@src/inversify/investify';
import { glossaryFake } from '@service/db/fake/mock/glossary';
import { TokenizeUsecase } from '@usecase/ai/tokenize.usecase';
import { GetGlossaryUsecase } from '@usecase/glossary/get.glossary.usecase';

describe('TokenizeUsecase', () => {
  const mockInversify: MockProxy<Inversify> = mock<Inversify>();
  const mockGetGlossaryUsecase: MockProxy<GetGlossaryUsecase> = mock<GetGlossaryUsecase>();

  mockGetGlossaryUsecase.execute.mockResolvedValue(glossaryFake);
  mockInversify.getGlossaryUsecase = mockGetGlossaryUsecase;

  const usecase: TokenizeUsecase = new TokenizeUsecase(mockInversify);

  describe('#execute', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(usecase).toBeDefined();
    })

    it('should tokenize `un pied push` => ["foot", "push"]', async () => {
      // arrange
      // act
      const response = await usecase.execute('un pied push');
      // assert
      expect(response).toEqual(["foot", "push"]);
    });
  
    it('should tokenize `butt_kicks.jpg` => ["butt", "kick"]', async () => {
      // arrange
      // act
      const response = await usecase.execute('butt_kicks.jpg');
      // assert
      expect(response).toEqual(["butt", "kick"]);
    });
  })

  describe('#replaceTermsWithKeys', () => {
    it('should nominal', async () => {
      // arrange
      // act
      const response = usecase.replaceTermsWithKeys('un pied push', glossaryFake);
      // assert
      expect(response).toEqual('un foot push');
    });

    it('should catch', async () => {
      // arrange
      // act
      const response = usecase.replaceTermsWithKeys(null, glossaryFake);
      // assert
      expect(response).toEqual(null);
    });
  })

  describe('#processFileName', () => {
    it('should nominal', async () => {
      // arrange
      // act
      const response = usecase.processFileName('try.one.ts');
      // assert
      expect(response).toEqual(["try", "one"]);
    });
  })
  
})