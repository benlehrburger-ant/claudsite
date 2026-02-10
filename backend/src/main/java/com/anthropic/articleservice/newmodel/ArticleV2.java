package com.anthropic.articleservice.model.newmodel;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Next-generation article model with comprehensive metadata,
 * versioning, localization, and SEO support.
 */
public record ArticleV2(
    // Identity
    String id,
    String slug,
    int version,

    // Content
    String title,
    String subtitle,
    List<Content> body,

    // Metadata
    Metadata metadata,

    // Taxonomy
    Taxonomy category,
    List<Taxonomy> tags,
    Taxonomy series,
    Integer seriesOrder,

    // Authorship
    List<Author> authors,
    List<Author> contributors,

    // Media
    ArticleMedia heroImage,
    ArticleMedia ogImage,       // Open Graph specific
    ArticleMedia twitterImage,  // Twitter Card specific
    List<ArticleMedia> gallery,

    // Timestamps
    Timestamps timestamps,

    // Status & Publishing
    PublishingInfo publishing,

    // Related content
    List<RelatedArticle> relatedArticles,
    List<ExternalLink> externalLinks,

    // Localization
    String locale,
    Map<String, String> translations,  // locale -> articleId

    // Analytics & Engagement
    EngagementData engagement
) {
    /**
     * Article metadata for display and organization.
     */
    public record Metadata(
        String excerpt,
        String description,      // SEO meta description
        int readingTimeMinutes,
        int wordCount,
        Difficulty difficulty,
        List<String> keywords,   // SEO keywords
        TableOfContents toc
    ) {
        public enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED, EXPERT }

        public static Metadata simple(String excerpt, int readingTime) {
            return new Metadata(excerpt, excerpt, readingTime, 0, null, List.of(), null);
        }
    }

    /**
     * Auto-generated table of contents.
     */
    public record TableOfContents(
        List<TocEntry> entries
    ) {
        public record TocEntry(
            String text,
            String anchorId,
            int level,
            List<TocEntry> children
        ) {}
    }

    /**
     * Comprehensive timestamp tracking.
     */
    public record Timestamps(
        Instant createdAt,
        Instant updatedAt,
        LocalDate publishedDate,
        LocalDate displayDate,      // What to show users
        Instant lastMajorUpdate,
        Instant scheduledPublishAt
    ) {
        public static Timestamps now() {
            Instant now = Instant.now();
            LocalDate today = LocalDate.now();
            return new Timestamps(now, now, today, today, null, null);
        }
    }

    /**
     * Publishing status and visibility controls.
     */
    public record PublishingInfo(
        Status status,
        Visibility visibility,
        boolean featured,
        boolean pinned,
        LocalDate expiresAt,
        String password           // For password-protected articles
    ) {
        public enum Status { DRAFT, REVIEW, SCHEDULED, PUBLISHED, ARCHIVED }
        public enum Visibility { PUBLIC, UNLISTED, PRIVATE, MEMBERS_ONLY }

        public static PublishingInfo published() {
            return new PublishingInfo(Status.PUBLISHED, Visibility.PUBLIC, false, false, null, null);
        }

        public static PublishingInfo draft() {
            return new PublishingInfo(Status.DRAFT, Visibility.PRIVATE, false, false, null, null);
        }

        public static PublishingInfo featuredPost() {
            return new PublishingInfo(Status.PUBLISHED, Visibility.PUBLIC, true, false, null, null);
        }
    }

    /**
     * Reference to a related article.
     */
    public record RelatedArticle(
        String articleId,
        RelationType type,
        String customTitle  // Override displayed title
    ) {
        public enum RelationType {
            SUGGESTED,      // Algorithm/editor suggested
            NEXT_IN_SERIES,
            PREV_IN_SERIES,
            SEE_ALSO,
            PREREQUISITE,
            FOLLOW_UP
        }
    }

    /**
     * External resource link.
     */
    public record ExternalLink(
        String url,
        String title,
        String description,
        LinkType type
    ) {
        public enum LinkType {
            PAPER, CODE_REPO, DEMO, DOCUMENTATION, DATASET, VIDEO, PODCAST
        }
    }

    /**
     * Engagement and analytics data.
     */
    public record EngagementData(
        long views,
        long uniqueVisitors,
        int shares,
        int bookmarks,
        double avgReadTime,      // In seconds
        double scrollDepth,      // 0-1 average scroll depth
        Instant lastViewed
    ) {
        public static EngagementData empty() {
            return new EngagementData(0, 0, 0, 0, 0, 0, null);
        }
    }

    // Convenience builders

    public static Builder builder() {
        return new Builder();
    }

    public boolean isPublished() {
        return publishing.status() == PublishingInfo.Status.PUBLISHED;
    }

    public boolean isFeatured() {
        return publishing.featured();
    }

    public Optional<Author> primaryAuthor() {
        return authors.isEmpty() ? Optional.empty() : Optional.of(authors.getFirst());
    }

    public static class Builder {
        private String id;
        private String slug;
        private int version = 1;
        private String title;
        private String subtitle;
        private List<Content> body = List.of();
        private Metadata metadata;
        private Taxonomy category;
        private List<Taxonomy> tags = List.of();
        private Taxonomy series;
        private Integer seriesOrder;
        private List<Author> authors = List.of();
        private List<Author> contributors = List.of();
        private ArticleMedia heroImage;
        private ArticleMedia ogImage;
        private ArticleMedia twitterImage;
        private List<ArticleMedia> gallery = List.of();
        private Timestamps timestamps = Timestamps.now();
        private PublishingInfo publishing = PublishingInfo.draft();
        private List<RelatedArticle> relatedArticles = List.of();
        private List<ExternalLink> externalLinks = List.of();
        private String locale = "en";
        private Map<String, String> translations = Map.of();
        private EngagementData engagement = EngagementData.empty();

        public Builder id(String id) { this.id = id; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder version(int version) { this.version = version; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder subtitle(String subtitle) { this.subtitle = subtitle; return this; }
        public Builder body(List<Content> body) { this.body = body; return this; }
        public Builder metadata(Metadata metadata) { this.metadata = metadata; return this; }
        public Builder category(Taxonomy category) { this.category = category; return this; }
        public Builder tags(List<Taxonomy> tags) { this.tags = tags; return this; }
        public Builder series(Taxonomy series, int order) {
            this.series = series;
            this.seriesOrder = order;
            return this;
        }
        public Builder authors(List<Author> authors) { this.authors = authors; return this; }
        public Builder author(Author author) { this.authors = List.of(author); return this; }
        public Builder contributors(List<Author> contributors) { this.contributors = contributors; return this; }
        public Builder heroImage(ArticleMedia heroImage) { this.heroImage = heroImage; return this; }
        public Builder ogImage(ArticleMedia ogImage) { this.ogImage = ogImage; return this; }
        public Builder timestamps(Timestamps timestamps) { this.timestamps = timestamps; return this; }
        public Builder publishing(PublishingInfo publishing) { this.publishing = publishing; return this; }
        public Builder relatedArticles(List<RelatedArticle> related) { this.relatedArticles = related; return this; }
        public Builder externalLinks(List<ExternalLink> links) { this.externalLinks = links; return this; }
        public Builder locale(String locale) { this.locale = locale; return this; }
        public Builder translations(Map<String, String> translations) { this.translations = translations; return this; }

        public ArticleV2 build() {
            if (id == null && slug != null) id = slug;
            if (slug == null && title != null) slug = slugify(title);
            if (id == null) id = slug;

            return new ArticleV2(
                id, slug, version, title, subtitle, body, metadata,
                category, tags, series, seriesOrder,
                authors, contributors,
                heroImage, ogImage, twitterImage, gallery,
                timestamps, publishing,
                relatedArticles, externalLinks,
                locale, translations, engagement
            );
        }

        private String slugify(String text) {
            return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        }
    }
}
