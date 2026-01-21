// Database Models

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

export interface PostPreview {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author: string;
  created_at: string;
}

export interface CountResult {
  count: number;
}

// Article Section Types (discriminated union)

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

// Article Types

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

export interface ArticlesMap {
  [key: string]: Article;
}

// API Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  id?: number | bigint;
}

export interface CreatePostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  published?: boolean;
}

export interface UpdatePostPayload extends CreatePostPayload {}

// Route Parameter Types

export interface SlugParams {
  slug: string;
}

export interface IdParams {
  id: string;
}
