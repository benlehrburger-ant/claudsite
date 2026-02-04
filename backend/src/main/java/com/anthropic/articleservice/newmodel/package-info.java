/**
 * Next-generation article model (V2) with significant improvements:
 *
 * <h2>Key Improvements over V1</h2>
 *
 * <h3>1. Sealed Content Types</h3>
 * <p>Uses Java 21 sealed interfaces for exhaustive pattern matching.
 * The compiler ensures all content types are handled in switch expressions.</p>
 *
 * <h3>2. Rich Content Blocks</h3>
 * <ul>
 *   <li>{@link Content.RichText} - Inline formatting with ranges (bold, italic, links)</li>
 *   <li>{@link Content.CodeBlock} - Syntax highlighting, line numbers, annotations</li>
 *   <li>{@link Content.Callout} - Notes, tips, warnings with semantic meaning</li>
 *   <li>{@link Content.Table} - Structured data with alignment</li>
 *   <li>{@link Content.Accordion} - Collapsible sections</li>
 *   <li>{@link Content.Embed} - YouTube, Twitter, GitHub Gists</li>
 *   <li>{@link Content.Columns} - Multi-column layouts</li>
 *   <li>{@link Content.FootnoteRef} - Academic-style footnotes</li>
 * </ul>
 *
 * <h3>3. Comprehensive Media Handling</h3>
 * <ul>
 *   <li>Responsive image variants (2x, webp, avif)</li>
 *   <li>Focal point for smart cropping</li>
 *   <li>BlurHash placeholders for loading states</li>
 *   <li>Separate OG and Twitter images for social sharing</li>
 * </ul>
 *
 * <h3>4. Hierarchical Taxonomy</h3>
 * <ul>
 *   <li>Categories, tags, series, topics</li>
 *   <li>Parent-child relationships</li>
 *   <li>Color and icon support for UI</li>
 * </ul>
 *
 * <h3>5. Rich Authorship</h3>
 * <ul>
 *   <li>Multiple authors and contributors</li>
 *   <li>Social links and bios</li>
 *   <li>Team affiliations</li>
 * </ul>
 *
 * <h3>6. Publishing Workflow</h3>
 * <ul>
 *   <li>Draft, review, scheduled, published, archived states</li>
 *   <li>Public, unlisted, private, members-only visibility</li>
 *   <li>Featured and pinned flags</li>
 *   <li>Expiration dates</li>
 *   <li>Password protection</li>
 * </ul>
 *
 * <h3>7. Localization</h3>
 * <ul>
 *   <li>Locale field for language</li>
 *   <li>Translation mapping to other article IDs</li>
 * </ul>
 *
 * <h3>8. SEO & Social</h3>
 * <ul>
 *   <li>Separate meta description from excerpt</li>
 *   <li>Keywords list</li>
 *   <li>Auto-generated table of contents</li>
 *   <li>Platform-specific share images</li>
 * </ul>
 *
 * <h3>9. Related Content</h3>
 * <ul>
 *   <li>Related articles with relationship types</li>
 *   <li>Series navigation (prev/next)</li>
 *   <li>External links (papers, code repos, demos)</li>
 * </ul>
 *
 * <h3>10. Analytics Integration</h3>
 * <ul>
 *   <li>View counts and unique visitors</li>
 *   <li>Average read time and scroll depth</li>
 *   <li>Share and bookmark counts</li>
 * </ul>
 *
 * <h2>Migration Path</h2>
 * <p>To migrate from V1:</p>
 * <ol>
 *   <li>Create a {@code ArticleMigrator} service</li>
 *   <li>Map V1 sections to sealed Content types</li>
 *   <li>Extract author info into Author records</li>
 *   <li>Convert category/tags to Taxonomy objects</li>
 *   <li>Wrap hero image in ArticleMedia</li>
 * </ol>
 *
 * @see ArticleV2
 * @see Content
 * @see Author
 * @see Taxonomy
 * @see ArticleMedia
 */
package com.anthropic.articleservice.newmodel;
