// src/graphql/test/test.module.ts
import { Module } from '@nestjs/common';
import { TestResolver } from './test.resolver';
import { AlwaysAllowGuard } from '@happykiller/sunny-apis';

@Module({
  providers: [TestResolver, AlwaysAllowGuard],
  exports: [TestResolver],
})
export class TestModule {}
