import { readFileSync } from 'fs';
import * as pluralize from 'pluralize';
import { eng, removeStopwords } from 'stopword';

import { Inversify } from '@src/inversify/investify';

class GlossaryEntry {
  english: {
    base: string;
    synonyms: string[];
    plural: string;
    singular: string;
    common_misspellings: string[];
    slang: string[];
  };
  french: {
    base: string;
    synonyms: string[];
    plural: string;
    singular: string;
    common_misspellings: string[];
    slang: string[];
  };
}

export class TokenizeUsecase {
  inversify: Inversify;
  glossary: { [key: string]: GlossaryEntry };

  constructor(inversify: Inversify) {
    this.inversify = inversify;

    // Charger le glossary depuis le fichier JSON
    this.glossary = this.loadGlossary('src/datas/glossary.json');
  }

  execute(dto: string): string[] {
    let response = [];

    dto = this.removeFileExtension(dto);
    dto = this.replaceTermsWithKeys(dto, this.glossary);
    response = this.processFileName(dto);
    response = this.removeStopWords(response);
    response = this.singularizeWords(response);
      
    return response;
  }

  singularizeWords(words: string[]): string[] {
    return words.map(word => pluralize.singular(word));
  }
  
  // Fonction pour retirer les stopwords d'une liste de mots
  removeStopWords(words: string[]): string[] {
    let wordsToRemove: string[] = ['up'];
    let wordsToAdd: string[] = ['doing', 'doign', 'working', 'view', 'illustration', 'vector', 'praticing', 'background', 'white', 'exercise', 'flat'];

    let filteredWords = eng.filter(word => !wordsToRemove.includes(word));
    filteredWords = filteredWords.concat(wordsToAdd);

    return removeStopwords(words, filteredWords);
  }

  removeFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return fileName; // Aucun point trouvé, retourner le nom original
  
    return fileName.substring(0, lastDotIndex);
  }

  loadGlossary(filePath: string): { [key: string]: GlossaryEntry } {
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  
  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  processFileName(fileName: string): string[] {
    // Retirer l'extension du fichier
    const lastDotIndex = fileName.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

    // Remplacer tous les caractères non-alphanumériques par un espace
    const cleanedName = baseName.replace(/[^a-zA-Z]/g, ' ');

    // Diviser en mots et exclure les mots de moins de 2 caractères
    const words = cleanedName.split(' ').filter(word => word.length >= 2);

    return words;
  }
  
  replaceTermsWithKeys(text: string, glossary: { [key: string]: GlossaryEntry }): string {
    try {
      for (const key in glossary) {
        if (glossary.hasOwnProperty(key)) {
          const terms = [
            glossary[key].english.base,
            ...glossary[key].english.synonyms,
            glossary[key].english.plural,
            glossary[key].english.singular,
            ...glossary[key].english.common_misspellings,
            ...glossary[key].english.slang,
            glossary[key].french.base,
            ...glossary[key].french.synonyms,
            glossary[key].french.plural,
            glossary[key].french.singular,
            ...glossary[key].french.common_misspellings,
            ...glossary[key].french.slang,
          ];
  
          // Filter out undefined or null values
          const filteredTerms = terms.filter(term => term);
          const escapedTerms = filteredTerms.map(term => this.escapeRegExp(term)).join('|');
          const regex = new RegExp(`(?<=^|[\\W_])(${escapedTerms})(?=$|[\\W_])`, 'gi');
          text = text.replace(regex, key);
        }
      }
      return text;
    } catch(ex) {
      return text;
    }
  }
}
