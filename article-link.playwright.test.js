const { test, expect } = require("@playwright/test");

test.describe("Article Link Validation", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto("http://localhost:3000");
  });

  test("Claude Opus 4.5 article card has valid href attribute", async ({
    page,
  }) => {
    // Find the first article card (Claude Opus 4.5)
    const articleCard = page.locator(".cards-grid .card").first();

    // Check that the href attribute exists and has the correct value
    await expect(articleCard).toHaveAttribute(
      "href",
      "/articles/claude-opus-4-5",
    );
  });

  test("Claude Opus 4.5 article card is clickable", async ({ page }) => {
    // Find the first article card
    const articleCard = page.locator(".cards-grid .card").first();

    // Verify the card contains the expected title
    await expect(articleCard.locator(".card-title")).toHaveText(
      "Introducing Claude Opus 4.5",
    );

    // Verify the link is visible and enabled
    await expect(articleCard).toBeVisible();
    await expect(articleCard).toBeEnabled();
  });

  test("Claude Opus 4.5 article card navigates to correct page when clicked", async ({
    page,
  }) => {
    // Find and click the first article card
    const articleCard = page.locator(".cards-grid .card").first();
    await articleCard.click();

    // Wait for navigation and verify the URL
    await expect(page).toHaveURL(
      "http://localhost:3000/articles/claude-opus-4-5",
    );
  });

  test("all article cards in Latest Updates have valid href attributes", async ({
    page,
  }) => {
    // Get all article cards
    const articleCards = page.locator(".cards-grid .card");

    // Verify we have 3 article cards
    await expect(articleCards).toHaveCount(3);

    // Check each card has an href attribute
    for (let i = 0; i < 3; i++) {
      const card = articleCards.nth(i);
      const href = await card.getAttribute("href");

      // Verify href exists and starts with /articles/
      expect(href).toBeTruthy();
      expect(href).toMatch(/^\/articles\//);
    }
  });
});
