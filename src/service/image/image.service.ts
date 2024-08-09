import * as fs from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
import { removeStopwords } from 'stopword';
import inversify from '../../inversify/investify';

interface CachedData {
  files: any[];
  timestamp: number;
}

type FileData = {
  name: string;
  metaName: string[];
  isDirectory: boolean;
  size: number;
  lastModified: Date;
  accuracy?: number
};

export class ImageService {
  private readonly imagesPath = 'images/';
  private cachedFileList: CachedData | null = null;
  private cacheTTL: number = 5 * 60 * 1000; // 5min * 60s * 1000 ms

  removeFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return fileName; // Aucun point trouvé, retourner le nom original
  
    return fileName.substring(0, lastDotIndex);
  }

  processFileName(fileName: string): string[] {
    // Retirer l'extension du fichier
    const lastDotIndex = fileName.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    
    // Remplacer les caractères '_', '-', '.' par un espace
    const cleanedName = baseName.replace(/[_\-.]/g, ' ');
    
    // Diviser en mots
    const words = cleanedName.split(' ').filter(word => word.length > 0);
  
    return words;
  }

  // Fonction pour traduire les mots
  async translateWords(words: string[]): Promise<string[]> {
    return words;
  }

  // Fonction pour retirer les stopwords d'une liste de mots
  removeStopWords(words: string[]): string[] {
    return removeStopwords(words, removeStopwords.fr);
  }

  // Fonction pour obtenir la liste des fichiers
  getFileList = async (): Promise<any[]> => {
    const files = fs.readdirSync(this.imagesPath);

    let fileList = [];
    for(let file of files) {
      const fullPath = join(this.imagesPath, file);
      const stats = fs.statSync(fullPath);

      let tmp = this.removeFileExtension(file);
      let listWord = this.processFileName(tmp);
      listWord = await this.translateWords(listWord);
      listWord = this.removeStopWords(listWord);

      fileList.push({
        name: file,
        metaName: listWord,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        lastModified: stats.mtime
      });
    }

    return fileList;
  }

  calculateAccuracy(metaName: string[], words: string[]): number {
    const commonWords = metaName.filter(word => words.includes(word));
    return commonWords.length / Math.max(metaName.length, words.length);
  }
  
  findMostAccurateFile(datas: FileData[], words: string[]): FileData | null {
    let maxAccuracy = 0;
    let mostAccurateFile: FileData | null = null;
  
    for (const data of datas) {
      const accuracy = this.calculateAccuracy(data.metaName, words);
      data.accuracy = accuracy;
      if (accuracy > maxAccuracy) {
        maxAccuracy = accuracy;
        mostAccurateFile = data;
      }
    }
  
    return mostAccurateFile;
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
      const currentTime = Date.now();
      let from = 'cache';
      let tmp = this.removeFileExtension(filename);
      let listWord = this.processFileName(tmp);
      listWord = await this.translateWords(listWord);
      listWord = this.removeStopWords(listWord);

      /***
       * The list
       */
      let fileList: any[];
      if (this.cachedFileList && currentTime - this.cachedFileList.timestamp < this.cacheTTL) {
        fileList = this.cachedFileList.files;
      } else {
        from = 'disk';
        fileList = await this.getFileList();
        this.cachedFileList = {
          files: fileList,
          timestamp: currentTime
        };
      }

      let mostAccurateFile = this.findMostAccurateFile(fileList, listWord);

      let filePath = 'not_found.jpg';
      if(mostAccurateFile) {
        inversify.loggerService.log(
          'info',
          `Successfully found '${mostAccurateFile.name}' (from ${from}) with accuracy:${mostAccurateFile.accuracy} for ${filename}`,
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
