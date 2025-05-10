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
      jwtConfig: config.jwt,
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
    // Other
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { connectionParams, subscriptions } = context;
            return { req: { Authorization: connectionParams.Authorization } };
          },
        },
      },
      playground: config.graphQL.playground,
      introspection: config.graphQL.introspection,
      autoSchemaFile: config.graphQL.schemaFileName,
      sortSchema: true,  // optionnel, pour trier les types dans le schéma généré
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(config.throttle),
  ],
})
export class AppModule {}
