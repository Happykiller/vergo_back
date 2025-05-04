// src\usecase\user\create.user.usecase.ts
import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { UserDbModel } from '@service/db/model/user.db.model';
import { UserUsecaseModel } from '@usecase/user/model/user.usecase.model';
import { CreateUserUsecaseDto } from '@usecase/user/dto/create.user.usecase.dto';

export class CreateUserUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: CreateUserUsecaseDto): Promise<UserUsecaseModel> {
    let user: UserDbModel;
    try {
      user = await this.inversify.getUserUsecase.execute({
        code: dto.code,
      });
    } catch (e) {}

    if (user) {
      throw new Error(ERRORS.CREATE_USER_USECASE_USER_ALREADY_EXIST);
    }

    this.inversify.morgansServce.sendWelcome({
      to: dto.mail,
      subject: 'Bienvenue sur Vergo 🎉',
      variables: {
        "id": dto.code,
        "email": dto.mail,
        "password": dto.password,
        "logoUrl": "https://vergo.happykiller.net/favicon-192x192.png",
        "serviceUrl": "https://vergo.happykiller.net/",
        "serviceName": "Vergo",
        "siguriUrl": "https://siguri.happykiller.net/"
      }
    });

    dto.password = this.inversify.cryptService.crypt({
      message: dto.password,
    });
    user = await this.inversify.bddService.createUser(dto);
    return user;
  }
}
