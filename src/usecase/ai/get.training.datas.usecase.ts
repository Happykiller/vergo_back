// src\usecase\ai\get.training.datas.usecase.ts
import * as fs from 'fs';
import { Common } from '@src/common/common';
import { Inversify } from '@src/inversify/investify';
import { CalculateSimilarityUsecase } from '@usecase/ai/calculateSimilarity.usecase';

interface BucketRange {
  lower: number;
  upper: number;
  label: string;
  records: any[];
}

export class GetTrainingDatasUsecase {
  inversify: Inversify;
  common: Common;
  calculateSimilarityUsecase: CalculateSimilarityUsecase;
  bucketSizeMax = 0; //-1 unable, 0 min bucket, x size
  poolTestSize = 20;

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

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]; // Créer une copie pour éviter de modifier l'original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Fonction pour déterminer dans quel bucket placer une similarité
  getBucketIndex(similarity: number, bucketRanges): number {
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

  async execute(): Promise<[string[], string[]][]> {
    // Récupération des données
    const imgs = await this.common.getFileList();
    const words_imgs = imgs.map((elt) => elt.words);

    const exercices = await this.inversify.getExercicesUsecase.execute();
    const exercices_db = [];
    for (const exercice of exercices) {
      // On récupère les mots du champ image ou slug
      const words = exercice.image
        ? await this.inversify.tokenizeUsecase.execute(exercice.image)
        : await this.inversify.tokenizeUsecase.execute(exercice.slug);

      const hasMan = words.includes('man');
      const hasWoman = words.includes('woman');

      if (hasMan) {
        // Si contient déjà "man", on ajoute la version d'origine
        // et on génère la version avec "woman" (en remplaçant toutes les occurrences)
        exercices_db.push(words);
        const replacedByWoman = words.map((token) => (token === 'man' ? 'woman' : token));
        exercices_db.push(replacedByWoman);
      } else if (hasWoman) {
        // Si contient déjà "woman", on ajoute la version d'origine
        // et on génère la version avec "man"
        exercices_db.push(words);
        const replacedByMan = words.map((token) => (token === 'woman' ? 'man' : token));
        exercices_db.push(replacedByMan);
      } else {
        // Sinon, on ajoute les deux versions en préfixant par "man" et "woman"
        const manWords = ['man', ...words];
        const womanWords = ['woman', ...words];
        exercices_db.push(manWords, womanWords);
      }
    }

    // Calcul des similarités entre chaque exercice et chaque image
    const resultat = [];
    for (let i = 0; i < exercices_db.length; i++) {
      const similarityResult = this.calculateSimilarityUsecase.execute(exercices_db[i], exercices_db[i]);
      resultat.push({
        source: exercices_db[i],
        ref: exercices_db[i],
        similarityResult,
      });
      for (let j = 0; j < words_imgs.length; j++) {
        const similarityResult = this.calculateSimilarityUsecase.execute(exercices_db[i], words_imgs[j]);
        // On enregistre le résultat sous forme de triplet
        resultat.push({
          source: exercices_db[i],
          ref: words_imgs[j],
          similarityResult,
        });
      }
    }

    // Formatage du pool au format [source, ref, similarity]
    let pool: [string[], string[], number][] = resultat.map((r) => [r.source, r.ref, r.similarityResult.similarity]);

    pool = this.shuffleArray(pool);

    const info: any = {
      poolSize: pool.length,
      bucketDetails: [],
    };

    console.log(`Taille du pool : ${pool.length}`);

    //this.createFile('o3_debug', pool);

    // Définition des buckets avec la nouvelle répartition
    const buckets: BucketRange[] = [
      { lower: 0.0, upper: 0.0, label: '0.0-0.0', records: [] },
      { lower: 0.0, upper: 0.1, label: '0.0-0.1', records: [] },
      { lower: 0.1, upper: 0.2, label: '0.1-0.2', records: [] },
      { lower: 0.2, upper: 0.3, label: '0.2-0.3', records: [] },
      { lower: 0.3, upper: 0.4, label: '0.3-0.4', records: [] },
      { lower: 0.4, upper: 0.5, label: '0.4-0.5', records: [] },
      { lower: 0.5, upper: 0.6, label: '0.5-0.6', records: [] },
      { lower: 0.6, upper: 0.7, label: '0.6-0.7', records: [] },
      { lower: 0.7, upper: 0.8, label: '0.7-0.8', records: [] },
      { lower: 0.8, upper: 0.9, label: '0.8-0.9', records: [] },
      { lower: 0.9, upper: 1.0, label: '0.9-1.0', records: [] },
      { lower: 1.0, upper: 1.0, label: '1.0-1.0', records: [] },
    ];

    for (const triple of pool) {
      const similarity: number = triple[2];
      const bucketIndex = this.getBucketIndex(similarity, buckets);
      if (bucketIndex !== -1) {
        buckets[bucketIndex].records.push(triple);
      } else {
        console.warn(`La similarité ${similarity} ne correspond à aucune plage définie.`);
      }
    }

    // Affichage de la taille de chaque bucket
    console.log('Affichage de la taille de chaque bucket');
    for (let i = 0; i < buckets.length; i++) {
      console.log(`Bucket ${buckets[i].label} length => ${buckets[i].records.length}`);
      info.bucketDetails.push({
        label: buckets[i].label,
        length: buckets[i].records.length,
      });
    }

    let finalPool: [string[], string[], number][];

    if (this.bucketSizeMax === -1) {
      // -1 => on ne filtre pas, on garde tout
      finalPool = pool;
    } else if (this.bucketSizeMax === 0) {
      // =0 => on cherche la taille minimale parmi tous les buckets
      const minBucketSize = Math.min(...buckets.map((b) => b.records.length));
      // puis on prend cette même quantité (minBucketSize) dans chacun des buckets
      finalPool = buckets.flatMap((bucket) => bucket.records.slice(0, minBucketSize));
    } else {
      // > 0 => on prend bucketSizeMax éléments dans chaque bucket
      finalPool = buckets.flatMap((bucket) => bucket.records.slice(0, this.bucketSizeMax));
    }

    // On mélange finalPool pour éviter un ordre systématique
    finalPool = this.shuffleArray(finalPool);

    console.log(`Taille du finalPool : ${finalPool.length}`);
    info.finalPoolSize = finalPool.length;

    let testSet: [string[], string[], number][] = [];
    let trainingSet: [string[], string[], number][] = [];

    const testSetPart1 = finalPool.splice(0, this.poolTestSize / 2);

    // 2) On ajoute encore 10 éléments (slice) mais sans les retirer du pool
    const testSetPart2 = finalPool.slice(0, this.poolTestSize / 2);

    // 3) On fusionne ces deux séries d'éléments pour obtenir testSet
    testSet = [...testSetPart1, ...testSetPart2];

    // 4) La variable pool a déjà perdu 10 éléments (ceux de testSetPart1),
    //    les 10 éléments de testSetPart2 sont toujours dedans, donc trainingSet devient le pool actuel
    trainingSet = finalPool;

    console.log(`Taille du jeu de test : ${testSet.length}`);
    info.testSetSize = testSet.length;

    console.log(`Taille du jeu d'entraînement : ${trainingSet.length}`);
    info.trainingSetSize = trainingSet.length;

    this.createFile('o3_train', trainingSet);
    this.createFile('o3_test', testSet);
    this.createFile('o3_info', info);

    return [];
  }
}
