---
name: push-to-gh
description: Commit local changes, push to a new branch, and create a GitHub PR with a detailed description. Use when ready to submit work for review.
---

This skill commits all local changes, pushes to a new feature branch, and creates a GitHub Pull Request with a comprehensive description.

## Workflow

### 1. Analyze Changes

First, understand what's being committed:

```bash
git status
git diff --stat
git diff
```

Review all modified, added, and deleted files to understand the full scope of changes.

### 2. Create Commit

Stage all changes and create a descriptive commit:

```bash
git add -A
git commit -m "<type>: <concise summary>"
```

Use conventional commit types: feat, fix, refactor, docs, test, chore, style.

### 3. Create Feature Branch and Push

Generate a descriptive branch name from the changes and push:

```bash
git checkout -b <descriptive-branch-name>
git push -u origin <descriptive-branch-name>
```

Branch naming: Use kebab-case, be descriptive (e.g., `add-user-auth-flow`, `fix-navbar-mobile-layout`).

### 4. Create Pull Request

Use the GitHub CLI to create a PR with a detailed description:

```bash
gh pr create --title "<clear title>" --body "<detailed body>"
```

## PR Description Format

Write a comprehensive PR body that includes:

```markdown
## Summary

<2-3 sentence overview of what this PR accomplishes>

## Changes

- <Bullet point for each significant change>
- <Group related changes together>
- <Be specific about what was modified>

## Testing

<How these changes were tested or can be verified>

## Notes

<Any additional context, trade-offs, or future considerations>
```

## Guidelines

- **Be thorough**: Read all diffs to understand the full impact
- **Be specific**: Reference actual file names and functions in the description
- **Be honest**: If something is incomplete or needs follow-up, note it
- **Link context**: Reference related issues or previous PRs if relevant

## Example

For a change that adds form validation:

```bash
git add -A
git commit -m "feat: add client-side form validation"
git checkout -b add-form-validation
git push -u origin add-form-validation
gh pr create --title "Add client-side form validation" --body "## Summary
Adds comprehensive client-side validation to the contact form with real-time feedback.

## Changes
- Added validation functions in public/js/validation.js
- Updated ContactForm component with error states
- Added CSS for error message styling
- Added unit tests for validation logic

## Testing
- Tested all form fields with valid/invalid inputs
- Verified error messages display correctly
- Confirmed form submission blocked when invalid

## Notes
Server-side validation already exists; this adds UX improvements."
```

Execute this workflow now with the current uncommitted changes.
