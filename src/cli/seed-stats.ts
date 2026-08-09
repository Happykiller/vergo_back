// src\cli\seed-stats.ts
import * as readline from 'readline';
import { NestFactory } from '@nestjs/core';

import { config } from '@src/config';
import { AppModule } from '@src/app.module';
import inversify from '@src/inversify/investify';
import { StatsSeeder } from '@src/seeds/stats.seeder';
import { prompt } from '@src/cli/cli.util';

async function bootstrap() {
  inversify.loggerService.log('info', `Environnement selected: ${config.env.mode}`);

  await inversify.init();

  const app = await NestFactory.createApplicationContext(AppModule);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const userId = await prompt(rl, 'User ID: ');
    if (!userId.trim()) {
      console.error('❌ User ID is required');
      process.exit(1);
    }

    const seeder = new StatsSeeder(inversify);
    await seeder.run(userId.trim());
  } catch (e) {
    console.error(`❌ Error: ${e.message}`);
    process.exit(1);
  } finally {
    rl.close();
    await app.close();
    process.exit(0);
  }
}

bootstrap();
