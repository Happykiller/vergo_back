// src\presentation\training-stat\dto\save.training-stat.resolver.dto.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SaveTrainingStatDtoResolver {
  @Field()
  training_id: string;

  @Field()
  start: string;

  @Field()
  end: string;

  @Field()
  durationInSeconds: number;

  @Field()
  completed: boolean;
}
