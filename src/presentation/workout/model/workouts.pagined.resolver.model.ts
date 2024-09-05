import { Field, ObjectType } from "@nestjs/graphql";

import { WorkoutDefModelResolver } from '@presentation/workout/model/workout.def.resolver.model';

@ObjectType()
export class WorkoutsPaginatedResolverModel {
  @Field(() => Number)
  count: number;
  @Field(() => [WorkoutDefModelResolver])
  nodes: WorkoutDefModelResolver[]
}