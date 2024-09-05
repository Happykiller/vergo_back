import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Int
} from '@nestjs/graphql';

import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { Roles } from '@presentation/guard/roles.decorator';
import { RolesGuard } from '@presentation/guard/roles.guard';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { GqlAuthGuard } from '@presentation/guard/gql.auth.guard';
import { OrderResolverDto } from '@presentation/dto/order.resolver.dto';
import { CurrentSession } from '@presentation/guard/userSession.decorator';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';
import { TrainingModelResolver } from '@presentation/training/model/training.resolver.model';
import { GetTrainingResolverDto } from '@presentation/training/dto/get.training.resolver.dto';
import { PaginatedTrainingsResolverModel } from '@presentation/training/model/pagined.trainings.resolver.model';
import { TrainingNormalizedResolverModel } from '@presentation/training/model/training.normalized.resolver.model';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver((of) => TrainingModelResolver)
export class TrainingResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}
  
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [TrainingModelResolver])
  async trainings(
    @CurrentSession() session: UserSession,
  ): Promise<TrainingModelResolver[]> {
    return this.inversify.getTrainingsUsecase.execute();
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query(() => PaginatedTrainingsResolverModel)
  async trainingsPaginated(
    @CurrentSession() session: UserSession,
    @Args('offset', { type: () => Int, nullable: true }) offset = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    @Args('orderBy', { type: () => OrderResolverDto, nullable: true }) orderBy?: OrderResolverDto,
  ): Promise<PaginatedTrainingsResolverModel> {
    const items:TrainingUsecaseModel[] = await this.inversify.getTrainingsUsecase.execute()
    return {
      nodes: items,
      totalCount: items.length
    };
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => TrainingModelResolver)
  async training(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetTrainingResolverDto,
  ): Promise<TrainingModelResolver> {
    return this.inversify.getTrainingUsecase.execute(dto);
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [TrainingNormalizedResolverModel])
  async training_normalized(
    @CurrentSession() session: UserSession,
    @Args('dto') dto: GetTrainingResolverDto,
  ): Promise<TrainingNormalizedResolverModel[]> {
    return this.inversify.getNormalizedTrainingUsecase.execute(dto);
  }
}
