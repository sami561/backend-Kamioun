import request from "supertest";
import { app } from '../../src/app';

describe("GET /api/warehouses", () => {
  it("should return 401 if no auth token is provided", async () => {
    const res = await request(app).get("/api/warehouses");
    expect(res.status).toBe(401);  
    expect(res.body).toHaveProperty("error", "Missing or invalid token");
  });

 
});
