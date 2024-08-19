import { ObjectType } from "@nestjs/graphql";

import { Paginated } from "@presentation/model/paginated.result.resolver.model";
import { TrainingModelResolver } from "@presentation/training/model/training.resolver.model";


@ObjectType()
export class PaginatedTrainingsResolverModel extends Paginated(TrainingModelResolver) {}