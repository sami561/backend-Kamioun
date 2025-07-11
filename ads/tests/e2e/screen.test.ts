import request from 'supertest';
import { app } from '../../src/app';
import { testDbCleanup, testDbConnect } from '../../src/test/utils';
import mongoose from 'mongoose';
import { ScreenStatus } from '../../src/types/screen.types';
import { faker } from '@faker-js/faker';

let db: typeof mongoose;

describe('Screen test', () => {
  beforeAll(async () => {
    db = await testDbConnect();
  });

  afterAll(async () => {
    await testDbCleanup(db);
  });


  const createScreenDto = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    status: ScreenStatus.DAFT,
    position: 1,
  };

  describe('POST /api/screen', () => {
    it('should create a screen and return 200', async () => {
      const { body, status } = await request(app)
        .post('/api/screen')
        .set('X-API-Key', '12345-abcde-67890-fghij')
        .send(createScreenDto);
      expect(status).toBe(200);
    });
  });
  describe('GET /api/screen', () => {
    it('should get a screens array with the created screen', async () => {
      const { body, status } = await request(app)
        .get('/api/screen')
        .set('X-API-Key', '12345-abcde-67890-fghij');
      expect(status).toBe(200);
    });
  });
});
