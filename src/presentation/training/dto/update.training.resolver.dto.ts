import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetDtoResolver {
  @Field(() => Number, { nullable: true })
  rep?: number;
  @Field(() => [String], { nullable: true })
  slugs?: string[];
  @Field(() => Number, { nullable: true })
  ite?: number;
  @Field(() => Number, { nullable: true })
  weight?: number;
  @Field(() => Number, { nullable: true })
  duration?: number;
  @Field(() => Number, { nullable: true })
  rest?: number;
  @Field(() => Number, { nullable: true })
  pause?: number;
  @Field(() => [SetDtoResolver], { nullable: true })
  sets?: SetDtoResolver[];
}

@InputType()
export class WorkoutDtoResolver {
  @Field(() => String)
  slug: string;
  @Field(() => [SetDtoResolver])
  sets: SetDtoResolver[];
}

@InputType()
export class UpdateTrainingDtoResolver {
  @Field(() => String, { nullable: true })
  id: string;
  @Field(() => String, { nullable: true })
  slug?: string;
  @Field(() => String, { nullable: true })
  gender?: string;
  @Field(() => String, { nullable: true })
  label?: string;
  @Field(() => [WorkoutDtoResolver], { nullable: true })
  workout?: WorkoutDtoResolver[];
}