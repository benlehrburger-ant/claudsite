# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Anthropic website clone with Node.js/Express frontend and optional Java/Spring Boot backend. Features a blog CMS with SQLite database, article service with fallback architecture, and an AI support agent using Claude Agent SDK.

## Development Commands

### Frontend (Primary)

```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server with nodemon (port 3000)
npm start                      # Start production server
npm test                       # Run Jest integration tests
npm test:playwright            # Run Playwright E2E tests
npm run agent                  # Start support agent (port 3001)
```

### Backend (Optional)

```bash
cd backend
./mvnw spring-boot:run         # Start Java backend (port 8080)
./mvnw clean package           # Build JAR
```

### Run Everything

```bash
npm run dev:all                # Concurrent frontend + backend
```

## Architecture

### Dual-Service Design

The application uses a **resilient fallback pattern**:

1. **Primary**: Node.js frontend attempts to fetch articles from Java backend (`http://localhost:8080/api/articles/:id`)
2. **Fallback**: If Java backend is unavailable, Node.js serves hardcoded article data from `server.js`
3. **Result**: Site functions fully even when backend is down

This pattern is implemented in server.js:181-227 and server.js:412-436.

### Frontend Stack (Node.js/Express)

- **Entry point**: `server.js` (port 3000)
- **Template engine**: EJS in `views/`
- **Database**: SQLite (`blog.db`) using better-sqlite3 (in-memory, created at startup)
- **Static assets**: `public/` (CSS, images, JS)
- **Support agent**: `agent/support-agent.mjs` using Claude Agent SDK

### Backend Stack (Java/Spring Boot)

- **Entry point**: `backend/src/main/java/com/anthropic/articleservice/ArticleServiceApplication.java`
- **Port**: 8080
- **Framework**: Spring Boot 3.2.0
- **Java version**: Java 17 (ongoing upgrade to Java 21)
- **Storage**: In-memory HashMap (no database)
- **Package**: `com.anthropic.articleservice`

### Support Agent

The `agent/support-agent.mjs` provides an AI-powered chatbot that:

- Searches the SQLite blog database for site content
- Uses WebSearch/WebFetch for Anthropic documentation
- Runs on port 3001 with Express
- Uses Claude Agent SDK with allowed tools: Bash, Read, Grep, WebSearch, WebFetch

## Key Routes & Endpoints

### Public Pages

- `/` - Homepage (shows 3 latest published posts)
- `/blog` - Blog listing page
- `/blog/:slug` - Individual blog post
- `/articles/:id` - Article pages (Java backend with Node fallback)
- `/support` - Support chat interface
- `/articles/opus-4-5` - Intentionally broken route (returns 500 for demo)

### Admin Pages

- `/admin` - Dashboard (all posts)
- `/admin/posts/new` - Create new post
- `/admin/posts/:id/edit` - Edit post

### REST API (Node.js)

- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/articles` - List articles (fallback)
- `GET /api/articles/:id` - Get article (fallback)

### REST API (Java Backend)

- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get article by ID

CORS is enabled on Java backend for all origins.

## Database Schema

### Posts Table (SQLite)

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

The database is initialized and seeded in `server.js` lines 13-144 if empty.

## Java Backend Architecture

### Article Models

**V1 (Active)**: Located in `backend/src/main/java/com/anthropic/articleservice/model/Article.java`

- Uses Java records with nested `Section` record
- Article IDs are strings (e.g., "claude-opus-4-6")
- Section types: paragraph, heading, list, image, code, quote
- Use static factory methods (e.g., `Section.paragraph(content)`) rather than constructor

**V2 (Not Integrated)**: Located in `backend/src/main/java/com/anthropic/articleservice/newmodel/`

- Advanced features: versioning, localization, SEO metadata, engagement tracking
- Sealed content interface with 12 content block types
- Rich authorship with multiple contributors
- Publishing workflow states (DRAFT, REVIEW, SCHEDULED, PUBLISHED, ARCHIVED)
- **Note**: Has package declaration mismatch that needs fixing before use

### Repository Pattern

`ArticleRepository.java` stores articles in-memory using `HashMap<String, Article>`. To add articles, modify `initializeArticles()` method.

Current articles: `claude-opus-4-6`, `economic-index`, `building-effective-agents`

## Testing

### Jest (Integration Tests)

- **Config**: In `package.json` with `testEnvironment: "node"`
- **Run**: `npm test` (uses `--no-webstorage` flag)
- **Files**: `homepage.test.js`
- Tests verify: status codes, content-type, page elements, navigation, footer

### Playwright (E2E Tests)

- **Config**: `playwright.config.js`
- **Run**: `npm run test:playwright`
- **Files**: `**/*.playwright.test.js` (e.g., `article-link.playwright.test.js`)
- **Settings**: Headless: false, slowMo: 500, auto-start server on port 3000

## Ongoing Migrations

1. **TypeScript Migration**: Frontend codebase gradually migrating from JavaScript to TypeScript
   - Type definitions already added: `@types/express`, `@types/node`, etc.
   - Migration in progress, not complete

2. **Java 21 Upgrade**: Backend upgrading from Java 17 to Java 21
   - Currently on Java 17 (pom.xml line 21)
   - Target: Java 21 for modern language features

## Important Implementation Notes

### Java Backend Limitations

- **No persistence**: In-memory storage only (data lost on restart)
- **No validation**: Input validation not implemented
- **No tests**: Test directory exists but empty
- **V2 models**: Complete but not wired to controller

### Hardcoded Article Data

Articles in `server.js` (lines 212-405) serve as fallback data. This data structure must match the Java Article model for seamless fallback.

### Server Exports

`server.js` exports both `app` and `db` for testing (line 563). Server only starts if run directly (`require.main === module`).

## Project Collaborators

- **benlehrburger-ant** - Human developer
- **Claude** - AI pair programming assistant
