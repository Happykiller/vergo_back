import { Args, InputType, Query, Resolver } from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { GlossaryUsecaseModel } from '@src/usecase/glossary/model/glossary.usecase.model';
import { Roles } from '../guard/roles.decorator';
import { USER_ROLE } from '../guard/userRole';
import { GqlAuthGuard } from '../guard/gql.auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@Resolver('AiResolver')
export class AiResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
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

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query(
    /* istanbul ignore next */
    () => [[String]],
  )
  async ai_get_images(): Promise<string[][]> {
    const elts:string[][] = await this.inversify.getImagesTokenizedUsecase.execute();

    // 1. Convertir chaque élément en chaîne primitive et trier les éléments de chaque sous-tableau
    const sortedSubArrays = elts.map(subArray => {
      return Array.from(new Set(subArray.map(item => item.toString()))).sort((a, b) => a.localeCompare(b));
    });

    // 2. Trier les sous-tableaux en fonction des critères
    const sortedNestedArray = sortedSubArrays.sort((a, b) => {
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        const comparison = a[i].localeCompare(b[i]); // Assurer que a[i] et b[i] sont bien de type string primitif
        if (comparison !== 0) {
          return comparison;
        }
      }
      // Si tous les éléments comparés sont identiques, trier par longueur de sous-tableau
      return a.length - b.length;
    });

    return sortedNestedArray;
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query(
    /* istanbul ignore next */
    () =>  [[[String], [String]]]
  )
  async ai_get_training_datas(): Promise<[string[], string[]][]> {
    const elts:[string[], string[]][] = await this.inversify.getTrainingDatasUsecase.execute();
    return elts;
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query(
    /* istanbul ignore next */
    () =>  [[[String], [String]]]
  )
  async ai_get_tokenized(): Promise<[string[], string[]][]> {
    const elts:[string[], string[]][] = await this.inversify.getTokenizedUsecase.execute();

    // Trier par le premier élément du premier tableau de chaque paire
    const sortedElts = elts.sort((a, b) => {
      const firstElementA = a[0][0]; // Accéder à "jumping_jacks" ou "arm_circles"
      const firstElementB = b[0][0]; // Accéder à "jumping_jacks" ou "arm_circles"
      
      return firstElementA.localeCompare(firstElementB); // Comparer alphabétiquement
    });
    
    return sortedElts;
  }
}
