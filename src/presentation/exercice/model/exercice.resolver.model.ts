import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LanguageModelResolver {
  @Field(() => String)
  lang: string;
  @Field(() => String)
  value: string;
}

@ObjectType()
export class ExerciceModelResolver {
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
  @Field(() => String, { nullable: true })
  creator_id?: string;
  @Field(() => [String], { nullable: true })
  contributors_id?: string[];
}