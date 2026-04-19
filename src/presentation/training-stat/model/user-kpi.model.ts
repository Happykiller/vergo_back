import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BadgeModelResolver {
  @Field() code: string;
  @Field() earned: boolean;
  @Field({ nullable: true }) earnedAt?: string;
  // Assumption: no JSON scalar available; stringify meta.
  @Field({ nullable: true }) meta?: string;
}

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
export class TrainingVolumePeriodModelResolver {
  @Field(() => Int) sessionsCount: number;
  @Field(() => Int) minutes: number;
  @Field(() => Float) hours: number;
}

@ObjectType()
export class TrainingVolumeModelResolver {
  @Field(() => TrainingVolumePeriodModelResolver) last15Days: TrainingVolumePeriodModelResolver;
  @Field(() => TrainingVolumePeriodModelResolver) last30Days: TrainingVolumePeriodModelResolver;
  @Field(() => TrainingVolumePeriodModelResolver) last90Days: TrainingVolumePeriodModelResolver;
  @Field(() => TrainingVolumePeriodModelResolver) last6Months: TrainingVolumePeriodModelResolver;
  @Field(() => TrainingVolumePeriodModelResolver) last1Year: TrainingVolumePeriodModelResolver;
}

@ObjectType()
export class UserKpiModelResolver {
  @Field(() => [SessionKpiModelResolver]) sessions: SessionKpiModelResolver[];
  @Field(() => [ActiviyKpiModelResolver]) activities: ActiviyKpiModelResolver[];
  @Field(() => GamificationModelResolver) gamification: GamificationModelResolver;
  @Field(() => TrainingVolumeModelResolver) volume: TrainingVolumeModelResolver;
  @Field(() => [BadgeModelResolver]) badges: BadgeModelResolver[];
}
