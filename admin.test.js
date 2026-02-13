const request = require("supertest");
const { app, db } = require("./server");

describe("Admin Routes", () => {
  // Test: Admin dashboard
  test("GET /admin returns 200 and HTML", async () => {
    const response = await request(app).get("/admin");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
  });

  test("GET /admin contains dashboard content", async () => {
    const response = await request(app).get("/admin");
    expect(response.text).toContain("Dashboard");
  });

  // Test: Create new post page
  test("GET /admin/posts/new returns 200 and HTML", async () => {
    const response = await request(app).get("/admin/posts/new");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
  });

  test("GET /admin/posts/new contains form", async () => {
    const response = await request(app).get("/admin/posts/new");
    expect(response.text).toContain("Create New Post");
  });

  // Test: Edit post page
  test("GET /admin/posts/:id/edit returns 200 for valid post", async () => {
    // Get first post to get a valid ID
    const posts = db.prepare("SELECT id FROM posts LIMIT 1").all();
    if (posts.length > 0) {
      const response = await request(app).get(
        `/admin/posts/${posts[0].id}/edit`,
      );
      expect(response.status).toBe(200);
      expect(response.text).toContain("Edit Post");
    }
  });

  test("GET /admin/posts/:id/edit returns 404 for invalid post", async () => {
    const response = await request(app).get("/admin/posts/999999/edit");
    expect(response.status).toBe(404);
  });
});

afterAll(() => {
  db.close();
});
