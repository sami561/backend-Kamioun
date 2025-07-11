import request from 'supertest';
import { app } from '../../src/app';
import { testDbCleanup, testDbConnect } from '../../src/test/utils';
import mongoose from 'mongoose';
import { adStatus, adType, CreateAdDto } from '../../src/types/ad.types';
import { faker } from '@faker-js/faker';

let db: typeof mongoose;

describe('ad test', () => {
  beforeAll(async () => {
    db = await testDbConnect();
  });

  afterAll(async () => {
    await testDbCleanup(db);
  });

  const createAdDto: CreateAdDto = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    imageUrl: [faker.image.url()],
    clickUrl: faker.internet.url(),
    status: adStatus.INACTIVE,
    adType: adType.ProductShowcase,
    startDate: faker.date.recent(),
    endDate: faker.date.future(),
  };

  describe('POST /api/ad', () => {
    it('should create a ad and return 200', async () => {
      const { body, status } = await request(app)
        .post('/api/ad')
        .set('X-API-Key', '12345-abcde-67890-fghij')
        .send(createAdDto);
      expect(status).toBe(200);
    });
    it('should get a ads array with the created ad', async () => {
      const { body, status } = await request(app)
        .get('/api/ad')
        .set('X-API-Key', '12345-abcde-67890-fghij');
      expect(status).toBe(200);
    });
  });
});

