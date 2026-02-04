package com.anthropic.articleservice.newmodel;

import java.util.List;
import java.util.Map;

/**
 * Rich author representation with social links and bio.
 */
public record Author(
    String id,
    String name,
    String slug,
    String role,
    String team,
    String avatarUrl,
    String bio,
    Map<SocialPlatform, String> socialLinks
) {
    public enum SocialPlatform {
        TWITTER, LINKEDIN, GITHUB, WEBSITE, EMAIL
    }

    public static Author simple(String name, String role) {
        return new Author(
            slugify(name),
            name,
            slugify(name),
            role,
            null,
            null,
            null,
            Map.of()
        );
    }

    public static Author withTeam(String name, String role, String team) {
        return new Author(
            slugify(name),
            name,
            slugify(name),
            role,
            team,
            null,
            null,
            Map.of()
        );
    }

    private static String slugify(String text) {
        return text.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-");
    }
}
