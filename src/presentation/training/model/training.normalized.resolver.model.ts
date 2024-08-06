import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrainingNormalizedResolverModel {
  @Field(() => [String])
  slugs: string[];
  @Field(() => String)
  type: string;
  @Field(() => Number)
  duration: number;
}