import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { ApolloDriver } from '@nestjs/apollo';
import { NestApplication } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { config } from '@src/config';
import { AiModule } from '@presentation/ai/ai.module';
import { JwtStrategy } from '@presentation/auth/jwt.strategy';

describe('SystemModule (e2e)', () => {
  let app: NestApplication;
  const token: string = jwt.sign(
    {
      id: '65d4d015261e894a1da31a64',
      code: 'ropo',
    },
    config.jwt.secret,
    {
      expiresIn: '24h', // expires in 24 hours
    },
  );
  const authorization: string = 'Bearer ' + token;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
      imports: [
        AiModule,
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: config.graphQL.schemaFileName,
          context: ({ req, res }) => {
            return { req, res };
          },
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('#ai_get_glossary', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query {
          ai_get_glossary
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.ai_get_glossary;
        expect(data).toBeDefined();
      })
      .expect(200);
  });

  it('#ai_get_images', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query {
          ai_get_images
        }`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.ai_get_images;
        expect(data).toBeDefined();
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
