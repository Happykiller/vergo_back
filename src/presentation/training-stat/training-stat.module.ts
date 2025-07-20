// src\presentation\training-stat\training-stat.module.ts
import { Module } from '@nestjs/common';

import inversify from '@src/inversify/investify';
import { TrainingStatResolver } from '@presentation/training-stat/training-stat.resolver';

@Module({
  imports: [],
  providers: [
    TrainingStatResolver,
    {
      provide: 'Inversify',
      useValue: inversify,
    },
  ],
})
export class TrainingStatModule {}
