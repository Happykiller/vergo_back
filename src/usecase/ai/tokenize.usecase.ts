import * as pluralize from 'pluralize';
import { fra, eng, removeStopwords } from 'stopword';

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
  glossary: { [key: string]: GlossaryEntry } = null;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: string): Promise<string[]> {
    let response = [];
    if (!this.glossary) {
      this.glossary = await this.inversify.getGlossaryUsecase.execute();
    }

    dto = this.removeFileExtension(dto);
    dto = this.replaceTermsWithKeys(dto, this.glossary);
    response = this.processFileName(dto);
    response = this.removeStopWords(response);

    response = Array.from(new Set(response));

    response = this.singularizeWords(response);

    return response;
  }

  singularizeWords(words: string[]): string[] {
    return words.map((word) => pluralize.singular(word));
  }

  // Fonction pour retirer les stopwords d'une liste de mots
  removeStopWords(words: string[]): string[] {
    const wordsEnToRemove: string[] = ['up'];
    const wordsEnToAdd: string[] = [
      'doing',
      'doign',
      'working',
      'view',
      'illustration',
      'vector',
      'praticing',
      'background',
      'white',
      'exercise',
      'flat',
      'nw',
      'null',
      'isolated',
      'backgound',
      'practice',
      'workout',
      'fitness',
      'horizontal',
      'free',
    ];

    const wordsFrToRemove: string[] = [];
    const wordsFrToAdd: string[] = [];

    const filteredEnWords = eng.filter((word) => !wordsEnToRemove.includes(word));
    const filteredFrWords = fra.filter((word) => !wordsFrToRemove.includes(word));
    const filteredWords = filteredEnWords.concat(wordsEnToAdd).concat(filteredFrWords).concat(wordsFrToAdd);

    return removeStopwords(words, filteredWords);
  }

  removeFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return fileName; // Aucun point trouvé, retourner le nom original

    return fileName.substring(0, lastDotIndex);
  }

  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  processFileName(fileName: string): string[] {
    const baseName = this.removeFileExtension(fileName);
    const cleanedName = baseName.replace(/[^a-zA-Z]/g, ' ');

    // Diviser en mots et exclure les mots de moins de 2 caractères
    const words = cleanedName.split(' ').filter((word) => word.length >= 2);

    return words;
  }

  replaceTermsWithKeys(text: string, glossary: { [key: string]: GlossaryEntry }): string {
    try {
      for (const [key, entry] of Object.entries(glossary)) {
        const terms = [
          entry.english.base,
          ...entry.english.synonyms,
          entry.english.plural,
          entry.english.singular,
          ...entry.english.common_misspellings,
          ...entry.english.slang,
          entry.french.base,
          ...entry.french.synonyms,
          entry.french.plural,
          entry.french.singular,
          ...entry.french.common_misspellings,
          ...entry.french.slang,
        ];

        const filteredTerms = terms.filter((term) => term);
        const escapedTerms = filteredTerms.map((term) => this.escapeRegExp(term)).join('|');
        const regex = new RegExp(`(?<=^|[\\W_])(${escapedTerms})(?=$|[\\W_])`, 'gi');
        text = text.replace(regex, key);
      }
      return text;
    } catch (ex) {
      return text;
    }
  }
}
