import { Field, InputType } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@InputType()
export class OrderResolverDto {
  @Field()
  field: string;

  @Field(() => SortOrder)
  order: SortOrder;
}
