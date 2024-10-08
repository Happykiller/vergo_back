import { describe, expect, it } from '@jest/globals';

import { Common } from '@presentation/common/common';

describe('Common', () => {
  const common: Common = new Common();

  describe('Common', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(common).toBeDefined();
    })
  })

  describe('#order_img', () => {
    it('should order', async () => {
      // arrange
      // act
      const response = common.order_img([
        [ 'wind', 'squat' ],
        [ 'burpee' ],
        [ 'butt', 'kick' ],
        [ 'child', 'stand' ],
        [
          'concept',  'design',
          'woman',    'stepping',
          'four',     'cardio',
          'training'
        ]
      ]);
      // assert
      expect(response).toEqual([
        [ 'burpee' ],
        [ 'butt', 'kick' ],
        [ 'child', 'stand' ],
        [
          'concept',  'design',
          'woman',    'stepping',
          'four',     'cardio',
          'training'
        ],
        [ 'wind', 'squat' ]
      ]);
    });
  })
})