import { Module } from '@nestjs/common';

import inversify from '@src/inversify/investify';
import { AiResolver } from '@presentation/ai/ai.resolver';

@Module({
  imports: [],
  providers: [
    AiResolver,
    {
      useValue: inversify,
      provide: 'Inversify',
    },
  ],
})
export class AiModule {}
