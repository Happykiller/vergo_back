import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { Roles } from '@presentation/guard/roles.decorator';
import { RolesGuard } from '@presentation/guard/roles.guard';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { GqlAuthGuard } from '@presentation/guard/gql.auth.guard';
import { CurrentSession } from '@presentation/guard/userSession.decorator';
import { PasskeyResolverModel } from '@presentation/passkey/model/passkey.resolver.model';
import { DeletePasskeyResolverDto } from '@presentation/passkey/dto/delete.passkey.resolver.dto';
import { CreatePasskeyResolverDto } from '@presentation/passkey/dto/passkey.register.auth.resolver.dto';

@Resolver('PasskeyResolver')
export class PasskeyResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Mutation(
    /* istanbul ignore next */
    (): typeof PasskeyResolverModel => PasskeyResolverModel,
  )
  async create_passkey(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CreatePasskeyResolverDto,
  ): Promise<PasskeyResolverModel> {
    const response = await this.inversify.createPasskeyUsecase.execute({
      ...dto,
      user_id: session.id,
      user_code: session.code,
    });
    return {
      id: response.id,
      label: response.label,
      user_id: response.user_id,
      hostname: response.hostname,
      user_code: response.user_code,
      challenge: response.challenge,
      credential_id: response.registration.id,
    };
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [PasskeyResolverModel])
  async passkeys_for_user(
    @CurrentSession() session: UserSession,
  ): Promise<PasskeyResolverModel[]> {
    const entities = await this.inversify.getByUserIdPasskeyUsecase.execute({
      user_id: session.id,
    });
    return entities.map((passkey) => {
      return {
        id: passkey.id,
        label: passkey.label,
        user_id: passkey.user_id,
        hostname: passkey.hostname,
        user_code: passkey.user_code,
        challenge: passkey.challenge,
        credential_id: passkey.registration.id,
      };
    });
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation((returns) => Boolean)
  async delete_passkey(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: DeletePasskeyResolverDto,
  ): Promise<boolean> {
    this.inversify.deletePasskeyUsecase.execute({
      ...dto,
      user_id: session.id,
    });

    return true;
  }
}
