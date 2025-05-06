// src/graphql/test/test.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AlwaysAllowGuard } from '@happykiller/sunny-apis';

@Resolver()
export class TestResolver {
  constructor() {
    console.log('✅ TestResolver loaded');
  }

  @UseGuards(AlwaysAllowGuard)
  @Query(() => String)
  hello(): string {
    console.log('✅ hello() resolver called');
    return 'Hello from sunny-apis!';
  }
}
