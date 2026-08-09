// src\usecase\image\get.images.tokenized.usecase.ts
import { Common } from '@src/common/common';
import { Inversify } from '@src/inversify/investify';

export class GetImagesTokenizedUsecase {
  common: Common;
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
    this.common = new Common(inversify);
  }

  async execute(): Promise<string[][]> {
    const results = await this.common.getFileList();

    // Suivi des doublons
    const seenSets = new Map<string, number>();
    const duplicates: Map<string, any[]> = new Map();
    const uniqueResults: string[][] = [];

    results.forEach((result) => {
      // Convertir la liste en chaîne triée pour comparaison unique
      const key = JSON.stringify([...result.words]);

      if (seenSets.has(key)) {
        seenSets.set(key, seenSets.get(key)! + 1);

        // Ajouter l'élément d'origine dans la liste des doublons
        if (!duplicates.has(key)) {
          duplicates.set(
            key,
            results.filter((r) => JSON.stringify([...r.words]) === key)
          );
        }
      } else {
        seenSets.set(key, 1);
        uniqueResults.push(result.words); // Ajouter seulement s'il n'est pas déjà vu
      }
    });

    // Journaliser les doublons détectés
    duplicates.forEach((items, key) => {
      this.inversify.loggerService.log(
        'debug',
        `Duplicate found: ${JSON.parse(key)}, Count: ${items.length}`,
        items.map((item) => item.name)
      );
    });

    return uniqueResults;
  }
}
