import { Field, InputType } from '@nestjs/graphql';
import { RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';

@InputType()
export class UserDto {
  @Field(() => String)
  id: string;
  @Field(() => String)
  name: string;
  @Field(() => String)
  displayName: string;
}

@InputType()
export class CreatePasskeyRegistrationCredentialResolverDto {
  @Field(() => String)
  id: string;
  @Field(() => String)
  publicKey: string;
  @Field(() => String)
  algorithm: string;
  @Field(() => [String])
  transports: string[];
}

@InputType()
export class CreatePasskeyRegistrationResolverDto {
  @Field(() => UserDto)
  user: UserDto;
  @Field(() => CreatePasskeyRegistrationCredentialResolverDto)
  credential: CreatePasskeyRegistrationCredentialResolverDto;
  @Field(() => String)
  authenticatorData: string;
  @Field(() => String)
  clientData: string;
}

@InputType()
export class CreatePasskeyResolverDto {
  @Field(() => String)
  label: string;
  @Field(() => String)
  hostname: string;
  @Field(() => String)
  challenge: string;
  @Field(() => CreatePasskeyRegistrationResolverDto)
  registration: RegistrationJSON;
}
