const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database("blog.db");

// Create blog posts table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'News',
    author TEXT DEFAULT 'Anthropic',
    featured_image TEXT,
    published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed some initial posts if table is empty
const count = db.prepare("SELECT COUNT(*) as count FROM posts").get();
if (count.count === 0) {
  const insertPost = db.prepare(`
    INSERT INTO posts (title, slug, excerpt, content, category, published)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertPost.run(
    "Introducing Claude Opus 4.5",
    "introducing-claude-opus-4-5",
    "Our most capable model yet, combining enhanced reasoning with improved safety.",
    `<p>Today we're announcing Claude Opus 4.5, our most capable model to date. This release represents a significant advancement in AI capabilities while maintaining our commitment to safety.</p>
    <p>Opus 4.5 demonstrates improved performance across a wide range of benchmarks, including complex reasoning tasks, coding challenges, and creative writing.</p>
    <h2>Key Improvements</h2>
    <ul>
      <li>Enhanced reasoning capabilities</li>
      <li>Better context understanding</li>
      <li>Improved safety measures</li>
      <li>Faster response times</li>
    </ul>`,
    "Research",
    1,
  );

  insertPost.run(
    "Our Approach to AI Safety",
    "our-approach-to-ai-safety",
    "How we build AI systems that are helpful, harmless, and honest.",
    `<p>At Anthropic, safety is not an afterthought—it's the foundation of everything we build. Our approach to AI safety is guided by three core principles: being helpful, harmless, and honest.</p>
    <p>We believe that the development of powerful AI systems requires careful consideration of potential risks and proactive measures to mitigate them.</p>`,
    "Safety",
    1,
  );

  insertPost.run(
    "Claude for Enterprise",
    "claude-for-enterprise",
    "Bringing Claude to teams with enhanced security and collaboration features.",
    `<p>We're excited to introduce Claude for Enterprise, designed specifically for organizations that need powerful AI capabilities with enterprise-grade security.</p>
    <p>Enterprise customers get access to advanced features including SSO integration, audit logs, and dedicated support.</p>`,
    "Product",
    1,
  );
}

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// Homepage
app.get("/", (req, res) => {
  const posts = db
    .prepare(
      `
    SELECT id, title, slug, excerpt, category, created_at
    FROM posts
    WHERE published = 1
    ORDER BY created_at DESC
    LIMIT 3
  `,
    )
    .all();

  res.render("index", { posts });
});

// Blog listing
app.get("/blog", (req, res) => {
  const posts = db
    .prepare(
      `
    SELECT id, title, slug, excerpt, category, author, created_at
    FROM posts
    WHERE published = 1
    ORDER BY created_at DESC
  `,
    )
    .all();

  res.render("blog", { posts });
});

// Command reference page
app.get("/command-reference", (req, res) => {
  res.render("command-reference");
});

// Support page
app.get("/support", (req, res) => {
  res.render("support");
});

// Single blog post
app.get("/blog/:slug", (req, res) => {
  const post = db
    .prepare("SELECT * FROM posts WHERE slug = ? AND published = 1")
    .get(req.params.slug);

  if (!post) {
    return res.status(404).render("404");
  }

  res.render("post", { post });
});

// Article data (served from Java backend, with Node.js fallback)
const articles = {
  "claude-opus-4-5": {
    id: "claude-opus-4-5",
    title: "Claude Opus 4.5",
    subtitle:
      "Intelligent, efficient, and the best model in the world for coding, agents, and computer use",
    date: "November 24, 2025",
    category: "Product",
    excerpt:
      "Our newest model excels at coding and computer use while improving everyday tasks like research and spreadsheet work.",
    author: "Anthropic",
    authorRole: "Product Team",
    heroImage: "/images/opus-page.png",
    heroImageAlt: "Claude Opus 4.5 announcement graphic",
    readingTimeMinutes: 8,
    tags: ["AI", "Claude", "Product Launch", "Machine Learning"],
    sections: [
      {
        type: "paragraph",
        content:
          'Anthropic has launched Claude Opus 4.5, described as "intelligent, efficient, and the best model in the world for coding, agents, and computer use." The model achieves state-of-the-art performance on software engineering benchmarks and demonstrates significant improvements across multiple domains.',
      },
      { type: "heading", heading: "Key Performance Metrics" },
      {
        type: "list",
        items: [
          "SWE-bench Verified: Opus 4.5 leads on real-world software engineering tasks",
          "Coding Capability: Excels across 7 of 8 programming languages on SWE-bench Multilingual",
          "Token Efficiency: At medium effort, matches Sonnet 4.5 performance while using 76% fewer output tokens",
          "Long-horizon Tasks: 29% improvement over Sonnet 4.5 on Vending-Bench for sustained reasoning",
        ],
      },
      { type: "heading", heading: "Pricing & Availability" },
      {
        type: "paragraph",
        content:
          "The model is accessible via Claude apps, API, and three major cloud platforms at $5/$25 per million tokens—making Opus-level capabilities more broadly available.",
      },
      { type: "heading", heading: "Notable Capabilities" },
      {
        type: "paragraph",
        content:
          'Customers highlighted strengths in autonomous task execution, code refactoring across multiple codebases, financial modeling, and long-context content generation. One tester noted the model "figures out the fix" when pointed at complex, multi-system bugs.',
      },
      {
        type: "quote",
        content:
          "Opus 4.5 figures out the fix when pointed at complex, multi-system bugs.",
      },
      { type: "heading", heading: "Safety Improvements" },
      {
        type: "paragraph",
        content:
          "Opus 4.5 demonstrates enhanced robustness against prompt injection attacks compared to competing frontier models, positioning it as more resistant to adversarial manipulation.",
      },
    ],
  },
  "economic-index": {
    id: "economic-index",
    title: "The Anthropic Economic Index",
    subtitle:
      "Understanding AI's effects on the economy through real-world usage data",
    date: "September 15, 2025",
    category: "Research",
    excerpt:
      "Understanding AI's effects on the economy by analyzing how people use Claude across US states and occupations.",
    author: "Anthropic Research",
    authorRole: "Economics Research Team",
    heroImage: "/images/econ-page.png",
    heroImageAlt: "Anthropic Economic Index dashboard visualization",
    readingTimeMinutes: 12,
    tags: ["Research", "Economics", "AI Impact", "Data Analysis"],
    sections: [
      {
        type: "paragraph",
        content:
          'The Anthropic Economic Index is a research initiative examining "AI\'s effects on the economy." The page features an interactive dashboard displaying Claude usage patterns across geographic regions and professional sectors.',
      },
      { type: "heading", heading: "Dataset Information" },
      {
        type: "list",
        items: [
          "Version: v4",
          "Release Date: November 4, 2025",
          "Data Collection Period: August 4-11, 2025",
          "Source: Claude AI (Free and Pro)",
        ],
      },
      { type: "heading", heading: "Available Data Views" },
      {
        type: "paragraph",
        content: "The index provides five analytical tabs:",
      },
      {
        type: "list",
        items: [
          "US usage patterns",
          "State-level usage data",
          "Global usage statistics",
          "Country-specific usage metrics",
          "Job explorer tool",
        ],
      },
      { type: "heading", heading: "Data Sample" },
      {
        type: "paragraph",
        content:
          "The dataset tracks Claude requests across multiple professional domains. For example, among countries, the United Arab Emirates shows significant activity in programming assistance tasks like debugging software code (5.15% of requests) and comprehensive financial guidance (2.66% of requests).",
      },
      { type: "heading", heading: "Access & Resources" },
      {
        type: "list",
        items: [
          "Full research report available",
          "Dataset downloadable via Hugging Face",
          "Interactive visualization interface",
        ],
      },
      {
        type: "paragraph",
        content:
          "The index represents Anthropic's effort to quantify AI adoption patterns and demonstrate how professionals utilize AI tools across diverse occupations and geographies.",
      },
    ],
  },
  "building-effective-agents": {
    id: "building-effective-agents",
    title: "Building Effective Agents",
    subtitle: "Lessons learned from building LLM agents with dozens of teams",
    date: "December 19, 2024",
    category: "Engineering",
    excerpt:
      "The most successful implementations use simple patterns rather than complex frameworks or specialized libraries.",
    author: "Anthropic Engineering",
    authorRole: "Applied AI Team",
    heroImage: "/images/agent-page.svg",
    heroImageAlt: "Diagram showing agent architecture patterns",
    readingTimeMinutes: 15,
    tags: ["Engineering", "Agents", "LLM", "Best Practices", "Architecture"],
    sections: [
      {
        type: "paragraph",
        content:
          'Anthropic shares insights from working with dozens of teams building LLM agents. The key finding: "the most successful implementations weren\'t using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns."',
      },
      {
        type: "quote",
        content:
          "The most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns.",
      },
      { type: "heading", heading: "Core Distinctions" },
      {
        type: "paragraph",
        content: "The article defines two types of agentic systems:",
      },
      {
        type: "list",
        items: [
          "Workflows: systems where LLMs and tools are orchestrated through predefined code paths",
          "Agents: systems where LLMs dynamically direct their own processes and tool usage",
        ],
      },
      { type: "heading", heading: "Key Patterns Covered" },
      {
        type: "list",
        items: [
          "Augmented LLM - Foundation with retrieval, tools, and memory capabilities",
          "Prompt Chaining - Sequential task decomposition with quality checks",
          "Routing - Directing inputs to specialized downstream processes",
          "Parallelization - Running tasks simultaneously (sectioning and voting approaches)",
          "Orchestrator-Workers - Central LLM delegating to worker LLMs dynamically",
          "Evaluator-Optimizer - Iterative refinement through feedback loops",
          "Autonomous Agents - Open-ended problem-solving with environmental feedback",
        ],
      },
      { type: "heading", heading: "Main Recommendations" },
      {
        type: "list",
        items: [
          "Start with simple solutions; increase complexity only when demonstrably beneficial",
          "Use LLM APIs directly before adopting frameworks",
          "Invest significantly in tool documentation and testing (ACI design)",
          "Follow three core principles: simplicity, transparency, and thorough documentation",
        ],
      },
      { type: "heading", heading: "Practical Applications" },
      {
        type: "paragraph",
        content:
          "The article highlights two domains showing strong results: customer support and software development, where agents enable verification, clear success metrics, and meaningful human oversight.",
      },
    ],
  },
};

// Article pages - fetches content from Java backend with Node.js fallback
app.get("/articles/:id", async (req, res) => {
  const articleId = req.params.id;

  // Try Java backend first
  try {
    const response = await fetch(
      `http://localhost:8080/api/articles/${articleId}`,
    );
    if (response.ok) {
      const article = await response.json();
      return res.render("article", { article });
    }
  } catch (error) {
    console.log("Java backend not available, using fallback");
  }

  // Fallback to Node.js served articles
  const article = articles[articleId];
  if (!article) {
    return res.status(404).render("404");
  }

  res.render("article", { article });
});

// API endpoint for articles (Node.js fallback)
app.get("/api/articles", (req, res) => {
  res.json(Object.values(articles));
});

app.get("/api/articles/:id", (req, res) => {
  const article = articles[req.params.id];
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  res.json(article);
});

// Admin dashboard
app.get("/admin", (req, res) => {
  const posts = db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC")
    .all();
  res.render("admin/dashboard", { posts });
});

// Create new post form
app.get("/admin/posts/new", (req, res) => {
  res.render("admin/editor", { post: null });
});

// Edit post form
app.get("/admin/posts/:id/edit", (req, res) => {
  const post = db
    .prepare("SELECT * FROM posts WHERE id = ?")
    .get(req.params.id);

  if (!post) {
    return res.status(404).render("404");
  }

  res.render("admin/editor", { post });
});

// API Routes

// Create post
app.post("/api/posts", (req, res) => {
  const { title, slug, excerpt, content, category, published } = req.body;

  try {
    const result = db
      .prepare(
        `
      INSERT INTO posts (title, slug, excerpt, content, category, published)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        title,
        slug,
        excerpt,
        content,
        category || "News",
        published ? 1 : 0,
      );

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update post
app.put("/api/posts/:id", (req, res) => {
  const { title, slug, excerpt, content, category, published } = req.body;

  try {
    db.prepare(
      `
      UPDATE posts
      SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(
      title,
      slug,
      excerpt,
      content,
      category,
      published ? 1 : 0,
      req.params.id,
    );

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete post
app.delete("/api/posts/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all posts (API)
app.get("/api/posts", (req, res) => {
  const posts = db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC")
    .all();
  res.json(posts);
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = { app, db };
