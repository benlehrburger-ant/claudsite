# Prompting Claude for Frontend Changes

This guide shows how to write effective prompts for frontend feedback and changes in this codebase.

## Bad Prompt

> Fix the blog page styling. It doesn't look right and the cards are weird. Don't make it too colorful and don't change the header.

---

## Good Prompt

> I want to improve the blog post cards on the `/blog` page. Here's a screenshot of the current state: [screenshot attached]
>
> Please update `@views/blog.ejs` and `@public/css/styles.css` to make the following changes:
>
> 1. Add a subtle box shadow to each card (similar to the Anthropic website's card style)
> 2. Increase the card padding from 16px to 24px
> 3. Make the post title use font-weight 600 instead of 400
> 4. Add a hover effect that slightly lifts the card
>
> The cards should look like this example:
>
> ```
> ┌─────────────────────────────┐
> │  [Featured Image]          │
> │                            │
> │  Category · Jan 20, 2025   │
> │  Post Title Here           │
> │  Short excerpt text...     │
> └─────────────────────────────┘
> ```
>
> Use plan mode first so we can discuss the approach before implementing.
