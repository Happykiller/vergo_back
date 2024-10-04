import * as fs from 'fs';

import inversify, { Inversify } from '@src/inversify/investify';
import { ERRORS } from './ERROR';

export class Common {
  private readonly inversify: Inversify;
  private readonly imagesPath = 'images/';

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  // Fonction pour obtenir la liste des fichiers
  getFileList = async (): Promise<any[]> => {
    try {
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
    } catch(e) {
      throw ERRORS.GET_FILE_LIST_FAIL;
    }
  }
}

const common = new Common(inversify);

export default common;