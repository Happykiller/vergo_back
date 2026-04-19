// src\presentation\training-stat\training-stat.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { TrainingStatModelResolver } from '@presentation/training-stat/model/training-stat.resolver.model';
import { makeAuthGuard, USER_ROLE, CurrentSession, UserSessionResolverModel } from '@happykiller/sunny-apis';
import { SaveTrainingStatDtoResolver } from '@presentation/training-stat/dto/save.training-stat.resolver.dto';
import {
  GamificationModelResolver,
  LeagueModelResolver,
  TrainingVolumeModelResolver,
  UserKpiModelResolver,
  BadgeModelResolver,
} from '@presentation/training-stat/model/user-kpi.model';

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
    const activities = await this.inversify.getTrainingStatsActivitiesUsecase.execute(session.id);
    const gam = await this.inversify.getUserGamificationUsecase.execute(session.id, { includeWeekly: true });
    const volume = await this.inversify.getTrainingVolumeUsecase.execute(session.id);
    const badgesDomain = await this.inversify.getUserBadgesUsecase.execute(session.id);

    const toLeague = (x: any): LeagueModelResolver => ({
      code: x.code,
      minutes: x.minutes,
      threshold: x.threshold,
      nextCode: x.next?.code,
      nextThreshold: x.next?.threshold,
    });
    const gamification: GamificationModelResolver = {
      xp: gam.xp,
      level: gam.level,
      levelXp: gam.levelXp,
      levelXpToNext: gam.levelXpToNext,
      levelProgressPct: gam.levelProgressPct,
      league: toLeague(gam.league),
      weeklyLeague: gam.weeklyLeague ? toLeague(gam.weeklyLeague) : undefined,
    };
    const trainingVolume: TrainingVolumeModelResolver = {
      last15Days: volume.last15Days,
      last30Days: volume.last30Days,
      last90Days: volume.last90Days,
      last6Months: volume.last6Months,
      last1Year: volume.last1Year,
    };

    const badges: BadgeModelResolver[] = badgesDomain.map(b => ({
      code: b.code,
      earned: b.earned,
      earnedAt: b.earnedAt,
      meta: b.meta ? JSON.stringify(b.meta) : undefined, // see Assumption above
    }));

    return { sessions, activities, gamification, volume: trainingVolume, badges };
  }
}
