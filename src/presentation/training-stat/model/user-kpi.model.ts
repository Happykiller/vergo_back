import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LeagueModelResolver {
  @Field() code: string;
  @Field(() => Int) minutes: number;
  @Field(() => Int) threshold: number;
  @Field({ nullable: true }) nextCode?: string;
  @Field(() => Int, { nullable: true }) nextThreshold?: number;
}

@ObjectType()
export class GamificationModelResolver {
  @Field(() => Int) xp: number;
  @Field(() => Int) level: number;
  @Field(() => Int) levelXp: number;
  @Field(() => Int) levelXpToNext: number;
  @Field(() => Int) levelProgressPct: number;
  @Field(() => LeagueModelResolver) league: LeagueModelResolver;
  @Field(() => LeagueModelResolver, { nullable: true }) weeklyLeague?: LeagueModelResolver;
}

@ObjectType()
export class SessionKpiModelResolver {
  @Field() id: string;
  @Field() label: string;
  @Field() date: string;
  @Field(() => Int) duration: number;
  @Field() completed: boolean;
}

@ObjectType()
export class ActiviyKpiModelResolver {
  @Field() date: string;
  @Field(() => Int) duration: number;
}

@ObjectType()
export class UserKpiModelResolver {
  @Field(() => [SessionKpiModelResolver]) sessions: SessionKpiModelResolver[];
  @Field(() => [ActiviyKpiModelResolver]) activities: ActiviyKpiModelResolver[];
  @Field(() => GamificationModelResolver) gamification: GamificationModelResolver;
}
