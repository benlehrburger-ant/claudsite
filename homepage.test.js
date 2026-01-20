const request = require("supertest");
const { app, db } = require("./server");

describe("Homepage", () => {
  // Test 1: Homepage returns 200 status
  test("returns 200 status code", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  // Test 2: Homepage returns HTML content type
  test("returns HTML content type", async () => {
    const response = await request(app).get("/");
    expect(response.headers["content-type"]).toMatch(/text\/html/);
  });

  // Test 3: Homepage contains the page title
  test("contains the Anthropic page title", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("Anthropic");
  });

  // Test 4: Homepage contains the hero section title
  test("contains the hero section title", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain(
      "AI research and products that put safety at the frontier",
    );
  });

  // Test 5: Homepage contains navigation links
  test("contains navigation links", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("Research");
    expect(response.text).toContain("News");
    expect(response.text).toContain("Careers");
  });

  // Test 6: Homepage contains the "Try Claude" button
  test("contains Try Claude button", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("Try Claude");
  });

  // Test 7: Homepage contains the Latest Updates section
  test("contains Latest Updates section", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("Latest Updates");
  });

  // Test 8: Homepage contains footer with copyright
  test("contains footer with copyright", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("Anthropic PBC");
  });
});

afterAll(() => {
  db.close();
});
