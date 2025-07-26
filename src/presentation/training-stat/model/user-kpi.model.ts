// src/graphql/model/user-kpi.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSessionKpiModelResolver {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field()
  date: string;

  @Field()
  duration: number;
}

@ObjectType()
export class UserKpiModelResolver {
  @Field(() => [UserSessionKpiModelResolver])
  sessions: UserSessionKpiModelResolver[];
}
