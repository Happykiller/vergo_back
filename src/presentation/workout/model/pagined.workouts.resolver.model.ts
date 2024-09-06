import { Field, ObjectType } from "@nestjs/graphql";

import { WorkoutDefModelResolver } from '@presentation/workout/model/workout.def.resolver.model';

@ObjectType()
export class SearchWorkoutsPaginatedNodeResolverModel {
  @Field(() => String)
  search: string
  @Field(() => WorkoutDefModelResolver, { nullable: true })
  found: WorkoutDefModelResolver
}

@ObjectType()
export class SearchWorkoutsPaginatedResolverModel {
  @Field(() => Number)
  count: number;
  @Field(() => [SearchWorkoutsPaginatedNodeResolverModel])
  nodes: SearchWorkoutsPaginatedNodeResolverModel[]
}