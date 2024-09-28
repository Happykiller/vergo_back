import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrainingDatasResolverModel {
  @Field(() => [String])
  inputs: string[];

  @Field(() => [String])
  outputs: string[];
}
