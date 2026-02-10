# Anthropic Website Clone

A full-stack Anthropic website clone with a blog CMS and article service.

## Project Collaborators

- **benlehrburger-ant** - Human collaborator
- **Claude** - AI pair programming assistant

## Ongoing Projects

### JavaScript to TypeScript Migration

The frontend codebase is being gradually migrated from JavaScript to TypeScript for improved type safety and developer experience.

### Java 21 Upgrade

The backend is being upgraded from Java 17 to Java 21 to take advantage of newer language features and performance improvements.

## Architecture

### Frontend (Node.js/Express)

**Entry point:** `server.js` (port 3000)

- **Template engine:** EJS (`views/`)
- **Static assets:** `public/` (css, images, js)
- **Database:** SQLite via better-sqlite3 (`blog.db`)

### Backend (Java/Spring Boot)

**Location:** `backend/`

- Spring Boot 3.2.0 with Java 21
- Article service API on port 8080
- Package: `com.anthropic.articleservice`

## Key Routes

### Public Pages

- `/` - Homepage (shows 3 latest published posts)
- `/blog` - Blog listing
- `/blog/:slug` - Single blog post
- `/articles/:id` - Article pages (tries Java backend first, falls back to Node.js)

### Admin

- `/admin` - Dashboard (lists all posts)
- `/admin/posts/new` - Create post
- `/admin/posts/:id/edit` - Edit post

### REST API

- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/articles` - List articles (Node fallback)
- `GET /api/articles/:id` - Get article (Node fallback)

## Database Schema

### Posts Table

```sql
posts (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'News',
  author TEXT DEFAULT 'Anthropic',
  featured_image TEXT,
  published BOOLEAN DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
)
```

## Java Backend Structure

```
backend/src/main/java/com/anthropic/articleservice/
├── ArticleServiceApplication.java  # Main entry
├── controller/
│   └── ArticleController.java      # REST endpoints
├── model/
│   └── Article.java                # V1 article model
├── newmodel/                       # V2 article system
│   ├── ArticleV2.java              # Rich article record
│   ├── Author.java
│   ├── Content.java
│   ├── ContentRenderer.java        # Pattern matching switch renderer
│   ├── Taxonomy.java
│   └── ArticleMedia.java
└── repository/
    └── ArticleRepository.java
```

The `ArticleV2` model supports versioning, localization, SEO metadata, engagement tracking, and series organization.

## Running

```bash
# Node.js frontend
npm install
npm run dev  # uses nodemon

# Java backend (optional)
cd backend
./mvnw spring-boot:run
```

## Testing

### Frontend Tests

**Test framework:** Jest with Supertest

**Run tests:**

```bash
npm test
```

**Test files:**

- `homepage.test.js` - Homepage integration tests

**Current test coverage:**
The homepage tests verify:

- HTTP 200 status code
- HTML content-type header
- Page title contains "Anthropic"
- Hero section title: "AI research and products that put safety at the frontier"
- Navigation links (Research, News, Careers)
- "Try Claude" button presence
- "Latest Updates" section
- Footer with "Anthropic PBC" copyright

**Configuration:**
Jest is configured in `package.json` with `testEnvironment: "node"`. Tests use `--no-webstorage` flag to avoid localStorage issues in Node environment.

## Article Fallback Pattern

The Node.js server attempts to fetch articles from the Java backend at `http://localhost:8080/api/articles/:id`. If unavailable, it falls back to hardcoded article data in `server.js`.
