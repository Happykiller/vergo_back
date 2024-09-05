import { Field, ObjectType } from '@nestjs/graphql';
import { LanguageModelResolver } from '@presentation/exercice/model/exercice.resolver.model';

@ObjectType()
export class WorkoutDefModelResolver {
  @Field(() => String)
  id: string;
  @Field(() => String)
  slug: string;
  @Field(() => [LanguageModelResolver])
  title: LanguageModelResolver[];
  @Field(() => [LanguageModelResolver])
  description: LanguageModelResolver[];
  @Field(() => String, { nullable: true })
  image?: string;
}