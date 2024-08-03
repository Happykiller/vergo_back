import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeletePasskeyResolverDto {
  @Field(() => String)
  passkey_id: string;
}
