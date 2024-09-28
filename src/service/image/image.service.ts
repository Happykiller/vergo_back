import { join } from 'path';
import * as sharp from 'sharp';

import common from '@src/common/common';
import inversify, { Inversify } from '@src/inversify/investify';

interface CachedData {
  files: any[];
  timestamp: number;
}

export class ImageService {
  private readonly inversify: Inversify;
  private readonly imagesPath = 'images/';
  private cachedFileList: CachedData | null = null;
  private cacheTTL: number = 60 * 60 * 1000; // 60min * 60s * 1000 ms

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  /**
   * Trouver une image, avec possibilité de redimensionnement tout en conservant les proportions
   * @param filename Nom du fichier image
   * @param width Largeur souhaitée, optionnelle
   * @param height Hauteur souhaitée, optionnelle
   * @returns Buffer de l'image traitée
   */
  async getImage(filename: string, width?: number, height?: number): Promise<Buffer> {
    try {
      /**
       * tokenize request
       */
      let words = await this.inversify.tokenizeUsecase.execute(filename);

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
        fileList = await common.getFileList();
        this.cachedFileList = {
          files: fileList,
          timestamp: currentTime
        };
      }

      /**
       * find response
       */
      let mostAccurateFile = this.inversify.findMostAccurateFileUsecase.execute(fileList, words);

      /**
       * display response
       */
      let filePath = 'not_found.jpg';
      if(mostAccurateFile) {
        inversify.loggerService.log(
          'info',
          `Successfully found '${mostAccurateFile.name}' (from ${from}) for ${filename}`,
        );
        filePath = join(this.imagesPath, mostAccurateFile.name);
      } else {
        inversify.loggerService.log(
          'info',
          `Not found (from ${from}) for ${filename}`,
        );
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
        image = await sharp(image)
          .resize(resizeOptions)
          .toBuffer();
      }

      return image;
    } catch (error) {
      throw new Error('Image error processing image');
    }
  }
}
