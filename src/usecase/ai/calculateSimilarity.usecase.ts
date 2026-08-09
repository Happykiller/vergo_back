import { Inversify } from '@src/inversify/investify';

export class CalculateSimilarityUsecase {
  /**
   * Calcule une similarité entre un vecteur d'entrée et un vecteur de référence
   * en réutilisant la logique de FindMostAccurateFileUsecase :
   *
   * 1. On cherche les positions d'occurrence de chaque mot de inputVector dans referenceVector
   * 2. "accuracy" = nbMotsTrouvés / taille inputVector
   * 3. "wordsWeight" = taille inputVector / taille referenceVector
   * 4. On renvoie un objet similaire à found_stats + une "similarity" qui combine (à votre convenance)
   */
  public execute(
    inputVector: string[],
    referenceVector: string[]
  ): {
    accuracy: number;
    wordsWeight: number;
    similarity: number;
    positionsScore: number;
  } {
    const positions = this.findMatchingSubsequencePositions(referenceVector, inputVector);

    // accuracy: nb de mots trouvés / taille du vecteur d'entrée
    const accuracy = positions.length / inputVector.length;

    // wordsWeight: nb de mots trouvés / taille du vecteur de référence
    const wordsWeight = positions.length / referenceVector.length;

    // positionsSum: somme des positions (pour départager des tie-break)
    const positionsSum = positions.reduce((acc, cur) => acc + cur, 0);

    // Calcul de la positionsScore, normalisée et pondérée par accuracy
    const M = positions.length; // mots trouvés
    const N = referenceVector.length; // taille de la référence
    let positionsScore = 0;
    if (M > 0 && N > 1) {
      const maxPossibleSum = (N - 1) * M;
      const rawPosScore = 1 - positionsSum / maxPossibleSum;
      positionsScore = accuracy * rawPosScore;
    }

    // Similarity => on prend la moyenne de accuracy, wordsWeight et positionsScore
    //let similarity = (accuracy + wordsWeight + positionsScore) / 3;
    let similarity = (accuracy + wordsWeight) / 2;
    similarity = Math.round(similarity * 100) / 100;

    return {
      accuracy,
      wordsWeight,
      positionsScore,
      similarity,
    };
  }

  /**
   * Trouve les positions des mots du inputVector dans le referenceVector,
   * de la même façon que dans FindMostAccurateFileUsecase.
   */
  private findMatchingSubsequencePositions(referenceWords: string[], inputWords: string[]): number[] {
    const positions: number[] = [];
    for (const w of inputWords) {
      const pos = referenceWords.indexOf(w);
      if (pos >= 0) {
        positions.push(pos);
      }
    }
    return positions;
  }
}
