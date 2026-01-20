/**
 * TypeScript type definitions for the Anthropic Website Clone
 *
 * This file contains interfaces for blog posts, articles, and API request/response bodies.
 */

// =============================================================================
// Blog Post Types (SQLite Database Models)
// =============================================================================

/**
 * Represents a blog post as stored in the SQLite database.
 * The `published` field is stored as 0 or 1 in SQLite but treated as boolean in application code.
 */
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  published: boolean | 0 | 1;
  created_at: string;
  updated_at: string;
}

/**
 * Subset of Post fields returned for listing views (homepage, blog index).
 * Excludes full content and some metadata for efficiency.
 */
export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author?: string;
  created_at: string;
}

// =============================================================================
// Article Section Types (Discriminated Union)
// =============================================================================

/**
 * Base interface for all article section types.
 */
interface ArticleSectionBase {
  type: string;
}

/**
 * A paragraph section containing text content.
 */
export interface ParagraphSection extends ArticleSectionBase {
  type: "paragraph";
  content: string;
}

/**
 * A heading section for section titles.
 */
export interface HeadingSection extends ArticleSectionBase {
  type: "heading";
  heading: string;
}

/**
 * A list section containing bullet points.
 */
export interface ListSection extends ArticleSectionBase {
  type: "list";
  items: string[];
}

/**
 * A quote/blockquote section.
 */
export interface QuoteSection extends ArticleSectionBase {
  type: "quote";
  content: string;
  attribution?: string;
}

/**
 * An image section for embedded images.
 */
export interface ImageSection extends ArticleSectionBase {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

/**
 * A code section for code blocks.
 */
export interface CodeSection extends ArticleSectionBase {
  type: "code";
  code: string;
  language?: string;
}

/**
 * Discriminated union of all possible article section types.
 * Use type narrowing to access type-specific properties.
 *
 * @example
 * function renderSection(section: ArticleSection) {
 *   switch (section.type) {
 *     case 'paragraph':
 *       return section.content; // TypeScript knows this is ParagraphSection
 *     case 'list':
 *       return section.items;   // TypeScript knows this is ListSection
 *   }
 * }
 */
export type ArticleSection =
  | ParagraphSection
  | HeadingSection
  | ListSection
  | QuoteSection
  | ImageSection
  | CodeSection;

// =============================================================================
// Article Types (Rich Content Model)
// =============================================================================

/**
 * Represents a full article with rich content sections.
 * Used for feature articles like product announcements and research posts.
 */
export interface Article {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  excerpt: string;
  author: string;
  authorRole: string;
  heroImage: string;
  heroImageAlt: string;
  readingTimeMinutes: number;
  tags: string[];
  sections: ArticleSection[];
}

/**
 * Subset of Article fields for listing/preview views.
 */
export interface ArticleSummary {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  excerpt: string;
  heroImage: string;
  readingTimeMinutes: number;
  tags: string[];
}

// =============================================================================
// API Request/Response Types
// =============================================================================

/**
 * Request body for creating a new blog post via POST /api/posts.
 */
export interface CreatePostBody {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  published?: boolean;
}

/**
 * Request body for updating a blog post via PUT /api/posts/:id.
 */
export interface UpdatePostBody {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  published?: boolean;
}

/**
 * Successful API response for post creation.
 */
export interface CreatePostResponse {
  success: true;
  id: number;
}

/**
 * Successful API response for post updates and deletions.
 */
export interface SuccessResponse {
  success: true;
}

/**
 * Error response from API endpoints.
 */
export interface ErrorResponse {
  success: false;
  error: string;
}

/**
 * Union type for API responses that can succeed or fail.
 */
export type ApiResponse<T> = T | ErrorResponse;

// =============================================================================
// Express Request Extensions
// =============================================================================

/**
 * Route parameters for post-related endpoints.
 */
export interface PostParams {
  id: string;
}

/**
 * Route parameters for blog post by slug.
 */
export interface SlugParams {
  slug: string;
}

/**
 * Route parameters for article endpoints.
 */
export interface ArticleParams {
  id: string;
}

// =============================================================================
// View Data Types (EJS Template Context)
// =============================================================================

/**
 * Data passed to the homepage template.
 */
export interface IndexViewData {
  posts: PostSummary[];
}

/**
 * Data passed to the blog listing template.
 */
export interface BlogViewData {
  posts: PostSummary[];
}

/**
 * Data passed to the single post template.
 */
export interface PostViewData {
  post: Post;
}

/**
 * Data passed to the article template.
 */
export interface ArticleViewData {
  article: Article;
}

/**
 * Data passed to the admin dashboard template.
 */
export interface AdminDashboardViewData {
  posts: Post[];
}

/**
 * Data passed to the post editor template.
 */
export interface EditorViewData {
  post: Post | null;
}
