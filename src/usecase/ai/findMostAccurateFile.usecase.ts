import { Inversify } from '@src/inversify/investify';

type CollectionItem = { words: string[] };

export class FindMostAccurateFileUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  execute(collection: CollectionItem[], words: string[]): any  {
    try {
      // Function to find the positions of matching subsequences
      const findMatchingSubsequencePositions = (itemWords: string[], words: string[]): number[] => {
        let positions: number[] = [];

        for(let word of words) {
          const pos = itemWords.indexOf(word);
          if(pos >= 0) {
            positions.push(pos)
          }
        }

        return positions;
      };

      const getResultWithMostPositions = (data: any[]): any[] => {
        let maxPositions = 0;
        let result: any[] = [];
      
        data.forEach(item => {
          if (item.positions.length > maxPositions) {
            maxPositions = item.positions.length;
          }
        });

        data.forEach(item => {
          if (item.positions.length === maxPositions) {
            result.push({
              ...item,
              weight: item.positions.reduce((acc, curr) => acc + curr, 0)
            });
          }
        });
      
        return result;
      }

      const getResultWithWeight = (data: any[]): any[] => {
        let min = 999;
        let result: any[] = [];
      
        data.forEach(item => {
          if (item.weight < min) {
            min = item.weight;
          }
        });

        data.forEach(item => {
          if (item.weight === min) {
            result.push(item);
          }
        });
      
        return result;
      }

      const getResultSmaller = (datas: any[]): any[] => {
        let min = 999;
        let result: any[] = [];
      
        datas.forEach(data => {
          if (data.item.words.length < min) {
            min = data.item.words.length;
          }
        });

        datas.forEach(data => {
          if (data.item.words.length === min) {
            result.push(data);
          }
        });
      
        return result;
      }

      /**
       * Collect the results with positions
       */
      let results: any[] = collection.map(item => {
        return { 
          item, 
          positions: findMatchingSubsequencePositions(item.words, words) 
        };
      });

      /**
       * Calcul accurency
       */
      results = results.map(result => {
        return { 
          ... result,
          accurency: result.positions.length / words.length,
          wordsWeight: words.length / result.item.words.length
        };
      });

      /**
       * Filter out results with max positions
       */
      results = getResultWithMostPositions(results.filter(result => result.positions.length > 0));

      /**
       * Get by min Weight
       */  
      results = getResultWithWeight(results);

      /**
       * Search smaller result
       */
      results = getResultSmaller(results);

      return results[0]?.item;
    } catch(ex) {
      this.inversify.loggerService.error(ex.message);
    }
  }
}
