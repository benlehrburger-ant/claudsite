const request = require("supertest");
const { app, db } = require("./server");

describe("API Routes", () => {
  let testPostId;

  // Test: GET /api/posts
  test("GET /api/posts returns JSON array", async () => {
    const response = await request(app).get("/api/posts");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test: POST /api/posts
  test("POST /api/posts creates new post", async () => {
    const newPost = {
      title: "Test Post",
      slug: "test-post-" + Date.now(),
      excerpt: "Test excerpt",
      content: "Test content",
      category: "Test",
      published: false,
    };

    const response = await request(app).post("/api/posts").send(newPost);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("id");
    testPostId = response.body.id;
  });

  // Test: PUT /api/posts/:id
  test("PUT /api/posts/:id updates post", async () => {
    // Get the current post first
    const getResponse = await request(app).get("/api/posts");
    const post = getResponse.body.find((p) => p.id === testPostId);

    const updates = {
      title: "Updated Test Post",
      slug: post.slug,
      excerpt: post.excerpt,
      content: "Updated content",
      category: post.category,
      published: post.published,
    };

    const response = await request(app)
      .put(`/api/posts/${testPostId}`)
      .send(updates);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
  });

  // Test: DELETE /api/posts/:id
  test("DELETE /api/posts/:id removes post", async () => {
    const response = await request(app).delete(`/api/posts/${testPostId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
  });

  // Test: GET /api/articles
  test("GET /api/articles returns fallback articles", async () => {
    const response = await request(app).get("/api/articles");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test: GET /api/articles/:id
  test("GET /api/articles/:id returns specific article", async () => {
    const response = await request(app).get("/api/articles/claude-opus-4-6");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", "claude-opus-4-6");
  });

  test("GET /api/articles/:id returns 404 for invalid article", async () => {
    const response = await request(app).get("/api/articles/invalid-id");
    expect(response.status).toBe(404);
  });
});

afterAll(() => {
  db.close();
});
