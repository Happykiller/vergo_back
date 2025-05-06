// src\service\db\fake\db.service.user.fake.ts
import { ObjectId } from 'mongodb';

import { BddService } from '@service/db/db.service';
import { USER_ROLE } from '@happykiller/sunny-apis';
import { UserDbModel } from '@service/db/model/user.db.model';
import { userRopo } from '@src/service/db/fake/mock/user.ropo';
import { GetUserDbDto } from '@service/db/dto/get.user.db.dto';
import { CreateUserDbDto } from '@service/db/dto/create.user.db.dto';
import { UpdateUserDbDto } from '@service/db/dto/update.user.db.dto';

export class BddServiceUserFake
  implements
    Pick<BddService, 'createUser' | 'getAllUser' | 'getUser' | 'updateUser'>
{
  userCollection: UserDbModel[];

  getUserCollection(): UserDbModel[] {
    if (!this.userCollection) {
      this.userCollection = [userRopo];
    }
    return this.userCollection;
  }

  createUser(dto: CreateUserDbDto): Promise<UserDbModel> {
    const entity: UserDbModel = {
      id: new ObjectId().toString(),
      ...dto,
      role: USER_ROLE.USER,
      active: true,
    };
    this.getUserCollection().push(entity);
    return Promise.resolve(entity);
  }

  getAllUser(): Promise<UserDbModel[]> {
    return Promise.resolve(this.getUserCollection());
  }

  getUser(dto: GetUserDbDto): Promise<UserDbModel> {
    return Promise.resolve(
      this.getUserCollection().find((elt) => {
        if (dto.id) {
          return elt.id === dto.id && elt.active;
        } else if (dto.code) {
          return elt.code === dto.code && elt.active;
        }
      }),
    );
  }

  async updateUser(dto: UpdateUserDbDto): Promise<UserDbModel> {
    const user = await this.getUser({
      id: dto.user_id,
    });

    if (dto.password) {
      user.password = dto.password;
    }

    if (dto.description) {
      user.description = dto.description;
    }

    if (dto.code) {
      user.code = dto.code;
    }

    if (dto.name_first) {
      user.name_first = dto.name_first;
    }

    if (dto.name_last) {
      user.name_last = dto.name_last;
    }

    if (dto.mail) {
      user.mail = dto.mail;
    }

    return Promise.resolve(JSON.parse(JSON.stringify(user)));
  }
}
