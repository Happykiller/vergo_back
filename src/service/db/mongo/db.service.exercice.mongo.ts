import { Collection, ObjectId } from 'mongodb';

import inversify from '@src/inversify/investify';
import { BddService } from '@service/db/db.service';
import { ExerciceDbModel } from '@service/db/model/exercice.db.model';
import { GetExerciceDbDto } from '@service/db/dto/get.exercice.db.dto';
import { UpdateExerciceDbDto } from '../dto/update.exercice.db.dto';
import { CreateExerciceDbDto } from '../dto/create.exercice.db.dto';

export class BdbServiceExerciceMongo
  implements
    Pick<BddService, 'getExercices' | 'getExercice' | 'createExercice' | 'updateExercice'>
{
  private async getExerciceCollection(): Promise<Collection> {
    return inversify.mongo.collection('exercices');
  }

  private mapDoc(doc: any): ExerciceDbModel {
    const tmp: any = { id: doc._id.toString(), ...doc };
    delete tmp._id;
    return tmp;
  }

  async getExercices(): Promise<ExerciceDbModel[]> {
    const results = (await this.getExerciceCollection()).find({});
    const response: ExerciceDbModel[] = [];
    for await (const doc of results) {
      response.push(this.mapDoc(doc));
    }
    return response;
  }

  async getExercice(dto: GetExerciceDbDto): Promise<ExerciceDbModel> {
    try {
      const doc: any = await (
        await this.getExerciceCollection()
      ).findOne({ _id: new ObjectId(dto.id) });

      return this.mapDoc(doc);
    } catch (e) {
      return null;
    }
  }

  async updateExercice(dto: UpdateExerciceDbDto): Promise<ExerciceDbModel> {
    const set: any = {};

    if (dto.slug !== undefined) set.slug = dto.slug;
    if (dto.title !== undefined) set.title = dto.title;
    if (dto.description !== undefined) set.description = dto.description;
    if (dto.image !== undefined) set.image = dto.image;

    const doc: any = await (
      await this.getExerciceCollection()
    ).findOneAndUpdate(
      { _id: new ObjectId(dto.id) },
      { $set: set },
      { returnDocument: 'after' },
    );

    if (!doc) return null;
    return this.mapDoc(doc);
  }

  async createExercice(dto: CreateExerciceDbDto): Promise<ExerciceDbModel> {
    try {
      const result = await (
        await this.getExerciceCollection()
      ).insertOne({ ...dto });

      return { id: result.insertedId.toString(), ...dto };
    } catch (e) {
      return null;
    }
  }
}
