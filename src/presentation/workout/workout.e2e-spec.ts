import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { ApolloDriver } from '@nestjs/apollo';
import { NestApplication } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { config } from '@src/config';
import { USER_ROLE } from '@presentation/guard/userRole';
import { userRopo } from '@service/db/fake/mock/user.ropo';
import { JwtStrategy } from '@presentation/auth/jwt.strategy';
import { WorkoutModule } from '@presentation/workout/workout.module';

describe('WorkoutModule (e2e)', () => {
  let app: NestApplication;
  const token: string = jwt.sign(
    {
      id: userRopo.id,
      code: userRopo.code,
      role: USER_ROLE.USER,
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
        WorkoutModule,
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          driver: ApolloDriver,
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

  it('#workouts', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query workouts {
  workouts (
    limit: 5
    order_by: {
      field: "slug"
      order: DESC
    }
  ) {
    count
    nodes {
      id
      slug
      title {
        lang
        value
      }
      description {
        lang
        value
      }
      image
    }
  }
}`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.workouts.nodes;
        expect(data.length).toBeGreaterThan(1);
      })
      .expect(200);
  });

  it('#searchWorkoutsPaginated', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `query searchWorkoutsPaginated {
  searchWorkoutsPaginated (
    dto: {
      workouts_slug: ["warm-up", "workout", "cooldown"]
    }
  ) {
    count
    nodes {
      search
      found {
        id
        slug
        title {
          lang
          value
        }
        description {
          lang
          value
        }
        image
      }
    }
  }
}`,
      })
      .set('Authorization', authorization)
      .expect(({ body }) => {
        const data = body.data.searchWorkoutsPaginated.nodes;
        expect(data.length).toBeGreaterThan(1);
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
