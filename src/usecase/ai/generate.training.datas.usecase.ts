// src\usecase\ai\get.training.datas.usecase.ts
import * as fs from 'fs';
import { Common } from '@src/common/common';
import { Inversify } from '@src/inversify/investify';
import { CalculateSimilarityUsecase } from './calculateSimilarity.usecase';

interface BucketRange {
  lower: number;
  upper: number;
  label: string;
  values: TrainingPair[]
}

type TrainingPair = [string[], string[], any];

export class GetTrainingDatasUsecase {
  inversify: Inversify;
  common: Common;
  calculateSimilarityUsecase: CalculateSimilarityUsecase;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
    this.common = new Common(inversify);
    this.calculateSimilarityUsecase = new CalculateSimilarityUsecase();
  }

  /**
   * Méthode qui génère le nom de fichier
   * en y insérant la date, puis qui écrit
   * le contenu `data` au format JSON.
   */
  createFile(name: string, data: unknown): void {
    // Génération du nom de fichier : name_YYMMDDHHMMSS.json
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const dateStr = `${yy}${mm}${dd}${hh}${min}${ss}`;
    const fileName = `${name}_${dateStr}.json`;
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
  }

  extractGlossaryFromWordsImgs(words_imgs: string[][]): string[] {
    // Aplatir le tableau de tableaux en un seul tableau de chaînes
    const flattenedWords = words_imgs.flat();
    // Normaliser chaque mot en minuscules et en supprimant les espaces superflus, puis extraire les valeurs uniques avec un Set
    const glossarySet = new Set(flattenedWords.map(word => word.toLowerCase().trim()));
    return Array.from(glossarySet);
  }

  // Fonction pour déterminer dans quel bucket placer une similarité
  getBucketIndex(bucketRanges: any, similarity: number): number {
    for (let i = 0; i < bucketRanges.length; i++) {
      const { lower, upper } = bucketRanges[i];
      // Pour les buckets avec bornes identiques, on ne retient que l'égalité
      if (lower === upper) {
        if (similarity === lower) {
          return i;
        }
      } else {
        // Pour le bucket "0.9-1.0", on exclut explicitement la valeur 1.0
        if (lower === 0.9 && upper === 1.0) {
          if (similarity > lower && similarity < upper) {
            return i;
          }
        } else {
          if (similarity > lower && similarity <= upper) {
            return i;
          }
        }
      }
    }
    return -1;
  }

  // Fonction pour générer un document aléatoire à partir du glossaire.
  // On choisit un nombre aléatoire de mots compris entre minWords et maxWords.
  generateRandomDocumentFromGlossary(glossary: string[], minWords = 3, maxWords = 20): string[] {
    const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const document: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * glossary.length);
      document.push(glossary[randomIndex]);
    }
    return document;
  }

  /**
   * Génère une version perturbée d'un document de base en remplaçant aléatoirement certains mots.
   * @param baseDoc Le document de base
   * @param glossary Glossaire utilisé pour le remplacement
   * @param perturbationProbability Probabilité de remplacer un mot (par défaut 0.1)
   * @returns Un nouveau document avec quelques mots remplacés
   */
  generatePerturbedDocument(
    baseDoc: string[],
    glossary: string[],
    perturbationProbability: number = 0.1
  ): string[] {
    return baseDoc.map(word => {
      if (Math.random() < perturbationProbability) {
        // Remplacer le mot par un mot aléatoire différent
        let newWord = word;
        // Boucler jusqu'à obtenir un mot différent pour éviter un remplacement identique
        while (newWord === word) {
          newWord = glossary[Math.floor(Math.random() * glossary.length)];
        }
        return newWord;
      }
      return word;
    });
  }

  /**
* Génère un document différent de baseDoc en excluant les mots déjà présents dans baseDoc (si possible).
* Cela permet d'obtenir des documents avec peu ou pas de chevauchement.
*/
  generateDissimilarDocument(
    baseDoc: string[],
    glossary: string[],
    minWords = 3,
    maxWords = 20
  ): string[] {
    // Commencez par prendre un mot aléatoire du baseDoc
    const commonWord = baseDoc[Math.floor(Math.random() * baseDoc.length)];
    // Génération d'un document avec quelques mots aléatoires en excluant commonWord pour le reste
    const remainingDoc = this.generateRandomDocumentFromGlossary(
      glossary.filter(word => word !== commonWord),
      minWords - 1,
      maxWords - 1
    );
    // Retourne un document qui inclut au moins ce mot commun
    return [commonWord, ...remainingDoc];
  }

  /**
 * Génère un nombre souhaité de paires de documents (doc1 et doc2)
 * dont la similarité, calculée via CalculateSimilarityUsecase, se situe dans l'intervalle défini par bucketRange.
 * Pour doc2 :
 * - 8% de chance : doc1 = doc2 (identiques)
 * - 8% de chance : doc2 est généré via generateRandomDocumentFromGlossary
 * - 20% de chance : doc2 est généré par generatePerturbedDocument (pour obtenir des similarités hautes)
 * - Sinon (64%) : doc2 est généré par generateDissimilarDocument (pour des similarités faibles)
 *
 * On arrête la génération dès que chaque bucket a atteint le nombre maximum de paires.
 *
 * @param bucketsRange L'intervalle de similarité visé pour chaque bucket
 * @param glossary Liste de mots à utiliser pour générer les documents
 * @param targetMin Nombre minimum de paires par bucket (par exemple 1000)
 * @param targetMax Nombre maximum de paires par bucket (par exemple 1500)
 * @returns true quand l'opération est terminée
 */
  generateBucketDocumentPairs(
    bucketsRange: BucketRange[],
    glossary: string[],
    targetMax: number = 1000
  ): boolean {
    let iteration = 0;
    // On augmente éventuellement le nombre maximal d'itérations pour éviter une boucle infinie
    const maxIterations = 10000000;

    // La boucle se poursuit tant qu'au moins un bucket n'a pas atteint targetMax
    while (iteration < maxIterations && !bucketsRange.every(bucket => bucket.values.length >= targetMax)) {
      iteration++;
      const doc1 = this.generateRandomDocumentFromGlossary(glossary);
      let doc2: string[];

      // Tirage aléatoire pour choisir la méthode de génération de doc2
      const rand = Math.random();
      if (rand < 0.08) {
        // 8% de chance : doc2 est identique à doc1
        doc2 = [...doc1];
      } else if (rand < 0.08 + 0.08) {
        // 8% de chance : doc2 est généré via generateRandomDocumentFromGlossary
        doc2 = this.generateRandomDocumentFromGlossary(glossary);
      } else if (rand < 0.08 + 0.08 + 0.20) {
        // 20% de chance : doc2 est généré via generatePerturbedDocument
        doc2 = this.generatePerturbedDocument(doc1, glossary);
      } else {
        // 64% de chance : doc2 est généré via generateDissimilarDocument
        doc2 = this.generateDissimilarDocument(doc1, glossary);
      }

      // Calcul de la similarité entre doc1 et doc2
      const similarityStats = this.calculateSimilarityUsecase.execute(doc1, doc2);
      const index_bucket = this.getBucketIndex(bucketsRange, similarityStats.similarity);

      // Ajout de la paire uniquement si le bucket n'a pas atteint targetMax
      if (bucketsRange[index_bucket].values.length < targetMax) {
        bucketsRange[index_bucket].values.push([doc1, doc2, similarityStats.similarity]);
      }
    }

    // Optionnel : avertir si un bucket n'a pas atteint le nombre minimum souhaité
    bucketsRange.forEach(bucket => {
      console.warn(`Bucket ${bucket.label} contient ${bucket.values.length} résultats.`);
    });

    return true;
  }


  async execute(): Promise<[string[], string[]][]> {
    // Récupération des données
    const imgs = await this.common.getFileList();
    let words_imgs = imgs.map(elt => elt.words);
    const glossary = this.extractGlossaryFromWordsImgs(words_imgs);

    // Définition des buckets avec la nouvelle répartition
    const bucketRanges: BucketRange[] = [
      { lower: 0.0, upper: 0.0, label: "0.0-0.0", values: [] },
      { lower: 0.0, upper: 0.1, label: "0.0-0.1", values: [] },
      { lower: 0.1, upper: 0.2, label: "0.1-0.2", values: [] },
      { lower: 0.2, upper: 0.3, label: "0.2-0.3", values: [] },
      { lower: 0.3, upper: 0.4, label: "0.3-0.4", values: [] },
      { lower: 0.4, upper: 0.5, label: "0.4-0.5", values: [] },
      { lower: 0.5, upper: 0.6, label: "0.5-0.6", values: [] },
      { lower: 0.6, upper: 0.7, label: "0.6-0.7", values: [] },
      { lower: 0.7, upper: 0.8, label: "0.7-0.8", values: [] },
      { lower: 0.8, upper: 0.9, label: "0.8-0.9", values: [] },
      { lower: 0.9, upper: 1.0, label: "0.9-1.0", values: [] },
      { lower: 1.0, upper: 1.0, label: "1.0-1.0", values: [] },
    ];

    this.generateBucketDocumentPairs(bucketRanges, glossary);

    // Fusionner tous les "values" des buckets en un seul tableau
    const mergedValues = bucketRanges.flatMap(bucket => bucket.values);

    // Mélange du tableau fusionné avec l'algorithme de Fisher-Yates
    for (let i = mergedValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mergedValues[i], mergedValues[j]] = [mergedValues[j], mergedValues[i]];
    }

    this.createFile('o3_train', mergedValues);

    return []
  }
}