const { test, expect } = require("@playwright/test");

test.describe("Article Link Validation", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto("http://localhost:3000");
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
  });

  test("Claude Opus 4.5 article card has valid href attribute", async ({
    page,
  }) => {
    // Scroll down to the Latest Updates section
    const latestUpdates = page.locator("text=Latest Updates");
    await latestUpdates.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find the first article card (Claude Opus 4.5)
    const articleCard = page.locator(".cards-grid .card").first();
    await articleCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Hover over the card to highlight it
    await articleCard.hover();
    await page.waitForTimeout(500);

    // Check that the href attribute exists and has the correct value
    await expect(articleCard).toHaveAttribute(
      "href",
      "/articles/claude-opus-4-5",
    );
  });

  test("Claude Opus 4.5 article card is clickable", async ({ page }) => {
    // Scroll down to the cards section
    const latestUpdates = page.locator("text=Latest Updates");
    await latestUpdates.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Find the first article card
    const articleCard = page.locator(".cards-grid .card").first();
    await articleCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Hover over the card
    await articleCard.hover();
    await page.waitForTimeout(400);

    // Verify the card contains the expected title
    await expect(articleCard.locator(".card-title")).toHaveText(
      "Introducing Claude Opus 4.5",
    );

    // Verify the link is visible and enabled
    await expect(articleCard).toBeVisible();
    await expect(articleCard).toBeEnabled();
  });

  test("Latest Updates section has 3 article cards", async ({ page }) => {
    // Scroll down to the Latest Updates section
    const latestUpdates = page.locator("text=Latest Updates");
    await latestUpdates.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Get all article cards
    const articleCards = page.locator(".cards-grid .card");

    // Verify we have 3 article cards
    await expect(articleCards).toHaveCount(3);

    // Hover over each card to highlight it
    for (let i = 0; i < 3; i++) {
      const card = articleCards.nth(i);
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      await page.waitForTimeout(400);
      await expect(card.locator(".card-title")).toBeVisible();
    }

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(500);
  });
});
