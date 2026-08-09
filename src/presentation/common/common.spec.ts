// src\presentation\common\common.spec.ts
import { describe, expect, it } from '@jest/globals';

import { Common, PaginateSortOrderDto } from '@presentation/common/common';

describe('Common', () => {
  const common: Common = new Common();

  describe('Common', () => {
    it('should build', () => {
      // arrange
      // act
      // assert
      expect(common).toBeDefined();
    });
  });

  describe('#order_img', () => {
    it('should order', async () => {
      // arrange
      // act
      const response = common.order_img([
        ['wind', 'squat'],
        ['burpee'],
        ['butt', 'kick'],
        ['child', 'stand'],
        ['concept', 'design', 'woman', 'stepping', 'four', 'cardio', 'training'],
      ]);
      // assert
      expect(response).toEqual([
        ['burpee'],
        ['butt', 'kick'],
        ['child', 'stand'],
        ['concept', 'design', 'woman', 'stepping', 'four', 'cardio', 'training'],
        ['wind', 'squat'],
      ]);
    });
  });

  describe('#paginate', () => {
    const list = [
      { id: 2, name: 'b' },
      { id: 3, name: 'c' },
      { id: 1, name: 'a' },
    ];

    it('should paginate without order_by', () => {
      // arrange
      const dto = { list, offset: 1, limit: 1 };

      // act
      const result = common.paginate(dto);

      // assert
      expect(result).toEqual({ count: 3, nodes: [list[1]] });
    });

    it('should sort by field ASC', () => {
      // arrange
      const dto = {
        list,
        order_by: { field: 'id', order: PaginateSortOrderDto.ASC },
      };

      // act
      const result = common.paginate(dto);

      // assert
      expect(result.nodes).toEqual([
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'c' },
      ]);
    });

    it('should sort by field DESC', () => {
      // arrange
      const dto = {
        list,
        order_by: { field: 'name', order: PaginateSortOrderDto.DESC },
      };

      // act
      const result = common.paginate(dto);

      // assert
      expect(result.nodes).toEqual([
        { id: 3, name: 'c' },
        { id: 2, name: 'b' },
        { id: 1, name: 'a' },
      ]);
    });

    it('should return all items if no offset/limit', () => {
      // arrange
      const dto = { list };

      // act
      const result = common.paginate(dto);

      // assert
      expect(result.nodes.length).toBe(3);
    });

    it('should return empty list if limit is 0', () => {
      // arrange
      const dto = { list, limit: 0 };

      // act
      const result = common.paginate(dto);

      // assert
      expect(result).toEqual({ count: 3, nodes: [] });
    });

    it('should return empty list if offset >= list.length', () => {
      // arrange
      const dto = { list, offset: 10, limit: 5 };

      // act
      const result = common.paginate(dto);

      // assert
      expect(result).toEqual({ count: 3, nodes: [] });
    });

    it('should sort sub-arrays based on joined string values', () => {
      // arrange
      const input = [['zebra'], ['apple'], ['monkey']];

      // act
      const result = common.order_img(input);

      // assert
      expect(result).toEqual([['apple'], ['monkey'], ['zebra']]);
    });

    it('should handle equal strings in sort (localeCompare === 0)', () => {
      // arrange
      const input = [['abc'], ['abc'], ['abd']];

      // act
      const result = common.order_img(input);

      // assert
      expect(result).toEqual([['abc'], ['abc'], ['abd']]);
    });

    it('should sort but return 0 when field values are equal', () => {
      // arrange
      const listWithEquals = [
        { id: 1, name: 'alpha' },
        { id: 2, name: 'beta' },
        { id: 3, name: 'alpha' }, // même `name` que le premier
      ];
      const dto = {
        list: listWithEquals,
        order_by: { field: 'name', order: PaginateSortOrderDto.ASC },
      };

      // act
      const result = common.paginate(dto);

      // assert
      expect(result.nodes).toEqual([
        { id: 1, name: 'alpha' },
        { id: 3, name: 'alpha' },
        { id: 2, name: 'beta' },
      ]);
    });
  });
});
