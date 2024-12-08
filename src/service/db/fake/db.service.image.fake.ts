import { ObjectId } from "mongodb";

import { BddService } from "@service/db/db.service";
import { ImageDbModel } from "@service/db/model/image.db.model";
import { CreateImageDbDto } from "@service/db/dto/create.image.db.dto";

export class BddServiceImageFake
  implements
    Pick<BddService, 'getImages' | 'setImages'>
{
  imageCollection: ImageDbModel[];

  getImageCollection(): ImageDbModel[] {
    if (!this.imageCollection) {
      this.imageCollection = [];
    }
    return this.imageCollection;
  }

  getImages(): Promise<ImageDbModel[]> {
    return Promise.resolve(this.getImageCollection());
  }

  setImages(dto: CreateImageDbDto[]): Promise<ImageDbModel[]> {
    this.imageCollection = dto.map(elt => {
      return {
        id: new ObjectId().toString(),
        ...elt,
      }
    })

    return Promise.resolve(this.getImageCollection());
  }
}