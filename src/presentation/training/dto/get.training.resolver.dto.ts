import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetTrainingResolverDto {
  @Field(() => String)
  id: string;
}
