const request = require("supertest");
const { app, db } = require("./server");

describe("News Page", () => {
  test("GET /news returns 200 and HTML", async () => {
    const response = await request(app).get("/news");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
  });

  test("renders exactly as many .card elements as published posts in database", async () => {
    // Query database for published post count
    const publishedCount = db
      .prepare("SELECT COUNT(*) as count FROM posts WHERE published = 1")
      .get().count;

    // Get the news page
    const response = await request(app).get("/news");

    // Count card elements on the page
    const cardMatches = response.text.match(/class="card"/g);
    expect(cardMatches).toHaveLength(publishedCount);
  });
});

afterAll(() => {
  db.close();
});
