import { Field, InputType } from '@nestjs/graphql';
import { AuthenticationEncoded } from '@passwordless-id/webauthn/dist/esm/types';

@InputType()
export class PasskeyAuthAuthenticationResolverDto {
  @Field(() => String)
  credentialId: string;
  @Field(() => String)
  authenticatorData: string;
  @Field(() => String)
  clientData: string;
  @Field(() => String)
  signature: string;
  @Field(() => String)
  userHandle: string;
}


@InputType()
export class PasskeyAuthResolverDto {
  @Field(() => String)
  user_code: string;
  @Field(() => PasskeyAuthAuthenticationResolverDto)
  authentication: AuthenticationEncoded;
}
