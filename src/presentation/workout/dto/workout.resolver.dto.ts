import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchWorkoutsResolverDto {
  @Field(() => [String])
  workouts_slug: string[];
}
