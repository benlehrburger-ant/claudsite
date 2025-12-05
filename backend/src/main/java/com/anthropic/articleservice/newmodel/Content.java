package com.anthropic.articleservice.model.newmodel;

import java.util.List;
import java.util.Map;

/**
 * Sealed interface representing all content block types.
 * Uses sealed types for exhaustive pattern matching in switch expressions.
 */
public sealed interface Content {

    /**
     * Rich text with inline formatting support.
     */
    record RichText(
        String text,
        List<InlineFormat> formats
    ) implements Content {

        public record InlineFormat(
            int start,
            int end,
            FormatType type,
            String value  // URL for links, language for code, etc.
        ) {}

        public enum FormatType {
            BOLD, ITALIC, CODE, LINK, STRIKETHROUGH, HIGHLIGHT
        }

        public static RichText plain(String text) {
            return new RichText(text, List.of());
        }
    }

    /**
     * Heading with semantic level and optional anchor ID.
     */
    record Heading(
        String text,
        int level,  // 1-6
        String anchorId
    ) implements Content {

        public static Heading h1(String text) {
            return new Heading(text, 1, slugify(text));
        }

        public static Heading h2(String text) {
            return new Heading(text, 2, slugify(text));
        }

        public static Heading h3(String text) {
            return new Heading(text, 3, slugify(text));
        }

        private static String slugify(String text) {
            return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        }
    }

    /**
     * List supporting ordered, unordered, and nested items.
     */
    record ContentList(
        ListType type,
        List<ListItem> items
    ) implements Content {

        public enum ListType { ORDERED, UNORDERED, CHECKLIST }

        public record ListItem(
            List<Content> content,  // Allows rich text and nested lists
            Boolean checked         // For checklists
        ) {
            public static ListItem of(String text) {
                return new ListItem(List.of(RichText.plain(text)), null);
            }

            public static ListItem checked(String text, boolean checked) {
                return new ListItem(List.of(RichText.plain(text)), checked);
            }
        }

        public static ContentList unordered(List<String> items) {
            return new ContentList(
                ListType.UNORDERED,
                items.stream().map(ListItem::of).toList()
            );
        }

        public static ContentList ordered(List<String> items) {
            return new ContentList(
                ListType.ORDERED,
                items.stream().map(ListItem::of).toList()
            );
        }
    }

    /**
     * Media with responsive variants and accessibility.
     */
    record Media(
        MediaType type,
        String src,
        String alt,
        String caption,
        Map<String, String> variants,  // e.g., {"2x": "/img@2x.png", "webp": "/img.webp"}
        Dimensions dimensions,
        String attribution
    ) implements Content {

        public enum MediaType { IMAGE, VIDEO, AUDIO, EMBED }

        public record Dimensions(int width, int height) {}

        public static Media image(String src, String alt) {
            return new Media(MediaType.IMAGE, src, alt, null, Map.of(), null, null);
        }

        public static Media imageWithCaption(String src, String alt, String caption) {
            return new Media(MediaType.IMAGE, src, alt, caption, Map.of(), null, null);
        }
    }

    /**
     * Code block with syntax highlighting and optional metadata.
     */
    record CodeBlock(
        String code,
        String language,
        String filename,
        List<HighlightRange> highlights,
        boolean showLineNumbers,
        String caption
    ) implements Content {

        public record HighlightRange(int startLine, int endLine, String annotation) {}

        public static CodeBlock of(String language, String code) {
            return new CodeBlock(code, language, null, List.of(), true, null);
        }

        public static CodeBlock withFile(String language, String code, String filename) {
            return new CodeBlock(code, language, filename, List.of(), true, null);
        }
    }

    /**
     * Blockquote with optional citation.
     */
    record Quote(
        List<Content> content,
        String citation,
        String citationUrl
    ) implements Content {

        public static Quote of(String text) {
            return new Quote(List.of(RichText.plain(text)), null, null);
        }

        public static Quote withCitation(String text, String citation) {
            return new Quote(List.of(RichText.plain(text)), citation, null);
        }
    }

    /**
     * Callout/admonition blocks for tips, warnings, notes.
     */
    record Callout(
        CalloutType type,
        String title,
        List<Content> content
    ) implements Content {

        public enum CalloutType { NOTE, TIP, WARNING, DANGER, INFO }

        public static Callout note(String text) {
            return new Callout(CalloutType.NOTE, null, List.of(RichText.plain(text)));
        }

        public static Callout warning(String title, String text) {
            return new Callout(CalloutType.WARNING, title, List.of(RichText.plain(text)));
        }
    }

    /**
     * Table with headers and alignment.
     */
    record Table(
        List<String> headers,
        List<List<Content>> rows,
        List<Alignment> alignments,
        String caption
    ) implements Content {

        public enum Alignment { LEFT, CENTER, RIGHT }
    }

    /**
     * Expandable/collapsible section.
     */
    record Accordion(
        String summary,
        List<Content> content,
        boolean defaultOpen
    ) implements Content {}

    /**
     * Horizontal divider/separator.
     */
    record Divider() implements Content {
        public static final Divider INSTANCE = new Divider();
    }

    /**
     * Embedded content (tweets, YouTube, etc.).
     */
    record Embed(
        EmbedType type,
        String url,
        String embedId,
        Map<String, String> metadata
    ) implements Content {

        public enum EmbedType { YOUTUBE, TWITTER, GITHUB_GIST, CODEPEN, FIGMA, CUSTOM }

        public static Embed youtube(String videoId) {
            return new Embed(EmbedType.YOUTUBE, null, videoId, Map.of());
        }
    }

    /**
     * Group of content displayed in columns.
     */
    record Columns(
        List<Column> columns
    ) implements Content {

        public record Column(
            List<Content> content,
            int span  // 1-12 grid units
        ) {}
    }

    /**
     * Footnote reference (rendered at end of article).
     */
    record FootnoteRef(
        String id,
        List<Content> content
    ) implements Content {}
}
