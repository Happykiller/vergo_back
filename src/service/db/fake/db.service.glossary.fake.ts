import { BddService } from '@service/db/db.service';
import GlossaryDbModel from '@service/db/model/glossary.db.model';

export class BdbServiceGlossaryFake
  implements
    Pick<BddService, 'getGlossary'>
{
  glossaryCollection: GlossaryDbModel;

  getGlossaryCollection(): GlossaryDbModel {
    if (!this.glossaryCollection) {
      this.glossaryCollection = {};
    }
    return this.glossaryCollection;
  }

  getGlossary(): Promise<GlossaryDbModel> {
    return Promise.resolve(this.getGlossaryCollection());
  }
}
