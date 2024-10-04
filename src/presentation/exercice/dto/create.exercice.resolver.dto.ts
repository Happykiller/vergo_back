import { Field, InputType } from '@nestjs/graphql';
import { LanguageDtoResolver } from '@presentation/exercice/dto/update.exercice.resolver.dto';

@InputType()
export class CreateExerciceDtoResolver {
  @Field(() => String)
  slug: string;
  @Field(() => String)
  image: string;
  @Field(() => [LanguageDtoResolver])
  title: LanguageDtoResolver[];
  @Field(() => [LanguageDtoResolver])
  description: LanguageDtoResolver[];
}