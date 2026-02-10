# Backend Directory

Spring Boot 3.2.0 article service providing REST APIs for the Anthropic website clone. Runs on port 8080.

## Quick Start

```bash
./mvnw spring-boot:run
```

## Architecture Overview

```
src/main/java/com/anthropic/articleservice/
├── ArticleServiceApplication.java   # Entry point
├── controller/
│   └── ArticleController.java        # REST endpoints
├── model/
│   └── Article.java                  # V1 article model (in use)
├── newmodel/                         # V2 article system (not yet integrated)
│   ├── ArticleV2.java
│   ├── Author.java
│   ├── Content.java
│   ├── Taxonomy.java
│   ├── ArticleMedia.java
│   └── package-info.java
└── repository/
    └── ArticleRepository.java        # In-memory data store
```

## API Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/articles`      | List all articles |
| GET    | `/api/articles/{id}` | Get article by ID |

**CORS**: Enabled for all origins (`@CrossOrigin(origins = "*")`)

## Article Model (V1) - Currently Active

Uses Java records with nested `Section` type. Articles are identified by string ID (e.g., `claude-opus-4-6`).

### Article Fields

- `id`, `title`, `subtitle`, `date`, `category`, `excerpt`
- `author`, `authorRole`
- `heroImage`, `heroImageAlt`
- `readingTimeMinutes`
- `tags` (List<String>)
- `sections` (List<Section>)

### Section Types

Static factory methods for creating sections:

- `Section.paragraph(content)` → paragraph block
- `Section.heading(heading)` → h2 heading
- `Section.list(items)` → bulleted list
- `Section.image(url, alt, caption)` → figure with caption
- `Section.code(language, snippet)` → code block
- `Section.quote(content)` → blockquote

**Key nuance**: The `Section` record has 9 fields, but most are null—use the static factory methods rather than the constructor directly to avoid errors.

## ArticleRepository

**In-memory storage** using `HashMap<String, Article>`. No database—articles are hardcoded in `initializeArticles()`.

### Current Articles

| ID                          | Title                        | Category    |
| --------------------------- | ---------------------------- | ----------- |
| `claude-opus-4-6`           | Claude Opus 4.6              | Product     |
| `economic-index`            | The Anthropic Economic Index | Research    |
| `building-effective-agents` | Building Effective Agents    | Engineering |

**To add articles**: Modify `ArticleRepository.initializeArticles()` and add a new `articles.put(...)` call.

## Article Model V2 (newmodel/) - Not Yet Integrated

A comprehensive next-gen model with significant improvements. Located in `newmodel/` but **not wired into the controller**.

### Key V2 Features

1. **Sealed Content Interface** (`Content.java`)
   - Uses Java 17 sealed types for exhaustive pattern matching
   - 12 content block types: `RichText`, `Heading`, `ContentList`, `Media`, `CodeBlock`, `Quote`, `Callout`, `Table`, `Accordion`, `Divider`, `Embed`, `Columns`, `FootnoteRef`
   - Inline formatting support with character ranges

2. **Rich Authorship** (`Author.java`)
   - Multiple authors and contributors
   - Social links (Twitter, LinkedIn, GitHub, Website, Email)
   - Team affiliations and bios

3. **Hierarchical Taxonomy** (`Taxonomy.java`)
   - Four types: `CATEGORY`, `TAG`, `SERIES`, `TOPIC`
   - Parent-child relationships
   - Color and icon support for UI

4. **Comprehensive Media** (`ArticleMedia.java`)
   - Responsive variants (2x, webp, avif)
   - Focal points for smart cropping
   - BlurHash placeholders
   - Separate OG/Twitter images

5. **ArticleV2 Features**
   - Version tracking
   - Publishing workflow: `DRAFT` → `REVIEW` → `SCHEDULED` → `PUBLISHED` → `ARCHIVED`
   - Visibility: `PUBLIC`, `UNLISTED`, `PRIVATE`, `MEMBERS_ONLY`
   - Featured/pinned flags
   - Localization with translation mapping
   - Engagement analytics (views, scroll depth, read time)
   - Related articles with relationship types
   - Auto-generated table of contents

### Migration Path (V1 → V2)

The `package-info.java` documents the migration strategy:

1. Create an `ArticleMigrator` service
2. Map V1 sections to sealed `Content` types
3. Extract author info into `Author` records
4. Convert category/tags to `Taxonomy` objects
5. Wrap hero image in `ArticleMedia`

**Note**: The newmodel package has incorrect package declaration (`com.anthropic.articleservice.model.newmodel` instead of `com.anthropic.articleservice.newmodel`). This needs fixing before use.

## Frontend Integration

The Node.js frontend at `http://localhost:3000` consumes this API:

1. **Server-side**: Fetches articles and passes to EJS templates
2. **Client-side fallback**: If server-side fails, `article.ejs` fetches directly via JavaScript

**Fallback behavior**: If the Java backend is down, the Node.js server serves hardcoded article data.

## Dependencies

Minimal setup—only `spring-boot-starter-web`:

- Spring MVC for REST endpoints
- Embedded Tomcat
- Jackson for JSON serialization

## Build

```bash
./mvnw clean package           # Build JAR
./mvnw spring-boot:run         # Run dev server
./mvnw dependency:tree         # View dependencies
```

Output JAR: `target/article-service-1.0.0.jar`

## Java Version

Currently using **Java 17** (specified in `pom.xml`). An ongoing project is upgrading to Java 21.

## Known Limitations

1. **No persistence**: All data is in-memory; restarting loses any runtime changes
2. **No validation**: Input validation not implemented on endpoints
3. **No tests**: Test directory exists but no test files
4. **V2 not integrated**: The newmodel package is complete but not exposed via API
5. **Package mismatch**: V2 models have incorrect package declarations
