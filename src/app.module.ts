// src\app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from '@src/config';
import { version } from '../package.json';
import inversify from './inversify/investify';
import { AiModule } from '@presentation/ai/ai.module';
import { ImageModule } from '@presentation/image/image.module';
import { WorkoutModule } from '@presentation/workout/workout.module';
import { TrainingModule } from '@presentation/training/training.module';
import { ExerciceModule } from '@presentation/exercice/exercice.module';
import { TrainingStatModule } from '@presentation/training-stat/training-stat.module';
import { AuthGuardModule, AuthModule, PasskeyModule, SystemModule, TestModule, UserModule } from '@happykiller/sunny-apis';

@Module({
  imports: [
    // Sunny
    TestModule,
    AuthGuardModule.forRoot({
      appConfig: config,
      inversify,
    }),
    AuthModule.forRoot({
      jwtConfig: config.jwt as any,
      appConfig: config,
      inversify,
    }),
    SystemModule.forRoot({
      version,
      inversify,
    }),
    PasskeyModule.forRoot({
      inversify,
    }),
    UserModule.forRoot({
      inversify,
    }),
    // Project
    AiModule,
    ImageModule,
    WorkoutModule,
    ExerciceModule,
    TrainingModule,
    TrainingStatModule,
    // Other
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      graphiql: config.env.mode !== 'prod',
      introspection: config.graphQL.introspection,
      autoSchemaFile: config.graphQL.schemaFileName,
      sortSchema: true,
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(config.throttle),
  ],
})
export class AppModule {}
