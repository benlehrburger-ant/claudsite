# Anthropic Website Clone

A full-stack clone of the Anthropic website featuring a blog CMS, article service, and modern web technologies.

## Overview

This project is a comprehensive recreation of the Anthropic website, built with a Node.js/Express frontend and an optional Java/Spring Boot backend for article management. It includes a complete blog system with admin capabilities and a dual-service architecture.

## Architecture

### Frontend (Node.js/Express)

- **Server**: Express.js on port 3000
- **Template Engine**: EJS
- **Database**: SQLite (better-sqlite3)
- **Static Assets**: Organized in `public/` directory

### Backend (Java/Spring Boot)

- **Framework**: Spring Boot 3.2.0
- **Java Version**: Java 21 (upgraded from Java 17)
- **Port**: 8080
- **Purpose**: Article service API with fallback support

## Features

- **Blog System**: Full CRUD operations for blog posts
- **Admin Dashboard**: Manage posts, create, edit, and delete content
- **Article Service**: Dual-service architecture with automatic fallback
- **Responsive Design**: Mobile-friendly interface
- **Database Management**: SQLite for lightweight data persistence
- **TypeScript Migration**: Ongoing frontend migration for improved type safety

## Project Structure

```
.
├── backend/                  # Java/Spring Boot article service
│   └── src/main/java/com/anthropic/articleservice/
│       ├── controller/       # REST endpoints
│       ├── model/           # V1 article models
│       ├── newmodel/        # V2 article models (enhanced)
│       └── repository/      # Data access layer
├── public/                  # Static assets (CSS, images, JS)
├── views/                   # EJS templates
├── server.js               # Main Express server
├── blog.db                 # SQLite database
└── package.json            # Node.js dependencies
```

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

## API Endpoints

### Public Routes

- `GET /` - Homepage (displays 3 latest published posts)
- `GET /blog` - Blog listing page
- `GET /blog/:slug` - Individual blog post
- `GET /articles/:id` - Article pages (Java backend with Node.js fallback)

### Admin Routes

- `GET /admin` - Admin dashboard (all posts)
- `GET /admin/posts/new` - Create new post
- `GET /admin/posts/:id/edit` - Edit existing post

### REST API

- `GET /api/posts` - List all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/articles` - List articles (Node fallback)
- `GET /api/articles/:id` - Get article by ID (Node fallback)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Java 21 (for backend service)
- Maven (for Java backend)

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

The frontend will start on `http://localhost:3000`

### Backend Setup (Optional)

```bash
# Navigate to backend directory
cd backend

# Run Spring Boot application
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

## Testing

The project uses Jest with Supertest for integration testing.

**Run tests:**

```bash
npm test
```

**Current test coverage includes:**

- Homepage rendering and content verification
- HTTP status codes and headers
- Navigation elements
- Hero section content
- Footer information

Tests are configured to run in a Node environment with `--no-webstorage` flag.

## Article Fallback Pattern

The system implements a resilient fallback pattern:

1. Attempts to fetch articles from Java backend (`http://localhost:8080/api/articles/:id`)
2. Falls back to hardcoded article data in Node.js if backend is unavailable
3. Ensures continuous service even during backend maintenance

## Java Backend Models

### V1 Article Model

Basic article structure with essential fields.

### V2 Article Model (Enhanced)

The `newmodel` package provides advanced features:

- **ArticleV2**: Rich article record with versioning
- **Author**: Author information and metadata
- **Content**: Structured content management
- **Taxonomy**: Categorization and tagging
- **ArticleMedia**: Media asset handling
- **Additional features**: Localization, SEO metadata, engagement tracking, series organization

## Ongoing Development

### Active Projects

- **TypeScript Migration**: Gradual migration of frontend JavaScript to TypeScript
- **Java 21 Upgrade**: Backend upgrade to leverage modern Java features
- **Enhanced Testing**: Expanding test coverage across components

## Contributing

This project is a collaboration between:

- **benlehrburger-ant** - Human developer
- **Claude** - AI pair programming assistant

## License

This is a clone project for educational and demonstration purposes.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
