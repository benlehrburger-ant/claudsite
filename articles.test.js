const request = require("supertest");
const { app, db } = require("./server");

describe("Article Routes", () => {
  // Test: Articles with fallback data
  test("GET /articles/:id returns 200 for valid article", async () => {
    const response = await request(app).get("/articles/claude-opus-4-6");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
  });

  test("GET /articles/:id displays article content", async () => {
    const response = await request(app).get("/articles/claude-opus-4-6");
    expect(response.text).toContain("Claude Opus 4.6");
  });

  // Test: Intentionally broken route
  test("GET /articles/opus-4-5 returns 500 error", async () => {
    const response = await request(app).get("/articles/opus-4-5");
    expect(response.status).toBe(500);
  });

  test("GET /articles/:id returns 404 for invalid article", async () => {
    const response = await request(app).get("/articles/nonexistent-article");
    expect(response.status).toBe(404);
  });
});

afterAll(() => {
  db.close();
});
