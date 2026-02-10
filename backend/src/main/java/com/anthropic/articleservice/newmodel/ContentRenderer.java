package com.anthropic.articleservice.model.newmodel;

import java.util.stream.Collectors;

/**
 * Renders Content blocks to plain text summaries using Java 21
 * pattern matching for switch on sealed types (JEP 441).
 */
public final class ContentRenderer {

    private ContentRenderer() {}

    /**
     * Extracts a plain text summary from a Content block using
     * exhaustive pattern matching switch on the sealed Content interface.
     */
    public static String toPlainText(Content content) {
        return switch (content) {
            case Content.RichText rt -> rt.text();
            case Content.Heading h -> h.text();
            case Content.ContentList cl -> cl.items().stream()
                .flatMap(item -> item.content().stream())
                .map(ContentRenderer::toPlainText)
                .collect(Collectors.joining(", "));
            case Content.Media m -> m.alt() != null ? m.alt() : "";
            case Content.CodeBlock cb -> cb.code();
            case Content.Quote q -> q.content().stream()
                .map(ContentRenderer::toPlainText)
                .collect(Collectors.joining(" "));
            case Content.Callout c -> c.content().stream()
                .map(ContentRenderer::toPlainText)
                .collect(Collectors.joining(" "));
            case Content.Table t -> t.headers().stream()
                .collect(Collectors.joining(" | "));
            case Content.Accordion a -> a.summary();
            case Content.Divider d -> "";
            case Content.Embed e -> e.url() != null ? e.url() : "";
            case Content.Columns cols -> cols.columns().stream()
                .flatMap(col -> col.content().stream())
                .map(ContentRenderer::toPlainText)
                .collect(Collectors.joining(" "));
            case Content.FootnoteRef fn -> fn.content().stream()
                .map(ContentRenderer::toPlainText)
                .collect(Collectors.joining(" "));
        };
    }
}
