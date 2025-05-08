// src\presentation\ai\ai.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';

import { Inversify } from '@src/inversify/investify';
import { makeAuthGuard, USER_ROLE } from '@happykiller/sunny-apis';
import { GlossaryUsecaseModel } from '@usecase/glossary/model/glossary.usecase.model';

@Resolver('AiResolver')
export class AiResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
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
