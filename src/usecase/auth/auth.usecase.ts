import { Inversify } from '@src/inversify/investify';
import { AuthUsecaseDto } from '@usecase/auth/dto/auth.usecase.dto';
import { UserUsecaseModel } from '@usecase/user/model/user.usecase.model';
import { UserSessionUsecaseModel } from '@usecase/user/model/userSession.usecase.model';

export class AuthUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: AuthUsecaseDto): Promise<UserSessionUsecaseModel> {
    const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute({
      code: dto.login,
    });

    const cryptPassword = this.inversify.cryptService.crypt({
      message: dto.password,
    });

    if (user && user.password === cryptPassword && user.active) {
      return {
        id: user.id,
        code: user.code,
        name_first: user.name_first,
        name_last: user.name_last,
        description: user.description,
        mail: user.mail,
        role: user.role,
      };
    } else {
      return null;
    }
  }
}
