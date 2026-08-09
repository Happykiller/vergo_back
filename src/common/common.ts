import * as fs from 'fs';

import { ERRORS } from '@src/common/ERROR';
import inversify, { Inversify } from '@src/inversify/investify';

export class Common {
  private readonly inversify: Inversify;
  private readonly imagesPath = 'images/';

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  // Fonction pour obtenir la liste des fichiers
  getFileList = async (dto?: { refresh: boolean }): Promise<any[]> => {
    try {
      const files = fs.readdirSync(this.imagesPath);

      const fileList = [];
      for (const file of files) {
        const listWord = await this.inversify.tokenizeUsecase.execute(file);

        fileList.push({
          name: file,
          words: listWord,
        });
      }

      await this.inversify.bddService.setImages(fileList);

      return fileList;
    } catch (e) {
      throw ERRORS.GET_FILE_LIST_FAIL;
    }
  };
}

const common = new Common(inversify);

export default common;
