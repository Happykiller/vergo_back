// src\usecase\ai\get.training.datas.usecase.ts
import * as fs from 'fs';
import { Common } from '@src/common/common';
import { Inversify } from '@src/inversify/investify';
import { CalculateSimilarityUsecase } from './calculateSimilarity.usecase';

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
    // Génération du nom de fichier : name_YYMMDD.json
    const now = new Date();
    const yy = now.getFullYear().toString().slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    // Ajout de l'heure, de la minute et de la seconde dans la partie dateStr
    const dateStr = `${yy}${mm}${dd}${hh}${min}${ss}`;

    const fileName = `${name}_${dateStr}.json`;
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf8');
  }

  async execute(): Promise<[string[], string[]][]> {
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
        // Contient déjà "man" => On ajoute la version d'origine,
        // et on génère la version "woman" (en remplaçant toutes les occurrences).
        exercices_db.push(words);
        const replacedByWoman = words.map(token => token === 'man' ? 'woman' : token);
        exercices_db.push(replacedByWoman);

      } else if (hasWoman) {
        // Contient déjà "woman" => On ajoute la version d'origine,
        // et on génère la version "man".
        exercices_db.push(words);
        const replacedByMan = words.map(token => token === 'woman' ? 'man' : token);
        exercices_db.push(replacedByMan);

      } else {
        // Ne contient ni "man" ni "woman"
        const manWords = ['man', ...words];
        const womanWords = ['woman', ...words];
        exercices_db.push(manWords, womanWords);
      }
    }

    // Calculer la similarité entre chaque exercice_db et chaque words_imgs
    const resultat = [];
    for (let i = 0; i < exercices_db.length; i++) {
      resultat.push({
        source: exercices_db[i],
        ref: exercices_db[i],
        similarityResult: this.calculateSimilarityUsecase.execute(exercices_db[i], exercices_db[i]),
      });
      for (let j = 0; j < words_imgs.length; j++) {
        const similarityResult = this.calculateSimilarityUsecase.execute(exercices_db[i], words_imgs[j]);
        // On enregistre le résultat
        resultat.push({
          source: exercices_db[i],
          ref: words_imgs[j],
          similarityResult,
        });
      }
    }

    // On formate le fichier final au format List[Tuple[List[str], List[str], float]]
    // Autrement dit, on ne garde que (source, ref, similarity)
    const pool = resultat.map(r => [
      r.source,
      r.ref,
      r.similarityResult.similarity
    ]);

    // 1) Mélanger le tableau (Fisher-Yates)
    function shuffleArray<T>(array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffleArray(pool);

  const first100FromFiltered = pool.slice(0, 100);
  const last100FromPool = pool.slice(-100);
  const testData = [...first100FromFiltered, ...last100FromPool];

    const buckets: Array<any> = Array.from({ length: 10 }, () => []);

    for (const triple of pool.slice(0, -100)) {
      const similarity = triple[2];
      // Déterminer la tranche (0 => [0, 0.1[, 1 => [0.1, 0.2[ , etc.)
      let index = Math.floor(similarity * 10);
      // Si similarity == 1, alors index = 10, on le rabat à 9
      if (index === 10) {
        index = 9;
      }
      // On n'ajoute que si la tranche n'a pas déjà 500 éléments
      if (buckets[index].length < 200) {
        buckets[index].push(triple);
      }
    }

    for (let i = 0; i < buckets.length; i++) {
      console.log(`Bucket ${i} length => ${buckets[i].length}`);
    }

    const trainData = buckets.flat();

    this.createFile('o3_test', testData);
    this.createFile('o3_train', trainData);

    return [];
  }
}
