// src\usecase\user\get.user.usecase.ts
import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { UserDbModel } from '@service/db/model/user.db.model';
import { UserUsecaseModel } from '@usecase/user/model/user.usecase.model';
import { GetUserUsecaseDto } from '@usecase/user/dto/get.user.usecase.dto';

export class GetUserUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: GetUserUsecaseDto): Promise<UserUsecaseModel> {
    const entity: UserDbModel = await this.inversify.bddService.getUser(dto);

    if (!entity) {
      throw new Error(ERRORS.GET_USER_USECASE_USER_NOT_FOUND);
    }

    return entity;
  }
}
