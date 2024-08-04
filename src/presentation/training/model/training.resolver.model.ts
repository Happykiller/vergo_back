import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SetModelResolver {
  @Field(() => Number, { nullable: true })
  rep?: number;
  @Field(() => [String], { nullable: true })
  slugs?: string[];
  @Field(() => Number, { nullable: true })
  duration?: number;
  @Field(() => Number, { nullable: true })
  rest?: number;
  @Field(() => Number, { nullable: true })
  pause?: number;
  @Field(() => [SetModelResolver], { nullable: true })
  sets?: SetModelResolver[];
}

@ObjectType()
export class WorkoutModelResolver {
  @Field(() => String)
  slug: string;
  @Field(() => [SetModelResolver])
  sets: SetModelResolver[];
}

@ObjectType()
export class TrainingModelResolver {
  @Field(() => String)
  id: string;
  @Field(() => String)
  slug: string;
  @Field(() => [WorkoutModelResolver])
  workout: WorkoutModelResolver[];
}