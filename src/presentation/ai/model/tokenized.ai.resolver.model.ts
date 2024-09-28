import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenizedResolverModel {
  @Field(() => String)
  inputs: string;

  @Field(() => [String])
  outputs: string[];
}
