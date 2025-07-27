// src/graphql/model/user-kpi.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionKpiModelResolver {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field()
  date: string;

  @Field()
  duration: number;

  @Field()
  completed: boolean;
}

@ObjectType()
export class ActiviyKpiModelResolver {
  @Field()
  date: string;

  @Field()
  duration: number;
}

@ObjectType()
export class UserKpiModelResolver {
  @Field(() => [SessionKpiModelResolver])
  sessions: SessionKpiModelResolver[];
  @Field(() => [ActiviyKpiModelResolver])
  activities: ActiviyKpiModelResolver[];
}
