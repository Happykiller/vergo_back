// src\seeds\stats.seeder.ts
import { Injectable } from '@nestjs/common';
import { Inversify } from '@src/inversify/investify';
import { UserSession } from '@happykiller/sunny-apis/dist/graphql/auth/jwt.strategy';
import { SaveTrainingStatUsecaseDto } from '@usecase/training-stat/dto/save.training-stat.usecase.dto';

@Injectable()
export class StatsSeeder {
  trainings = 42;

  constructor(private readonly inversify: Inversify) { }

  async run(userId: string) {
    console.log(`🔁 Seeding training stats for user: ${userId}`);

    const user = await this.inversify.getUserUsecase.execute({ id: userId });

    const session: UserSession = {
      id: user.id,
      code: user.code,
      role: user.role,
    };

    const allTrainings = await this.inversify.getTrainingsUsecase.execute();

    if (allTrainings.length === 0) {
      console.log('⚠️ No trainings found for this user.');
      return;
    }

    const selectedTrainings = this.pickTrainings(allTrainings, this.trainings);

    for (const training of selectedTrainings) {
      const durationInMinutes = this.randomInt(10, 180);
      const durationInSeconds = durationInMinutes * 60;

      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      const end = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
      const start = new Date(end.getTime() - durationInSeconds * 1000);

      const dto: SaveTrainingStatUsecaseDto = {
        training_id: training.id,
        start: start.toISOString(),
        end: end.toISOString(),
        durationInSeconds,
        completed: Math.random() > 0.2,
        session,
      };

      const stat = await this.inversify.saveTrainingStatUsecase.execute(dto);
      console.log(`✅ Training stat created for ${training.id} → ${stat.id}`);
    }
  }

  private pickTrainings<T>(array: T[], count: number): T[] {
    const picked: T[] = [];
    for (let i = 0; i < count; i++) {
      const randomItem = array[Math.floor(Math.random() * array.length)];
      picked.push(randomItem);
    }
    return picked;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
