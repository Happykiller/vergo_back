import { Collection, ObjectId } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import { ExerciceDbModel } from '@service/db/model/exercice.db.model';
import { GetExerciceDbDto } from '@service/db/dto/get.exercice.db.dto';
import { UpdateExerciceDbDto } from '../dto/update.exercice.db.dto';
import { CreateExerciceDbDto } from '../dto/create.exercice.db.dto';

export class BdbServiceExerciceMongo
  implements
    Pick<BddService, 'getExercices' | 'getExercice'>
{
  private async getExerciceCollection(): Promise<Collection> {
    return inversify.mongo.collection('exercices');
  }

  async getExercices(): Promise<ExerciceDbModel[]> {
    // Query for a movie that has the title 'The Room'
    const query = {};
    const options = {};
    // Execute query
    const results = (await this.getExerciceCollection()).find(query, options);

    const response: ExerciceDbModel[] = [];
    // Print returned documents
    for await (const doc of results) {
      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      response.push(tmp);
    }

    return response;
  }

  async getExercice(dto: GetExerciceDbDto): Promise<ExerciceDbModel> {
    try {
      const query = {
        _id: new ObjectId(dto.id)
      };
      const options = {};
      // Execute query
      const doc: any = await (
        await this.getExerciceCollection()
      ).findOne(query, options);

      const tmp: any = {
        id: doc._id.toString(),
        ... doc
      };
      delete tmp._id;

      return Promise.resolve(tmp);
    } catch (e) {
      return null;
    }
  }

  async updateExercice(dto: UpdateExerciceDbDto): Promise<boolean> {
    const set: any = {};

    if (dto.slug) {
      set.slug = dto.slug;
    }

    if (dto.title) {
      set.label = dto.title;
    }

    if (dto.description) {
      set.description = dto.description;
    }

    if (dto.image) {
      set.image = dto.image;
    }

    await (
      await this.getExerciceCollection()
    ).updateOne(
      { _id: new ObjectId(dto.id) },
      {
        $set: set,
      },
    );

    return true;
  }

  async createExercice(dto: CreateExerciceDbDto): Promise<ExerciceDbModel> {
    try {
      const result = await (
        await this.getExerciceCollection()
      ).insertOne({
        ...dto
      });

      return Promise.resolve({
        id: result.insertedId.toString(),
        ...dto,
      });
    } catch (e) {
      return null;
    }
  }
}
