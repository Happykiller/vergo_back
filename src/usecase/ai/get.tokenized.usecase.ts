import { Inversify } from '@src/inversify/investify';

export class GetTokenizedUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<[string[], string[]][]> {

    const exercices = await this.inversify.getExercicesUsecase.execute();
    const results:any = [];
    for(let exercice of exercices) {
      results.push([[exercice.slug], await this.inversify.tokenizeUsecase.execute(exercice.slug)])
    }

    return results;
  }
}
