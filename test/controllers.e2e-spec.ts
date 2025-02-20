import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Testing All Controllers Operating (GET)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: { findMany: jest.fn().mockResolvedValue([]) },
        instrument: { findMany: jest.fn().mockResolvedValue([]) },
        musicGender: { findMany: jest.fn().mockResolvedValue([]) },
        course: { findMany: jest.fn().mockResolvedValue([]) },
        module: { findMany: jest.fn().mockResolvedValue([]) },
        lesson: { findMany: jest.fn().mockResolvedValue([]) },
        enrollment: { findMany: jest.fn().mockResolvedValue([]) },
        approveInstructorRequest: {
          findMany: jest.fn().mockResolvedValue([]),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) : users', () => {
    return request(app.getHttpServer()).get('/users').expect(200);
  });

  it('/ (GET) : instruments', () => {
    return request(app.getHttpServer()).get('/instruments').expect(200);
  });

  it('/ (GET) : music genders', () => {
    return request(app.getHttpServer()).get('/music-gender').expect(200);
  });

  it('/ (GET) : courses', () => {
    return request(app.getHttpServer()).get('/courses').expect(200);
  });

  it('/ (GET) : modules', () => {
    return request(app.getHttpServer()).get('/modules').expect(200);
  });

  it('/ (GET) : lessons', () => {
    return request(app.getHttpServer()).get('/lessons').expect(200);
  });

  it('/ (GET) : enrollment', () => {
    return request(app.getHttpServer()).get('/enrollment').expect(200);
  });

  it('/ (GET) : approve-requests', () => {
    return request(app.getHttpServer()).get('/approve-requests').expect(200);
  });
});
