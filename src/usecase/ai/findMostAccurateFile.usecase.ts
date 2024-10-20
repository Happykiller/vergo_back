import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';

type CollectionItem = { words: string[] };

// Définition du type pour found_stats
type FoundStats = {
  accuracy: number; 
  wordsWeight: number;
};

// Définition du type principal avec propriétés obligatoires et flexibilité supplémentaire
type SearchResponse = {
  words: string[]; // Propriété obligatoire
  found_stats: FoundStats; // Propriété obligatoire
} & Record<string, any>; // Permet d'ajouter n'importe quelles autres propriétés

export class FindMostAccurateFileUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  execute(collection: CollectionItem[], words: string[]): SearchResponse {
    try {
      //console.log(JSON.stringify(collection.map(elt => elt.words)))

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
        result.item = {
          ... result.item,
          found_stats: {
            accurency: result.positions.length / words.length,
            wordsWeight: words.length / result.item.words.length
          }
        }
        return result;
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

      /**
       * Get the fist choice
       */
      if (results.length === 0) {
        throw new Error(ERRORS.AI_FIND_NOTHING_FOUND);
      } else if (results[0]?.item.found_stats.accurency < 0.33) {
        throw new Error(ERRORS.AI_FIND_INSUFFISANT_ACCURACY);
      }

      const response = results[0]?.item;

      return response;
    } catch(ex) {
      this.inversify.loggerService.error(ex.message);
    }
  }
}
