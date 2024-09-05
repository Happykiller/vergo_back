import { Module } from '@nestjs/common';

import inversify from '@src/inversify/investify';
import { WorkoutResolver } from '@presentation/workout/workout.resolver';

@Module({
  imports: [],
  providers: [
    WorkoutResolver,
    {
      useValue: inversify,
      provide: 'Inversify',
    },
  ],
})
export class WorkoutModule {}
