import { join } from 'path';
import * as sharp from 'sharp';

import { config } from '@src/config';
import { Common } from '@src/common/common';
import inversify, { Inversify } from '@src/inversify/investify';

interface CachedData {
  files: any[];
  timestamp: number;
}

export class ImageService {
  common: Common;
  private readonly inversify: Inversify;
  private readonly imagesPath = 'images/';
  private cachedFileList: CachedData | null = null;
  private cacheTTL: number = 24 * 60 * 60 * 1000; // 24h * 60min * 60s * 1000 ms

  constructor(inversify: Inversify) {
    this.inversify = inversify;
    this.common = new Common(inversify);
  }

  /**
   * Trouver une image, avec possibilité de redimensionnement tout en conservant les proportions
   * @param filename Nom du fichier image
   * @param width Largeur souhaitée, optionnelle
   * @param height Hauteur souhaitée, optionnelle
   * @param v2 for use AI
   * @returns Buffer de l'image traitée
   */
  async getImage(filename: string, width?: number, height?: number, v2?: boolean): Promise<Buffer> {
    try {
      /**
       * tokenize request
       */
      const words = await this.inversify.tokenizeUsecase.execute(filename);

      /***
       * The list
       */
      const currentTime = Date.now();
      let from = 'cache';
      let fileList: any[];
      if (this.cachedFileList && currentTime - this.cachedFileList.timestamp < this.cacheTTL) {
        fileList = this.cachedFileList.files;
      } else {
        from = 'disk';
        fileList = await this.common.getFileList();
        this.cachedFileList = {
          files: fileList,
          timestamp: currentTime,
        };
      }

      let mostAccurateFile;
      if (v2) {
        const url = `${config.puppet.url}/search`; // Variable d'environnement pour l'hôte
        const token = config.puppet.token; // Variable d'environnement pour le token

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const body = {
          name: 'puppet-o3',
          neural_network_type: 'SIAMESE',
          vector: words,
        };

        try {
          const response: any = await this.inversify.httpService.post(url, body, headers);

          inversify.loggerService.log('debug', `AI service response '${JSON.stringify(response)}' from ${JSON.stringify(words)}`);

          function findMatchingFile(fileList, findWords) {
            return fileList.find((file) => findWords.every((word) => file.words.includes(word)));
          }

          // Chercher la correspondance
          mostAccurateFile = findMatchingFile(fileList, response.find);
        } catch (error) {
          inversify.loggerService.log('debug', url, body, headers);
          inversify.loggerService.log('error', error);
        }
      } else {
        /**
         * find response
         */
        mostAccurateFile = this.inversify.findMostAccurateFileUsecase.execute(fileList, words);

        inversify.loggerService.log('debug', `Logic service response '${JSON.stringify(mostAccurateFile)}' from ${JSON.stringify(words)}`);
      }

      /**
       * display response
       */
      let filePath = 'not_found.jpg';
      if (mostAccurateFile) {
        inversify.loggerService.log('info', `Successfully found '${mostAccurateFile.name}' (from ${from}) for ${filename}`);
        filePath = join(this.imagesPath, mostAccurateFile.name);
      } else {
        inversify.loggerService.log('error', `Not found (from ${from}) for ${filename}`);
      }

      let image;
      try {
        // Lire l'image d'origine
        image = await sharp(filePath).toBuffer();
      } catch (error) {
        image = await sharp('./not_found.jpg').toBuffer();
      }

      if (width || height) {
        // Redimensionner en gardant les proportions
        const resizeOptions: sharp.ResizeOptions = {
          fit: sharp.fit.inside, // Redimensionner pour tenir à l'intérieur des dimensions données tout en préservant les proportions
          withoutEnlargement: true, // Ne pas agrandir l'image si elle est plus petite que les dimensions données
        };

        // Ajouter les dimensions spécifiées aux options de redimensionnement si elles sont définies
        if (width) resizeOptions.width = width;
        if (height) resizeOptions.height = height;

        // Appliquer le redimensionnement
        image = await sharp(image).resize(resizeOptions).toBuffer();
      }

      return image;
    } catch (error) {
      throw new Error('Image error processing image');
    }
  }
}
