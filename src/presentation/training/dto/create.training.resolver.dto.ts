import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTrainingWorkoutSetDtoResolver {
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
  @Field(() => [CreateTrainingWorkoutSetDtoResolver], { nullable: true })
  sets?: CreateTrainingWorkoutSetDtoResolver[];
}

@InputType()
export class CreateTrainingWorkoutDtoResolver {
  @Field(() => String)
  slug: string;
  @Field(() => [CreateTrainingWorkoutSetDtoResolver])
  sets: CreateTrainingWorkoutSetDtoResolver[];
}

@InputType()
export class CreateTrainingDtoResolver {
  @Field(() => String)
  slug: string;
  @Field(() => String, { nullable: true })
  gender?: string;
  @Field(() => String, { nullable: true })
  label?: string;
  @Field(() => Boolean, { nullable: true })
  is_private?: string;
  @Field(() => [CreateTrainingWorkoutDtoResolver])
  workout: CreateTrainingWorkoutDtoResolver[];
}