---
name: review-claude-md
description: Update CLAUDE.md to reflect recent codebase changes
---

# Update CLAUDE.md Based on Recent Changes

Review recent git changes and update the root CLAUDE.md file to reflect the current state of the codebase.

## Steps

1. **Review recent commits** - Run `git log --oneline -20` to see recent commits and understand what has changed

2. **Check the diff** - Run `git diff HEAD~10 --stat` to see which files have been modified recently

3. **Read current CLAUDE.md** - Understand what documentation already exists

4. **Analyze changes** - Look for:
   - New files or directories that should be documented
   - Changed architecture or patterns
   - New dependencies or tools
   - Updated routes or API endpoints
   - New testing patterns or coverage
   - Changes to the database schema
   - New commands or scripts

5. **Update CLAUDE.md** - Make targeted updates to reflect:
   - Any new project structure
   - New or changed features
   - Updated build/run instructions
   - New collaborators or ongoing projects
   - Any other relevant changes

Keep the documentation concise and focused on what developers need to know to work with the codebase.
