import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config } from '@src/config';
import { AuthModule } from '@presentation/auth/auth.module';
import { UserModule } from '@presentation/user/user.module';
import { ToolModule } from '@presentation/tool/tool.module';
import { ImageModule } from '@presentation/image/image.module';
import { HelloModule } from '@presentation/hello/hello.module';
import { SystemModule } from '@presentation/system/system.module';
import { PasskeyModule } from '@presentation/passkey/passkey.module';
import { TrainingModule } from '@presentation/training/training.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ToolModule,
    HelloModule,
    ImageModule,
    SystemModule,
    PasskeyModule,
    TrainingModule,
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
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(config.throttle),
  ],
})
export class AppModule {}
