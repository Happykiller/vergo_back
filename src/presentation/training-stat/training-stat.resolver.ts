// src\presentation\training-stat\training-stat.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { makeAuthGuard, USER_ROLE, CurrentSession, UserSessionResolverModel } from '@happykiller/sunny-apis';
import { TrainingStatModelResolver } from '@presentation/training-stat/model/training-stat.resolver.model';
import { SaveTrainingStatDtoResolver } from '@presentation/training-stat/dto/save.training-stat.resolver.dto';

@Resolver(() => TrainingStatModelResolver)
export class TrainingStatResolver {
  constructor(
    @Inject('Inversify') private inversify: Inversify,
  ) {}

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(() => TrainingStatModelResolver)
  async training_stat_save(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('dto') dto: SaveTrainingStatDtoResolver,
  ): Promise<TrainingStatModelResolver> {
    return await this.inversify.saveTrainingStatUsecase.execute({
      ...dto,
      session,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(() => [TrainingStatModelResolver])
  async my_training_stats(
    @CurrentSession() session: UserSessionResolverModel,
  ): Promise<TrainingStatModelResolver[]> {
    return await this.inversify.getTrainingStatsByUserIdUsecase.execute(session.id);
  }
}
