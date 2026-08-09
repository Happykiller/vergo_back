// src\presentation\training\training.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int, ResolveField, Parent, Mutation } from '@nestjs/graphql';

import { Inversify } from '@src/inversify/investify';
import { OrderResolverDto } from '@presentation/dto/order.resolver.dto';
import { TrainingUsecaseModel } from '@usecase/training/model/training.usecase.model';
import { TrainingModelResolver } from '@presentation/training/model/training.resolver.model';
import { GetTrainingResolverDto } from '@presentation/training/dto/get.training.resolver.dto';
import { CreateTrainingDtoResolver } from '@presentation/training/dto/create.training.resolver.dto';
import { UpdateTrainingDtoResolver } from '@presentation/training/dto/update.training.resolver.dto';
import { PaginatedTrainingsResolverModel } from '@presentation/training/model/pagined.trainings.resolver.model';
import { TrainingNormalizedResolverModel } from '@presentation/training/model/training.normalized.resolver.model';
import { CurrentSession, makeAuthGuard, USER_ROLE, UserModelResolver, UserSessionResolverModel, UserUsecaseModel } from '@happykiller/sunny-apis';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver((of) => TrainingModelResolver)
export class TrainingResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify
  ) {}

  @ResolveField(() => UserModelResolver, { nullable: true })
  async creator(@Parent() training: TrainingModelResolver): Promise<UserModelResolver> {
    try {
      const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute({
        id: training.creator_id,
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  @ResolveField(() => [UserModelResolver], { nullable: true })
  async contributors(@Parent() training: TrainingModelResolver): Promise<UserModelResolver[]> {
    const contributors = [];
    try {
      for (const user_id of training.contributors_id) {
        const user: UserUsecaseModel = await this.inversify.getUserUsecase.execute({
          id: user_id,
        });
        contributors.push(user);
      }
      return contributors;
    } catch (e) {
      return contributors;
    }
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation((returns) => TrainingModelResolver)
  async training_create(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('dto') dto: CreateTrainingDtoResolver
  ): Promise<TrainingModelResolver> {
    return await this.inversify.createTrainingUsecase.execute({
      session,
      training: dto,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [TrainingModelResolver])
  async trainings(@CurrentSession() session: UserSessionResolverModel): Promise<TrainingModelResolver[]> {
    return this.inversify.getTrainingsUsecase.execute();
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [TrainingModelResolver])
  async get_private_trainings(@CurrentSession() session: UserSessionResolverModel): Promise<TrainingModelResolver[]> {
    return this.inversify.getTrainingsUsecase.execute({
      private: true,
      session,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query(() => PaginatedTrainingsResolverModel)
  async trainingsPaginated(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('offset', { type: () => Int, nullable: true }) offset = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    @Args('orderBy', { type: () => OrderResolverDto, nullable: true }) orderBy?: OrderResolverDto
  ): Promise<PaginatedTrainingsResolverModel> {
    const items: TrainingUsecaseModel[] = await this.inversify.getTrainingsUsecase.execute();
    return {
      nodes: items,
      totalCount: items.length,
    };
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => TrainingModelResolver)
  async training(@CurrentSession() session: UserSessionResolverModel, @Args('dto') dto: GetTrainingResolverDto): Promise<TrainingModelResolver> {
    return this.inversify.getTrainingUsecase.execute(dto);
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [TrainingNormalizedResolverModel])
  async training_normalized(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('dto') dto: GetTrainingResolverDto
  ): Promise<TrainingNormalizedResolverModel[]> {
    return this.inversify.getNormalizedTrainingUsecase.execute(dto);
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(() => Boolean)
  async training_update(@CurrentSession() session: UserSessionResolverModel, @Args('dto') dto: UpdateTrainingDtoResolver): Promise<boolean> {
    return this.inversify.updateTrainingUsecase.execute({
      session,
      training: dto,
    });
  }
}
