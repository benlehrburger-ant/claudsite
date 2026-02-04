package com.anthropic.articleservice.newmodel;

import java.util.Map;

/**
 * Comprehensive media asset with responsive variants and metadata.
 */
public record ArticleMedia(
    String id,
    MediaType type,
    String primaryUrl,
    String alt,
    String caption,
    String attribution,
    Dimensions dimensions,
    Map<String, Variant> variants,
    FocalPoint focalPoint,
    String blurHash  // Placeholder blur hash for loading
) {
    public enum MediaType {
        IMAGE, VIDEO, AUDIO, DOCUMENT, INTERACTIVE
    }

    public record Dimensions(int width, int height) {
        public double aspectRatio() {
            return (double) width / height;
        }
    }

    public record Variant(
        String url,
        int width,
        int height,
        String format  // webp, avif, jpg, etc.
    ) {}

    public record FocalPoint(double x, double y) {
        public static final FocalPoint CENTER = new FocalPoint(0.5, 0.5);
    }

    // Builder pattern for complex media
    public static Builder builder() {
        return new Builder();
    }

    public static ArticleMedia simpleImage(String url, String alt) {
        return new ArticleMedia(
            null, MediaType.IMAGE, url, alt, null, null,
            null, Map.of(), FocalPoint.CENTER, null
        );
    }

    public static class Builder {
        private String id;
        private MediaType type = MediaType.IMAGE;
        private String primaryUrl;
        private String alt;
        private String caption;
        private String attribution;
        private Dimensions dimensions;
        private Map<String, Variant> variants = Map.of();
        private FocalPoint focalPoint = FocalPoint.CENTER;
        private String blurHash;

        public Builder id(String id) { this.id = id; return this; }
        public Builder type(MediaType type) { this.type = type; return this; }
        public Builder url(String url) { this.primaryUrl = url; return this; }
        public Builder alt(String alt) { this.alt = alt; return this; }
        public Builder caption(String caption) { this.caption = caption; return this; }
        public Builder attribution(String attribution) { this.attribution = attribution; return this; }
        public Builder dimensions(int width, int height) {
            this.dimensions = new Dimensions(width, height);
            return this;
        }
        public Builder variants(Map<String, Variant> variants) { this.variants = variants; return this; }
        public Builder focalPoint(double x, double y) {
            this.focalPoint = new FocalPoint(x, y);
            return this;
        }
        public Builder blurHash(String blurHash) { this.blurHash = blurHash; return this; }

        public ArticleMedia build() {
            return new ArticleMedia(id, type, primaryUrl, alt, caption, attribution,
                dimensions, variants, focalPoint, blurHash);
        }
    }
}
