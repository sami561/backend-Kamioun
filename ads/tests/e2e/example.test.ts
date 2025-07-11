import request from 'supertest';
import { app } from '../../src/app';

describe('GET /api/health', () => {
  it('should return a 200 status and a message', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ test: true });
  });
});
