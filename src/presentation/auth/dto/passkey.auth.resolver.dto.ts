import { Field, InputType } from '@nestjs/graphql';
import { AuthenticationJSON } from '@passwordless-id/webauthn/dist/esm/types';

@InputType()
export class PasskeyResponseDto {
  @Field(() => String)
  authenticatorData: string;
  @Field(() => String)
  clientDataJSON: string;
  @Field(() => String)
  signature: string;
  @Field(() => String)
  userHandle: string;
}

@InputType()
export class PasskeyAuthenticationDto {
  @Field(() => String)
  id: string;
  @Field(() => String)
  rawId: string;
  @Field(() => String)
  type: string;
  @Field(() => String)
  authenticatorAttachment: string;
  @Field(() => PasskeyResponseDto)
  response: PasskeyResponseDto;
}

@InputType()
export class PasskeyAuthResolverDto {
  @Field(() => String)
  user_code: string;
  @Field(() => PasskeyAuthenticationDto)
  authentication: AuthenticationJSON;
}