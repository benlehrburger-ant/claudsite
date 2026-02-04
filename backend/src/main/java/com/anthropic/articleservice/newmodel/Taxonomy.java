package com.anthropic.articleservice.newmodel;

import java.util.List;

/**
 * Hierarchical taxonomy system for categorization.
 */
public record Taxonomy(
    String id,
    String name,
    String slug,
    TaxonomyType type,
    String parentId,
    String description,
    String color,
    String iconUrl
) {
    public enum TaxonomyType {
        CATEGORY,   // Primary classification (Research, Product, Engineering)
        TAG,        // Secondary labels (AI, Safety, Claude)
        SERIES,     // Multi-part content series
        TOPIC       // Broad topic areas
    }

    public static Taxonomy category(String name) {
        return new Taxonomy(
            slugify(name),
            name,
            slugify(name),
            TaxonomyType.CATEGORY,
            null,
            null,
            null,
            null
        );
    }

    public static Taxonomy tag(String name) {
        return new Taxonomy(
            slugify(name),
            name,
            slugify(name),
            TaxonomyType.TAG,
            null,
            null,
            null,
            null
        );
    }

    public static Taxonomy series(String name, String description) {
        return new Taxonomy(
            slugify(name),
            name,
            slugify(name),
            TaxonomyType.SERIES,
            null,
            description,
            null,
            null
        );
    }

    private static String slugify(String text) {
        return text.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-");
    }
}
