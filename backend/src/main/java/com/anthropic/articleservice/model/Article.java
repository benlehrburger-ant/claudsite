package com.anthropic.articleservice.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;

import java.util.List;

public record Article(
    String id,
    String title,
    String subtitle,
    String date,
    String category,
    String excerpt,
    String author,
    String authorRole,
    String heroImage,
    String heroImageAlt,
    int readingTimeMinutes,
    List<String> tags,
    List<Section> sections
) {
    /**
     * Sealed interface for article sections, leveraging Java 21 pattern matching
     * in switch expressions for exhaustive, type-safe content handling.
     *
     * <p>Replaces the previous flat record with a tagged-union approach using
     * sealed types. Jackson serialization preserves the "type" discriminator
     * field for frontend compatibility.</p>
     */
    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
    @JsonSubTypes({
        @JsonSubTypes.Type(value = Section.Paragraph.class, name = "paragraph"),
        @JsonSubTypes.Type(value = Section.SectionHeading.class, name = "heading"),
        @JsonSubTypes.Type(value = Section.ItemList.class, name = "list"),
        @JsonSubTypes.Type(value = Section.Image.class, name = "image"),
        @JsonSubTypes.Type(value = Section.Code.class, name = "code"),
        @JsonSubTypes.Type(value = Section.Quote.class, name = "quote")
    })
    public sealed interface Section {

        @JsonTypeName("paragraph")
        record Paragraph(String content) implements Section {}

        @JsonTypeName("heading")
        record SectionHeading(String heading) implements Section {}

        @JsonTypeName("list")
        record ItemList(List<String> items) implements Section {}

        @JsonTypeName("image")
        record Image(String imageUrl, String imageAlt, String imageCaption) implements Section {}

        @JsonTypeName("code")
        record Code(String codeLanguage, String codeSnippet) implements Section {}

        @JsonTypeName("quote")
        record Quote(String content) implements Section {}

        // Factory methods for backwards compatibility
        static Section paragraph(String content) {
            return new Paragraph(content);
        }

        static Section heading(String heading) {
            return new SectionHeading(heading);
        }

        static Section list(List<String> items) {
            return new ItemList(items);
        }

        static Section image(String imageUrl, String imageAlt, String imageCaption) {
            return new Image(imageUrl, imageAlt, imageCaption);
        }

        static Section code(String codeLanguage, String codeSnippet) {
            return new Code(codeLanguage, codeSnippet);
        }

        static Section quote(String content) {
            return new Quote(content);
        }

        /**
         * Returns the section type string.
         * Uses Java 21 exhaustive pattern matching for switch (JEP 441).
         */
        default String type() {
            return switch (this) {
                case Paragraph p -> "paragraph";
                case SectionHeading sh -> "heading";
                case ItemList il -> "list";
                case Image im -> "image";
                case Code c -> "code";
                case Quote q -> "quote";
            };
        }
    }
}
