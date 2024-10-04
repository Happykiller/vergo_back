import { Inversify } from '@src/inversify/investify';
import { TrainingUsecaseModel } from '../training/model/training.usecase.model';
import { Common } from '@src/common/common';

export class GetTrainingDatasUsecase {
  inversify: Inversify;
  common: Common;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
    this.common = new Common(inversify);
  }

  async execute(): Promise<[string[], string[]][]> {
    const imgs = await this.common.getFileList();

    const exercices = await this.inversify.getExercicesUsecase.execute();
    const exercices_db = [];
    for(let exercice of exercices) {
      let words = [];
      if(exercice.image) {
        words = await this.inversify.tokenizeUsecase.execute(exercice.image);
      } else {
        words = await this.inversify.tokenizeUsecase.execute(exercice.slug);
      }

      let man_words = [...words];
      if (!man_words.includes('man')) {
        // Ajouter "man" au début du tableau
        man_words.unshift("man"); 
      }

      let found = this.inversify.findMostAccurateFileUsecase.execute(imgs, man_words);
      exercices_db.push({
        source: exercice.image??exercice.slug,
        tokenized: man_words,
        found
      })

      let woman_words = [...words];
      if (!woman_words.includes('woman')) {
        // Ajouter "man" au début du tableau
        woman_words.unshift("woman"); 
      }

      found = this.inversify.findMostAccurateFileUsecase.execute(imgs, woman_words);

      exercices_db.push({
        source: exercice.image??exercice.slug,
        tokenized: woman_words,
        found
      })
    }

    //console.log(JSON.stringify(exercices_db))

    let response:any = exercices_db.map(elt => [elt.tokenized, elt.found.words]);
    return response;
  }
}
