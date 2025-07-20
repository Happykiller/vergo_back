// src\presentation\training-stat\model\training-stat.resolver.model.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrainingStatModelResolver {
  @Field()
  id: string;

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

  @Field()
  created_at: string;

  @Field({ nullable: true })
  user_id?: string;
}
