import { Query, Resolver } from '@nestjs/graphql';

import common from '@presentation/common/common';
import { Inject, UseGuards } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { Roles } from '@presentation/guard/roles.decorator';
import { RolesGuard } from '@presentation/guard/roles.guard';
import { GqlAuthGuard } from '@presentation/guard/gql.auth.guard';
import { GlossaryUsecaseModel } from '@src/usecase/glossary/model/glossary.usecase.model';

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
    const ordered_image = common.order_img(elts);
    return ordered_image;
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
