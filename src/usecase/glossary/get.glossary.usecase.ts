import { Inversify } from '@src/inversify/investify';
import { GlossaryUsecaseModel } from '@usecase/glossary/model/glossary.usecase.model';

export class GetGlossaryUsecase {
  inversify: Inversify;
  glossary:GlossaryUsecaseModel;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(): Promise<GlossaryUsecaseModel> {
    if(this.glossary === undefined) {
      this.inversify.loggerService.debug('GetGlossaryUsecase#execute: Load glossary');
      this.glossary = await this.inversify.bddService.getGlossary();

      /*const { _id, ...rest } = this.glossary; // Exclure la clé _id
      const values = Object.keys(rest);
          console.log(JSON.stringify(values))*/
    }
      
    return this.glossary;
  }
}
