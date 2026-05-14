---
name: tako-overlay
description: Build, refactor, debug, or review Tako custom HTML overlays for Alert, Media Share, Leaderboard, Timer, Soundboard, Milestone, Polling, and Running Text. Use when working with Tako overlay variables like {{gifterName}}, {{formattedAmount}}, {{rankings}}, {{pollingOptions}}, {{texts}}, or when ensuring overlay HTML/CSS/JS follows Tako dashboard constraints, flexible sizing, safe body layout, and TailwindCSS-friendly utility-based code.
---

# Tako Overlay

## Workflow

1. Identify the overlay type and variables in use. Read [variables.md](references/variables.md) when the variable set is unclear.
2. Keep the HTML self-contained: standard `<html>`, `<head>`, and `<body>`; no build-only dependencies in pasted dashboard HTML.
3. Keep `body` measurable. Do not set `body{position:absolute}`. Use `width:100%`, `height:100%`, `overflow:hidden`, and `background:transparent`.
4. Prefer `rem`, `em`, or `px`. Do not use `vh` or `vw`; Tako scales overlays through dashboard font-size settings.
5. Prefer Tailwind CSS v4 utility classes and clean design tokens. For dashboard-pasted HTML, use the Browser CDN only when requested: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>` plus `<style type="text/tailwindcss">` for `@theme`, `@layer`, and custom overlay CSS.
6. Avoid padding hacks that only compensate for container overflow. Size the layout with stable dimensions, flex/grid constraints, `min-width:0`, and predictable overflow rules.
7. Parse JSON variables with `JSON.parse` from a script tag or escaped string, then render with escaped text. Never directly inject user-controlled fields into HTML without escaping.
8. Test in the Tako dashboard preview, and if working in a repo, rebuild generated `dist` files from source rather than editing minified output by hand.

## Implementation Rules

- Use exact Tako variable spelling with no spaces inside braces, for example `{{gifterName}}`, not `{{ gifterName }}`.
- When using Tailwind Browser CDN, keep runtime-generated classes visible in the HTML source or define stable component classes with `@layer components`, so dynamic `innerHTML` content is styled reliably.
- Keep overlay scripts defensive: handle empty arrays, missing images, broken avatars, and malformed JSON.
- For Alert and Media Share messages, support stickers by converting `[sticker_name]` tokens to `https://assets.tako.id/stickers/<name>.png` only after reading the text content.
- For badges, split comma-separated `{{gifterBadges}}` and load `https://assets.tako.id/badges/<badge>.png`.
- Use accessible empty `alt=""` for decorative images. Remove or hide failed avatars.
- Keep animations small and transform/opacity based. Avoid layout-changing animation on the measured container.
- Do not rely on `position:absolute` for the whole body. Absolute children are fine inside a measurable relative container.

## Overlay Notes

- Alert custom HTML excludes media such as Voice Note or GIF.
- Media Share customization applies to message content only; media/video and progress bar are not custom.
- Timer rerenders whenever time changes, so keep initialization idempotent and cheap.
- Test/preview may show warning text such as `Ini pesan uji coba`.
- Admin gifts may show `Dikirim oleh Admin`.
