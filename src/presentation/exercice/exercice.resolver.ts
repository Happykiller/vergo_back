import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
} from '@nestjs/graphql';

import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { Roles } from '@presentation/guard/roles.decorator';
import { RolesGuard } from '@presentation/guard/roles.guard';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { GqlAuthGuard } from '@presentation/guard/gql.auth.guard';
import { CurrentSession } from '@presentation/guard/userSession.decorator';
import { ExerciceModelResolver } from '@presentation/exercice/model/exercice.resolver.model';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver((of) => ExerciceModelResolver)
export class ExerciceResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}
  
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [ExerciceModelResolver])
  async exercices(
    @CurrentSession() session: UserSession,
  ): Promise<ExerciceModelResolver[]> {
    return null;
  }
}
