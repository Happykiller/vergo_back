import { Inversify } from '@src/inversify/investify';

type CollectionItem = { words: string[] };

interface ResultItem {
  item: CollectionItem;
  positions: number[];
}

export class FindMostAccurateFileUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  execute(collection: CollectionItem[], words: string[]): any  {
    // Function to find the positions of matching subsequences respecting the order
  const findMatchingSubsequencePositions = (itemWords: string[], words: string[]): number[] => {
    let positions: number[] = [];
    let j = 0;

    for (let i = 0; i < itemWords.length && j < words.length; i++) {
      if (itemWords[i] === words[j]) {
        positions.push(i);
        j++;
      }
    }

    return j === words.length ? positions : [];
  };

  // Collect the results with positions
  let results: ResultItem[] = collection.map(item => {
    return { item, positions: findMatchingSubsequencePositions(item.words, words) };
  });

  // Filter out results with no matching subsequences
  results = results.filter(result => result.positions.length > 0);

  // Sort results by the sum of positions
  results.sort((a, b) => {
    const sumA = a.positions.reduce((acc, pos) => acc + pos, 0);
    const sumB = b.positions.reduce((acc, pos) => acc + pos, 0);
    return sumA - sumB;
  });

    return results[0]?.item;
  }
}
