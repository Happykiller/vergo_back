import { Collection } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import { CreateImageDbDto } from '../dto/create.image.db.dto';
import { ImageDbModel } from '@service/db/model/image.db.model';

export class BdbServiceImageMongo
  implements
    Pick<BddService, 'getImages' |'setImages'>
{
  private async getImageCollection(): Promise<Collection> {
    return inversify.mongo.collection('images');
  }

  async getImages(): Promise<ImageDbModel[]> {
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    // Execute query
    const results = (await this.getImageCollection()).find(query, options);

    const response: ImageDbModel[] = [];
    // Print returned documents
    for await (const doc of results) {
      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      delete tmp._id;
      response.push(tmp);
    }

    return response;
  }

  async setImages(dto: CreateImageDbDto[]): Promise<ImageDbModel[]> {
    try {
      await (
        await this.getImageCollection()
      ).deleteMany({});

      await (
        await this.getImageCollection()
      ).insertMany({
        ...dto,
      });

      return this.getImages();
    } catch (e) {
      return null;
    }
  }
}
