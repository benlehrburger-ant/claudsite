const request = require("supertest");
const { app, db } = require("./server");

describe("Support Page", () => {
  test("GET /support returns 200 and HTML", async () => {
    const response = await request(app).get("/support");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
  });

  test("GET /support contains support chat interface", async () => {
    const response = await request(app).get("/support");
    expect(response.text).toContain("Support");
  });
});

afterAll(() => {
  db.close();
});
