// src\cli\reset-password.ts
import * as readline from 'readline';
import { NestFactory } from '@nestjs/core';

import { config } from '@src/config';
import { AppModule } from '@src/app.module';
import inversify from '@src/inversify/investify';
import { prompt } from '@src/cli/cli.util';

async function bootstrap() {
  inversify.loggerService.log(
    'info',
    `Environnement selected: ${config.env.mode}`,
  );

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

    const user = await inversify.getUserUsecase.execute({ id: userId.trim() });
    console.log(`\nUser found: ${user.name_first} ${user.name_last} (${user.mail})`);

    const newPassword = await prompt(rl, 'New password: ');
    if (!newPassword.trim()) {
      console.error('❌ Password is required');
      process.exit(1);
    }

    const confirm = await prompt(rl, 'Confirm new password: ');
    if (newPassword !== confirm) {
      console.error('❌ Passwords do not match');
      process.exit(1);
    }

    const cryptPassword = inversify.cryptService.crypt({ message: newPassword });
    await inversify.bddService.updateUser({ user_id: userId.trim(), password: cryptPassword });

    console.log(`✅ Password updated for user ${user.code}`);
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
