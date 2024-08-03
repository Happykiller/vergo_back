import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModelResolver {
  @Field(() => String, { nullable: true })
  id: string;
  @Field(() => String, { nullable: true })
  code: string;
  @Field(() => String, { nullable: true })
  name_first: string;
  @Field(() => String, { nullable: true })
  name_last: string;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => String, { nullable: true })
  mail: string;
  @Field(() => String, { nullable: true })
  role: string;
}
