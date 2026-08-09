// src\presentation\exercice\exercice.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';

import { Inversify } from '@src/inversify/investify';
import { TrainingModelResolver } from '@presentation/training/model/training.resolver.model';
import { ExerciceModelResolver } from '@presentation/exercice/model/exercice.resolver.model';
import { GetTrainingResolverDto } from '@presentation/training/dto/get.training.resolver.dto';
import { GetExerciceResolverDto } from '@presentation/exercice/dto/get.exercice.resolver.dto';
import { CreateExerciceDtoResolver } from '@presentation/exercice/dto/create.exercice.resolver.dto';
import { UpdateExerciceDtoResolver } from '@presentation/exercice/dto/update.exercice.resolver.dto';
import { CurrentSession, makeAuthGuard, USER_ROLE, UserModelResolver, UserSessionResolverModel, UserUsecaseModel } from '@happykiller/sunny-apis';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver((of) => ExerciceModelResolver)
export class ExerciceResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify
  ) {}

  @ResolveField(() => UserModelResolver, { nullable: true })
  async creator(@Parent() training: ExerciceModelResolver): Promise<UserModelResolver> {
    try {
      const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute({
        id: training.creator_id,
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  @ResolveField(() => [UserModelResolver], { nullable: true })
  async contributors(@Parent() training: TrainingModelResolver): Promise<UserModelResolver[]> {
    const contributors = [];
    try {
      for (const user_id of training.contributors_id) {
        const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute({
          id: user_id,
        });
        contributors.push(user);
      }
      return contributors;
    } catch (e) {
      return contributors;
    }
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation((returns) => ExerciceModelResolver)
  async exercice_create(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('dto') dto: CreateExerciceDtoResolver
  ): Promise<ExerciceModelResolver> {
    return await this.inversify.createExerciceUsecase.execute({
      session,
      exercice: dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [ExerciceModelResolver])
  async exercices(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('dto', { nullable: true }) dto?: GetTrainingResolverDto
  ): Promise<ExerciceModelResolver[]> {
    return this.inversify.getExercicesUsecase.execute();
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => ExerciceModelResolver)
  async exercice(@CurrentSession() session: UserSessionResolverModel, @Args('dto') dto: GetExerciceResolverDto): Promise<ExerciceModelResolver> {
    return this.inversify.getExerciceUsecase.execute(dto);
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(() => Boolean)
  async exercice_update(@CurrentSession() session: UserSessionResolverModel, @Args('dto') dto: UpdateExerciceDtoResolver): Promise<boolean> {
    await this.inversify.updateExerciceUsecase.execute({
      session,
      exercice: dto,
    });

    return true;
  }
}
