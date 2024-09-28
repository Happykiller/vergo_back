import * as fs from 'fs';

import inversify, { Inversify } from '@src/inversify/investify';

export class Common {
  private readonly inversify: Inversify;
  private readonly imagesPath = 'images/';

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  // Fonction pour obtenir la liste des fichiers
  getFileList = async (): Promise<any[]> => {
    const files = fs.readdirSync(this.imagesPath);

    let fileList = [];
    for(let file of files) {
      let listWord = await this.inversify.tokenizeUsecase.execute(file);

      fileList.push({
        name: file,
        words: listWord
      });
    }

    return fileList;
  }
}

const common = new Common(inversify);

export default common;