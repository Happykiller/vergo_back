// src\presentation\ai\ai.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { Roles, RolesGuard, USER_ROLE } from '@happykiller/sunny-apis';
import { GlossaryUsecaseModel } from '@src/usecase/glossary/model/glossary.usecase.model';

@Resolver('AiResolver')
export class AiResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {
    console.log('✅ AiResolver loaded');
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @Query(
    /* istanbul ignore next */
    () => [String],
  )
  async ai_get_glossary(): Promise<string[]> {
    const glossary:GlossaryUsecaseModel = await this.inversify.getGlossaryUsecase.execute();
    const { _id, ...rest } = glossary; // Exclure la clé _id
    const values = Object.keys(rest);
    // Utiliser un Set pour éliminer les doublons, puis trier le tableau
    const uniqueSortedValues = Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
    return uniqueSortedValues;
  }
}
