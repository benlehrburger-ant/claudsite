package com.anthropic.articleservice.model;

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
    public record Section(
        String type,
        String heading,
        String content,
        List<String> items,
        String imageUrl,
        String imageAlt,
        String imageCaption,
        String codeLanguage,
        String codeSnippet
    ) {
        // Convenience constructors for common section types
        public static Section paragraph(String content) {
            return new Section("paragraph", null, content, null, null, null, null, null, null);
        }

        public static Section heading(String heading) {
            return new Section("heading", heading, null, null, null, null, null, null, null);
        }

        public static Section list(List<String> items) {
            return new Section("list", null, null, items, null, null, null, null, null);
        }

        public static Section image(String imageUrl, String imageAlt, String imageCaption) {
            return new Section("image", null, null, null, imageUrl, imageAlt, imageCaption, null, null);
        }

        public static Section code(String codeLanguage, String codeSnippet) {
            return new Section("code", null, null, null, null, null, null, codeLanguage, codeSnippet);
        }

        public static Section quote(String content) {
            return new Section("quote", null, content, null, null, null, null, null, null);
        }
    }
}
