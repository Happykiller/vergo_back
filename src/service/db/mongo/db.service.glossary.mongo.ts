import { Collection } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import GlossaryDbModel from '@service/db/model/glossary.db.model';

export class BdbServiceGlossaryMongo
  implements
    Pick<BddService, 'getGlossary'>
{
  private async getGlossariesCollection(): Promise<Collection> {
    return inversify.mongo.collection('glossaries');
  }

  async getGlossary(): Promise<GlossaryDbModel> {
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    // Execute query
    const results = (await this.getGlossariesCollection()).find(query, options);

    const response: GlossaryDbModel[] = [];
    // Print returned documents
    for await (const doc of results) {
      const tmp: any = {
        ... doc
      };
      delete tmp._id;
      response.push(tmp);
    }

    return response[0];
  }
}
