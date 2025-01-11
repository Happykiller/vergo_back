import { server } from '@passwordless-id/webauthn' ;

import { ERRORS } from '@src/common/ERROR';
import { Inversify } from '@src/inversify/investify';
import { UserUsecaseModel } from '@usecase/user/model/user.usecase.model';
import { PasskeyAuthUsecaseDto } from '@usecase/auth/dto/passkey.auth.usecase.dto';
import { UserSessionUsecaseModel } from '@usecase/user/model/userSession.usecase.model';

export class AuthPasskeyUsecase {
  inversify: Inversify;

  constructor(inversify: Inversify) {
    this.inversify = inversify;
  }

  async execute(dto: PasskeyAuthUsecaseDto): Promise<UserSessionUsecaseModel> {
    try {

      const user: UserUsecaseModel =
        await this.inversify.getUserUsecase.execute({
          code: dto.user_code,
        });

      const passkey:any = await this.inversify.bddService.getPasskey({
        credential_id: dto.authentication.id,
      });

      /* istanbul ignore next */
      const expected = {
        challenge: passkey.challenge,
        origin: (origin) => origin.includes(passkey.hostname),
        userVerified: true, // no function allowed here
        verbose: false, // optional, enables debug logs containing sensitive information
      };

      const authenticationParsed = await server.verifyAuthentication(dto.authentication, passkey.registration, expected)

      return {
        id: user.id,
        code: user.code,
        name_first: user.name_first,
        name_last: user.name_last,
        description: user.description,
        mail: user.mail,
        role: user.role,
      };
    } catch (e) {
      this.inversify.loggerService.error(`AuthPasskeyUsecase => ${e.message}`);
      throw new Error(ERRORS.AUTH_PASSKEY_USECASE_FAIL);
    }
  }
}
