import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';

import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { Roles } from '@presentation/guard/roles.decorator';
import { RolesGuard } from '@presentation/guard/roles.guard';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { GqlAuthGuard } from '@presentation/guard/gql.auth.guard';
import { UserUsecaseModel } from '@usecase/user/model/user.usecase.model';
import { CurrentSession } from '@presentation/guard/userSession.decorator';
import { UserModelResolver } from '@presentation/user/model/user.resolver.model';
import { TrainingModelResolver } from '@presentation/training/model/training.resolver.model';
import { ExerciceModelResolver } from '@presentation/exercice/model/exercice.resolver.model';
import { GetTrainingResolverDto } from '@presentation/training/dto/get.training.resolver.dto';
import { GetExerciceResolverDto } from '@presentation/exercice/dto/get.exercice.resolver.dto';
import { CreateExerciceDtoResolver } from '@presentation/exercice/dto/create.exercice.resolver.dto';
import { UpdateExerciceDtoResolver } from '@presentation/exercice/dto/update.exercice.resolver.dto';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver((of) => ExerciceModelResolver)
export class ExerciceResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}

  @ResolveField(() => UserModelResolver, { nullable: true })
  async creator(@Parent() training:ExerciceModelResolver):Promise<UserModelResolver> {
    try {
      const user:UserUsecaseModel = await this.inversify.getUserUsecase.execute({
        id: training.creator_id
      })
      return user;
    } catch (e) {
      return null;
    }
  }

  @ResolveField(() => [UserModelResolver], { nullable: true })
  async contributors(@Parent() training:TrainingModelResolver):Promise<UserModelResolver[]> {
    let contributors = [];
    try {
      for(let user_id of training.contributors_id) {
        const user:UserUsecaseModel = await this.inversify.getUserUsecase.execute({
          id: user_id
        })
        contributors.push(user);
      }
      return contributors;
    } catch (e) {
      return contributors;
    }
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation((returns) => ExerciceModelResolver)
  async exercice_create(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: CreateExerciceDtoResolver,
  ): Promise<ExerciceModelResolver> {
    return await this.inversify.createExerciceUsecase.execute({
      session,
      exercice: dto
    });
  }
  
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [ExerciceModelResolver])
  async exercices (
    @CurrentSession() session: UserSession,
    @Args('dto', { nullable: true }) dto?: GetTrainingResolverDto,
  ): Promise<ExerciceModelResolver[]> {
    return this.inversify.getExercicesUsecase.execute();
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => ExerciceModelResolver)
  async exercice (
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetExerciceResolverDto,
  ): Promise<ExerciceModelResolver> {
    return this.inversify.getExerciceUsecase.execute(dto);
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation(() => Boolean)
  async exercice_update(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: UpdateExerciceDtoResolver,
  ): Promise<boolean> {
    await this.inversify.updateExerciceUsecase.execute({
      session,
      exercice: dto
    });

    return true;
  }
}
