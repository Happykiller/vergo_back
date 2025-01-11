import { ObjectId } from 'mongodb';

import { BddService } from '@service/db/db.service';
import PasskeyDbModel from '@service/db/model/passkey.db.model';
import { passkeyRopo } from '@service/db/fake/mock/passkey.ropo';
import { GetPasskeyDbDto } from '@service/db/dto/get.passkey.db.dto';
import CreatePasskeyDbDto from '@service/db/dto/create.passkey.db.dto';
import { DeletePasskeyDbDto } from '@service/db/dto/delete.passkey.db.dto';
import { GetPasskeyByUserIdDbDto } from '@service/db/dto/getByUserId.passkey.db.dto';

export class BddServicePasskeyFake
  implements
    Pick<BddService, 'createPasskey' | 'getPasskeyByUserId' | 'getPasskey'>
{
  passkeyCollection: PasskeyDbModel[];

  getPasskeyCollection(): PasskeyDbModel[] {
    if (!this.passkeyCollection) {
      this.passkeyCollection = [passkeyRopo];
    }
    return this.passkeyCollection;
  }

  createPasskey(dto: CreatePasskeyDbDto): Promise<PasskeyDbModel> {
    const entity: PasskeyDbModel = {
      id: new ObjectId().toString(),
      ...dto,
      active: true,
    };
    this.getPasskeyCollection().push(entity);
    return Promise.resolve(JSON.parse(JSON.stringify(entity)));
  }

  getPasskeyByUserId(dto: GetPasskeyByUserIdDbDto): Promise<PasskeyDbModel[]> {
    const entities = this.getPasskeyCollection().filter(
      (elt) => elt.active && elt.user_id === dto.user_id,
    );
    return Promise.resolve(JSON.parse(JSON.stringify(entities)));
  }

  getPasskey(dto: GetPasskeyDbDto): Promise<PasskeyDbModel> {
    const entity:any = this.getPasskeyCollection().find((elt:any) => {
      if (!elt.active) return false;
      else if (dto.passkey_id) {
        return elt.id === dto.passkey_id;
      } else if (dto.credential_id) {
        return elt.registration.credential.id === dto.credential_id;
      }
    });

    if (entity) {
      return Promise.resolve(JSON.parse(JSON.stringify(entity)));
    } else {
      return null;
    }
  }

  deletePasskey(dto: DeletePasskeyDbDto): Promise<boolean> {
    const entity = this.getPasskeyCollection().find(
      (elt) => elt.id === dto.passkey_id && elt.active,
    );

    entity.active = false;

    return Promise.resolve(true);
  }
}
