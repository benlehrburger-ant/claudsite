import { query } from "@anthropic-ai/claude-agent-sdk";
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_CONTEXT = `You are a friendly, concise support agent for the Anthropic website.
You help visitors find articles, understand products, and navigate the site.

## Tools at your disposal

### Site content search
Query the site's SQLite database (blog.db) to find articles and posts:
- List all posts: sqlite3 blog.db "SELECT title, slug, category, excerpt FROM posts WHERE published = 1 ORDER BY created_at DESC"
- Search posts by keyword: sqlite3 blog.db "SELECT title, slug, excerpt FROM posts WHERE published = 1 AND (title LIKE '%keyword%' OR content LIKE '%keyword%')"
- When referencing site articles, format links as: [Title](/blog/<slug>)

### Anthropic docs search
Use WebSearch and WebFetch to find information from official Anthropic documentation.
Search docs.anthropic.com for API references, model details, pricing, and guides.
When referencing docs, include the full URL as a link.

## Guidelines
- Search the site database first for content questions.
- Search Anthropic docs when users ask about the API, Claude models, pricing, or technical documentation.
- Keep responses short and helpful. Use 2-3 sentences max unless the user asks for detail.
- Always use tools to look up information rather than guessing.`;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const conversationHistory = history
    ? history
        .map((m) => `${m.role === "user" ? "User" : "Agent"}: ${m.content}`)
        .join("\n")
    : "";

  const prompt = conversationHistory
    ? `${SYSTEM_CONTEXT}\n\nConversation so far:\n${conversationHistory}\n\nUser: ${message}\n\nRespond concisely as the support agent.`
    : `${SYSTEM_CONTEXT}\n\nUser: ${message}\n\nRespond concisely as the support agent.`;

  try {
    let response = "";

    for await (const msg of query({
      prompt,
      options: {
        allowedTools: ["Bash", "Read", "Grep", "WebSearch", "WebFetch"],
        permissionMode: "bypassPermissions",
        cwd: process.cwd(),
      },
    })) {
      if (msg.type === "result") {
        response = msg.result;
      }
    }

    res.json({
      response:
        response || "I'm not sure how to help with that. Could you rephrase?",
    });
  } catch (error) {
    console.error("Agent error:", error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const PORT = process.env.AGENT_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Support agent running at http://localhost:${PORT}`);
});
