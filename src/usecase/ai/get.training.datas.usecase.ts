// src\usecase\ai\get.training.datas.usecase.ts
import * as fs from 'fs';
import { Common } from '@src/common/common';
import { Inversify } from '@src/inversify/investify';
import { CalculateSimilarityUsecase } from './calculateSimilarity.usecase';

interface BucketRange {
  lower: number;
  upper: number;
  label: string;
}

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
  private createFile(name: string, data: unknown): void {
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

  async execute(): Promise<[string[], string[]][]> {
    // Récupération des données
    const imgs = await this.common.getFileList();
    let words_imgs = imgs.map(elt => elt.words);

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
        const replacedByWoman = words.map(token => token === 'man' ? 'woman' : token);
        exercices_db.push(replacedByWoman);
      } else if (hasWoman) {
        // Si contient déjà "woman", on ajoute la version d'origine
        // et on génère la version avec "man"
        exercices_db.push(words);
        const replacedByMan = words.map(token => token === 'woman' ? 'man' : token);
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
        similarityResult
      });
      for (let j = 0; j < words_imgs.length; j++) {
        let similarityResult = this.calculateSimilarityUsecase.execute(exercices_db[i], words_imgs[j]);
        // On enregistre le résultat sous forme de triplet
        resultat.push({
          source: exercices_db[i],
          ref: words_imgs[j],
          similarityResult,
        });
      }
    }

    // Formatage du pool au format [source, ref, similarity]
    const pool = resultat.map(r => [
      r.source,
      r.ref,
      r.similarityResult.similarity
    ]);

    // Fonction utilitaire pour mélanger un tableau (Fisher-Yates)
    function shuffleArray<T>(array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffleArray(pool);

    // Définition des buckets avec la nouvelle répartition
    const bucketRanges: BucketRange[] = [
      { lower: 0.0, upper: 0.0, label: "0.0-0.0" },
      { lower: 0.0, upper: 0.1, label: "0.0-0.1" },
      { lower: 0.1, upper: 0.2, label: "0.1-0.2" },
      { lower: 0.2, upper: 0.3, label: "0.2-0.3" },
      { lower: 0.3, upper: 0.4, label: "0.3-0.4" },
      { lower: 0.4, upper: 0.5, label: "0.4-0.5" },
      { lower: 0.5, upper: 0.6, label: "0.5-0.6" },
      { lower: 0.6, upper: 0.7, label: "0.6-0.7" },
      { lower: 0.7, upper: 0.8, label: "0.7-0.8" },
      { lower: 0.8, upper: 0.9, label: "0.8-0.9" },
      { lower: 0.9, upper: 1.0, label: "0.9-1.0" },
      { lower: 1.0, upper: 1.0, label: "1.0-1.0" },
    ];

    // Fonction pour déterminer dans quel bucket placer une similarité
    function getBucketIndex(similarity: number): number {
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

    // Création et remplissage des buckets (on ignore les 100 derniers éléments du pool comme auparavant)
    const buckets: Array<any[]> = Array.from({ length: bucketRanges.length }, () => []);
    for (const triple of pool.slice(0, -100)) {
      const similarity: number = triple[2];
      const bucketIndex = getBucketIndex(similarity);
      if (bucketIndex !== -1) {
        buckets[bucketIndex].push(triple);
      } else {
        console.warn(`La similarité ${similarity} ne correspond à aucune plage définie.`);
      }
    }

    // Affichage de la taille de chaque bucket
    for (let i = 0; i < buckets.length; i++) {
      console.log(`Bucket ${bucketRanges[i].label} length => ${buckets[i].length}`);
    }

    // Lissage : équilibre des buckets selon le bucket ayant le moins d'éléments
    const minBucketSize = Math.min(...buckets.map(bucket => bucket.length));
    console.log(`Taille minimale des buckets : ${minBucketSize}`);
    const balancedBuckets = buckets.map(bucket => {
      if (bucket.length > minBucketSize) {
        shuffleArray(bucket);
        return bucket.slice(0, minBucketSize);
      }
      return bucket;
    });

    // Supposons que balancedBuckets soit un tableau de buckets équilibrés (après lissage)
    const totalBuckets = balancedBuckets.length;
    const totalTestSize = 20;

    // Répartition du test set de façon égale entre les buckets
    const baseTestCountPerBucket = Math.floor(totalTestSize / totalBuckets);
    let remainder = totalTestSize % totalBuckets;

    // Séparation en jeu de test et jeu d'entraînement :
    // Pour chaque bucket, on prélève aléatoirement la moitié des éléments pour le test,
    // en les retirant du bucket, le reste constituant le training set.
    const testSet: [string[], string[], number][] = [];
    const trainingSet: [string[], string[], number][] = [];
    balancedBuckets.forEach(bucket => {
      // On mélange d'abord le bucket pour tirer des éléments aléatoirement
      shuffleArray(bucket);
    
      // On calcule le nombre d'éléments à extraire pour ce bucket
      let count = baseTestCountPerBucket;
      if (remainder > 0) {
        count += 1;
        remainder--;
      }
      // Au cas où le bucket aurait moins d'éléments que count
      count = Math.min(count, bucket.length);
    
      // On retire aléatoirement 'count' éléments du bucket pour le test
      // splice retire et renvoie les éléments extraits
      const bucketTest = bucket.splice(0, count);
      testSet.push(...bucketTest);
    
      // Le reste du bucket constituera le training set
      trainingSet.push(...bucket);
    });

    console.log(`Taille du jeu de test : ${testSet.length}`);
    console.log(`Taille du jeu d'entraînement : ${trainingSet.length}`);
    console.log(`trainData length après équilibrage => ${trainingSet.length}`);

    this.createFile('o3_train', trainingSet);
    this.createFile('o3_test', testSet);

    return [];
  }
}
