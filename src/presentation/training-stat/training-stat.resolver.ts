// src\presentation\training-stat\training-stat.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { TrainingStatModelResolver } from '@presentation/training-stat/model/training-stat.resolver.model';
import { makeAuthGuard, USER_ROLE, CurrentSession, UserSessionResolverModel } from '@happykiller/sunny-apis';
import { SaveTrainingStatDtoResolver } from '@presentation/training-stat/dto/save.training-stat.resolver.dto';
import { UserKpiModelResolver } from './model/user-kpi.model';

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

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(() => UserKpiModelResolver)
  async getUserKpis(
    @CurrentSession() session: UserSessionResolverModel
  ) {
    const sessions = await this.inversify.getTrainingStatsSessionsUsecase.execute(session.id);
    return { sessions };
  }
}
