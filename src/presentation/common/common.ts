export enum PaginateSortOrderDto {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginateOrderDto {
  field: string;
  order: PaginateSortOrderDto;
}

export class Common {
  /**
   * Paginates a list based on the provided offset, limit, and optional order_by key.
   * 
   * @param dto - The input object containing the list, offset, limit, and order_by key.
   * @param dto.list - The array of items to paginate.
   * @param dto.offset - The starting index for pagination (default is 0).
   * @param dto.limit - The maximum number of items to return (default is the length of the list).
   * @param dto.order_by - The field and order direction used for sorting (optional).
   * @returns An object containing the total count of items and the paginated list of nodes.
   */
  paginate(dto: { list: any[]; offset?: number; limit?: number; order_by?: PaginateOrderDto }): { count: number; nodes: any[] } {
    const { list, offset = 0, limit = list.length, order_by } = dto;

    // Apply sorting if 'order_by' is provided
    let sortedList = list;
    if (order_by) {
      sortedList = [...list].sort((a, b) => {
        const field = order_by.field;
        if (order_by.order === PaginateSortOrderDto.ASC) {
          if (a[field] > b[field]) return 1;
          if (a[field] < b[field]) return -1;
        } else {  // DESC order
          if (a[field] < b[field]) return 1;
          if (a[field] > b[field]) return -1;
        }
        return 0;
      });
    }

    // Apply pagination
    const paginatedList = sortedList.slice(offset, offset + limit);

    return {
      count: list.length,   // Total number of items in the original list
      nodes: paginatedList  // Paginated list
    };
  }

  order_img(elts: string[][]): string[][] {
    // 1. Éliminer les doublons au sein de chaque sous-tableau sans modifier l'ordre
    const uniqueSubArrays = elts.map(subArray => Array.from(new Set(subArray)));
  
    // 2. Trier les sous-tableaux par la concaténation de leurs éléments
    const sortedSubArrays = uniqueSubArrays.sort((a, b) => {
      const aStr = a.join('');
      const bStr = b.join('');
      return aStr.localeCompare(bStr);
    });
  
    return sortedSubArrays;
  }    
  
}

const common = new Common();

export default common;