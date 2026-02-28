const request = require("supertest");
const app = require("../index"); // we may slightly adjust index.js export

describe("Health endpoint", () => {
  it("should return 200", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
  });
});
