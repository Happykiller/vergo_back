// src\cli\seed-stats.ts
import { NestFactory } from '@nestjs/core';

import { config } from '@src/config';
import { AppModule } from '@src/app.module';
import inversify from '@src/inversify/investify';
import { StatsSeeder } from '@src/seeds/stats.seeder';

async function bootstrap() {
  const userId = process.argv[2];

  if (!userId) {
    console.error('❌ Please provide a userId as an argument');
    process.exit(1);
  }

  inversify.loggerService.log(
    'info',
    `Environnement selected: ${config.env.mode}`,
  );

  await inversify.init();

  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = new StatsSeeder(inversify);
  await seeder.run(userId);

  await app.close();
  process.exit(0);
}

bootstrap();
