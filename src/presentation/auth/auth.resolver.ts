import { JwtService } from '@nestjs/jwt';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject, UnauthorizedException, UseGuards } from '@nestjs/common';

import { Inversify } from '@src/inversify/investify';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { GqlAuthGuard } from '@presentation/guard/gql.auth.guard';
import { CurrentSession } from '@presentation/guard/userSession.decorator';
import { AuthModelResolver } from '@presentation/auth/model/auth.resolver.model';
import { AuthAuthResolverDto } from '@presentation/auth/dto/auth.auth.resolver.dto';
import { UserSessionUsecaseModel } from '@usecase/user/model/userSession.usecase.model';
import { PasskeyAuthResolverDto } from '@presentation/auth/dto/passkey.auth.resolver.dto';
import { UpdPasswordAuthResolverDto } from '@presentation/auth/dto/updPassword.auth.resolver.dto';

@Resolver('AuthResolver')
export class AuthResolver {
  constructor(
    private jwtService: JwtService,
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}

  @Query(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async auth(
    @Args('dto') dto: AuthAuthResolverDto,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionUsecaseModel =
      await this.inversify.authUsecase.execute(dto);

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }

  @Query(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async auth_passkey(
    @Args('dto') dto: PasskeyAuthResolverDto,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionUsecaseModel = await this.inversify.authPasskeyUsecase.execute(dto);

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Query(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async getSessionInfo(
    @CurrentSession() session: UserSession,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionUsecaseModel =
      await this.inversify.getUserUsecase.execute({
        id: session.id,
      });

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
      role: userSession.role,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(
    /* istanbul ignore next */
    (): typeof AuthModelResolver => AuthModelResolver,
  )
  async update_password(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: UpdPasswordAuthResolverDto,
  ): Promise<AuthModelResolver> {
    const userSession: UserSessionUsecaseModel =
      await this.inversify.updPasswordUsecase.execute({
        user_id: session.id,
        ...dto,
      });

    if (!userSession) {
      throw new UnauthorizedException('Credentials wrong');
    }

    const token = this.jwtService.sign({
      code: userSession.code,
      id: userSession.id,
      role: userSession.role,
    });
    return {
      access_token: token,
      ...userSession,
    };
  }
}
