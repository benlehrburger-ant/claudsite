# Views Directory

EJS templates for the Anthropic website clone frontend. All templates use the shared stylesheet at `/css/styles.css` and client-side JavaScript at `/js/main.js`.

## Template Structure

### Public Pages

#### `index.ejs` - Homepage

The main landing page with four sections:

- **Hero**: Tagline "AI research and products that put safety at the frontier" with CTA buttons
- **Latest Updates**: 3-card grid showcasing featured content (hardcoded cards, not dynamic from DB)
- **Our Approach**: Value cards with reveal animations (Core Views, Responsible Scaling, Academy)
- **CTA Banner**: Careers recruitment section

**Key nuance**: The Latest Updates section is currently hardcoded HTML, not dynamically populated from the database like the blog listing.

#### `blog.ejs` - Blog Listing

Displays all published posts from the database in a responsive grid.

**Expected data**: `posts` array from server with fields: `slug`, `category`, `title`, `excerpt`, `author`, `created_at`

**Empty state**: Shows "No posts yet. Check back soon!" message when `posts.length === 0`

**Date formatting**: Uses `toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`

#### `post.ejs` - Single Blog Post

Renders individual blog posts from the SQLite database.

**Expected data**: `post` object with fields: `category`, `created_at`, `title`, `content`

**Content rendering**: Uses `<%- post.content %>` (unescaped) to render HTML content directly. Be aware this could be an XSS vector if content isn't sanitized before storage.

#### `article.ejs` - Article Page (Hybrid Rendering)

Complex template supporting both server-side and client-side rendering for articles from the Java backend.

**Two rendering modes**:

1. **Server-side** (when `article` object exists): Renders rich article data including subtitle, author info, tags, hero image, and structured sections
2. **Client-side fallback** (when `article` is undefined): Shows loading state and fetches from `http://localhost:8080/api/articles/${articleId}` via JavaScript

**Section types supported**:

- `heading` → `<h2>`
- `paragraph` → `<p>`
- `list` → `<ul>` with `<li>` items
- `quote` → `<blockquote>`
- `image` → `<figure>` with optional caption
- `code` → `<pre><code>` with language class

**Key nuance**: The client-side fallback only renders `heading`, `paragraph`, and `list` sections - it lacks support for `quote`, `image`, and `code` sections.

#### `404.ejs` - Error Page

Minimal error page with centered layout. Uses `.error-page` container class.

### Admin Pages (`admin/`)

#### `admin/dashboard.ejs` - Posts Dashboard

Lists all blog posts (published and drafts) in a table.

**Expected data**: `posts` array with fields: `id`, `title`, `slug`, `category`, `published`, `created_at`

**Features**:

- Status badges with conditional styling (`.published` vs `.draft` classes)
- Inline delete with confirmation dialog
- Links to edit each post
- Empty state with create prompt

**JavaScript functions**:

- `deletePost(id, title)`: Async delete with confirmation, calls `DELETE /api/posts/:id`

#### `admin/editor.ejs` - Post Editor

Create/edit form for blog posts. Supports both new posts and editing existing ones.

**Expected data**: `post` object (optional, null for new posts)

**Form fields**:

- `title` (required)
- `slug` (required, auto-generated from title for new posts)
- `category` (select: News, Research, Product, Safety, Company)
- `excerpt` (optional)
- `content` (required, accepts raw HTML)
- `published` (checkbox)

**JavaScript behavior**:

- Auto-generates slug from title using `generateSlug()` (from main.js)
- Form submission via `fetch()` to REST API
- Creates via `POST /api/posts`, updates via `PUT /api/posts/:id`
- Toast notifications via `showToast()` (from main.js)

## Shared Components

### Header Navigation

Duplicated across all public pages. Contains:

- Logo linking to `/`
- Dropdown menus for Research and Commitments
- Direct links to Learn, News (`/blog`), Careers
- "Try Claude" CTA button
- Mobile menu toggle (`.menu-toggle`)

**Dropdown structure**: Uses `.nav-item` > `.nav-link` + `.dropdown` pattern

### Footer

Duplicated across all public pages. Four-column grid:

- Products: Claude, Enterprise, API, Pricing
- Developers: Documentation, API Reference, Examples, Status
- Company: About, Research, Careers, News
- Legal: Terms, Privacy, Acceptable Use, Security

Social links: LinkedIn, X (Twitter), YouTube

## CSS Classes Reference

| Class                                        | Usage                              |
| -------------------------------------------- | ---------------------------------- |
| `.container`                                 | Max-width wrapper for content      |
| `.section`                                   | Vertical padding for page sections |
| `.hero`                                      | Homepage hero section              |
| `.card`, `.cards-grid`                       | Card components and grid layout    |
| `.blog-grid`                                 | Blog listing grid                  |
| `.post-header`, `.post-content`              | Single post layout                 |
| `.admin-header`, `.admin-container`          | Admin layout components            |
| `.form-group`, `.form-input`, `.form-select` | Form elements                      |
| `.btn`, `.btn-primary`, `.btn-outline`       | Button styles                      |
| `.status-badge`                              | Post status indicators             |

## JavaScript Dependencies

All templates include `/js/main.js` which provides:

- `generateSlug(text)`: Converts text to URL-friendly slug
- `showToast(message, type)`: Toast notification system
- Mobile menu toggle functionality
- Reveal animations for value cards
