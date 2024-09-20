import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetExerciceResolverDto {
  @Field(() => String)
  id: string;
}
