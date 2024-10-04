import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LanguageDtoResolver {
  @Field(() => String)
  lang: string;
  @Field(() => String)
  value: string;
}

@InputType()
export class UpdateExerciceDtoResolver {
  @Field(() => String)
  id: string;
  @Field(() => String, { nullable: true })
  slug?: string;
  @Field(() => String, { nullable: true })
  image?: string;
  @Field(() => [LanguageDtoResolver], { nullable: true })
  title?: LanguageDtoResolver[];
  @Field(() => [LanguageDtoResolver], { nullable: true })
  description?: LanguageDtoResolver[];
}