---
name: dead-code
description: Find unused code, routes, templates, and CSS across the codebase (runs as background agent)
allowed-tools: Glob, Grep, Read, Task
---

# Dead Code Analysis

Run this as a background subagent to find unused code across the codebase.

## Instructions

Use the Task tool with `subagent_type: "Explore"` and `run_in_background: true` to spawn an agent that performs the following analysis:

## Analysis Scope

### 1. Unused JavaScript/TypeScript

- Exported functions never imported elsewhere
- Variables declared but never read
- Unreachable code after return/throw statements

### 2. Unused Routes

- Routes defined in `server.js` that are never linked to from templates
- API endpoints with no consumers

### 3. Unused EJS Templates

- Templates in `views/` never rendered by any route
- Partials never included by other templates

### 4. Unused CSS

- Classes in `public/css/` never referenced in EJS templates or JS
- IDs defined but never used
- Dead selectors

### 5. Unused Dependencies

- npm packages in `package.json` never imported
- Maven dependencies in `pom.xml` never used

### 6. Java Dead Code

- Unused classes, methods, or fields in `backend/src/`
- Unreferenced imports

## Output Format

Return a structured report:

```markdown
## Dead Code Report

### High Confidence (safe to remove)

| Type     | Location      | Name         | Reason              |
| -------- | ------------- | ------------ | ------------------- |
| function | server.js:142 | `oldHandler` | No references found |

### Medium Confidence (verify before removing)

| Type      | Location      | Name          | Reason                 |
| --------- | ------------- | ------------- | ---------------------- |
| CSS class | styles.css:89 | `.legacy-btn` | Only in commented HTML |

### Summary

- X unused functions
- X unused routes
- X unused templates
- X unused CSS selectors
- X unused dependencies
```

## How to Run

When this command is invoked, spawn the analysis agent in the background so the user can continue working while it scans the codebase.
