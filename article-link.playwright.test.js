const { test, expect } = require("@playwright/test");

test.describe("Article Link Validation", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto("http://localhost:3000");
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
  });

  test("Claude Opus 4.6 article card navigates to article page", async ({
    page,
  }) => {
    // Scroll down to the cards section
    const latestUpdates = page.locator("text=Latest Updates");
    await latestUpdates.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Find the first article card
    const articleCard = page.locator(".cards-grid .card").first();
    await articleCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);

    // Hover over the card
    await articleCard.hover();
    await page.waitForTimeout(150);

    // Verify the card contains the expected title
    await expect(articleCard.locator(".card-title")).toHaveText(
      "Introducing Claude Opus 4.6",
    );

    // Click the card and wait for navigation
    await articleCard.click();
    await page.waitForLoadState("networkidle");

    // Verify we navigated to the correct article page
    await expect(page).toHaveURL(/\/articles\/claude-opus-4-6/, {
      timeout: 500,
    });

    // Verify the article page loaded successfully (not an error page)
    const articleTitle = page.locator("h1");
    await expect(articleTitle).toContainText("Claude Opus 4.6", {
      timeout: 500,
    });

    // Brief pause to show the page
    await page.waitForTimeout(150);
  });

  test("Latest Updates section has 3 article cards", async ({ page }) => {
    // Scroll down to the Latest Updates section
    const latestUpdates = page.locator("text=Latest Updates");
    await latestUpdates.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Get all article cards
    const articleCards = page.locator(".cards-grid .card");

    // Verify we have 3 article cards
    await expect(articleCards).toHaveCount(3);

    // Hover over each card to highlight it
    for (let i = 0; i < 3; i++) {
      const card = articleCards.nth(i);
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      await page.waitForTimeout(150);
      await expect(card.locator(".card-title")).toBeVisible();
    }

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(200);
  });
});
