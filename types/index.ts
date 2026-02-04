// Database Post type (matches SQLite schema)
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  published: number; // SQLite boolean (0 or 1)
  created_at: string;
  updated_at: string;
}

// Post listing (subset of fields)
export interface PostListing {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author?: string;
  created_at: string;
}

// API request body for creating/updating posts
export interface PostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  published?: boolean;
}

// API response types
export interface ApiSuccessResponse {
  success: true;
  id?: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Article section types
export interface ParagraphSection {
  type: "paragraph";
  content: string;
}

export interface HeadingSection {
  type: "heading";
  heading: string;
}

export interface ListSection {
  type: "list";
  items: string[];
}

export interface QuoteSection {
  type: "quote";
  content: string;
}

export type ArticleSection =
  | ParagraphSection
  | HeadingSection
  | ListSection
  | QuoteSection;

// Article type (for hardcoded articles)
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

// Articles dictionary type
export type ArticlesMap = Record<string, Article>;
