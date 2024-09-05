import { Inject, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Int
} from '@nestjs/graphql';

import common from '@presentation/common/common';
import { Inversify } from '@src/inversify/investify';
import { USER_ROLE } from '@presentation/guard/userRole';
import { Roles } from '@presentation/guard/roles.decorator';
import { RolesGuard } from '@presentation/guard/roles.guard';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { GqlAuthGuard } from '@presentation/guard/gql.auth.guard';
import { OrderResolverDto } from '@presentation/dto/order.resolver.dto';
import { CurrentSession } from '@presentation/guard/userSession.decorator';
import { SearchWorkoutsResolverDto } from '@presentation/workout/dto/workout.resolver.dto';
import { WorkoutDefModelResolver } from '@presentation/workout/model/workout.def.resolver.model';
import { WorkoutsPaginatedResolverModel } from '@presentation/workout/model/workouts.pagined.resolver.model';
import { SearchWorkoutsPaginatedResolverModel } from '@presentation/workout/model/pagined.workouts.resolver.model';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Resolver((of) => WorkoutDefModelResolver)
export class WorkoutResolver {
  constructor(
    @Inject('Inversify')
    private inversify: Inversify,
  ) {}
  
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => WorkoutsPaginatedResolverModel)
  async workouts(
    @CurrentSession() session: UserSession,
    @Args('offset', { type: () => Int, nullable: true }) offset = 0,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    @Args('order_by', { type: () => OrderResolverDto, nullable: true }) order_by?: OrderResolverDto,
  ): Promise<WorkoutsPaginatedResolverModel> {
    const results = await this.inversify.getWorkoutsUsecase.execute();
    const paginateResults = common.paginate({
      list: results,
      offset,
      limit,
      order_by: order_by as unknown as any
    });
    return paginateResults;
  }

  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @UseGuards(GqlAuthGuard, RolesGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query(() => SearchWorkoutsPaginatedResolverModel)
  async searchWorkoutsPaginated(
    @Args('dto') dto: SearchWorkoutsResolverDto,
    @CurrentSession() session: UserSession,
    @Args('offset', { type: () => Int, nullable: true }) offset = 0,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    @Args('order_by', { type: () => OrderResolverDto, nullable: true }) order_by?: OrderResolverDto,
  ): Promise<SearchWorkoutsPaginatedResolverModel> {
    const results = await this.inversify.searchWorkoutsUsecase.execute(dto);
    const paginateResults = common.paginate({
      list: results,
      offset,
      limit,
      order_by: order_by as unknown as any
    });
    return paginateResults;
  }
}
