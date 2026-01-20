---
name: run-playwright
description: Run Playwright E2E tests with Firefox in slow-mo mode for visual debugging
---

Run the Playwright end-to-end tests with Firefox browser in slow-motion mode so the user can watch the test execution.

## Command

```bash
npx playwright test --browser=firefox
```

## Configuration

The tests use `playwright.config.js` which should have:

- `headless: false` - Shows the browser window
- `slowMo` option can be added for slower execution

## Notes

- The server must be running on localhost:3000 (the config will start it automatically if not running)
- Tests are in files matching `*.playwright.test.js`
- Firefox is used instead of Chromium due to browser permission issues on macOS

Execute this command now and report the results.
