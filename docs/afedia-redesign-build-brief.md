# Afedia Redesign — Build Brief for Claude Code (v3 — FINAL DESIGN, approved)

**This replaces the previous brief entirely. The visual direction changed twice before landing here — this version is approved and should not be reinterpreted or "improved" stylistically. Two reference files are attached alongside this brief: `afedia-layout-draft-soft.html` (public site) and `afedia-private-draft-soft.html` (private page). These are working HTML mockups — treat them as the literal source of truth for layout, spacing, typography, and color. Open them, read their CSS, and match them closely. Where this document and the drafts differ, the drafts win.**

---

## REFINEMENT PASS (v4) — read this first, applies on top of your last implementation

You already built the v3 design. The two reference files (`afedia-layout-draft-soft.html`, `afedia-private-draft-soft.html`) have been updated with a round of refinements — re-open both and diff them against what's currently live rather than assuming nothing changed. Summary of what's different:

**Public site:**
- Header "Afedia" wordmark is now much larger (was small, now ~4.4rem, close to the hero "Glory" size) and colored in the blue accent, not ink.
- The hero "Glory" headline is now colored in the blue accent (was ink).
- The About section's "A few words" label is no longer a small italic Fraunces line — it's now a proper Corinthia script heading (~2.6rem), same font family as "Glory," colored blue.
- The About body copy was rewritten to remove em dashes and shortened to two short plain sentences (see updated section 2 below).
- The gallery ("A few of my favorites") is no longer a loose flex-wrap scatter — it's now a fixed 2-column CSS grid with noticeably bigger polaroid frames (up to ~340px wide, vs. ~250px before), collapsing to 1 column on mobile. The photos should feel large and worth looking at, not thumbnail-sized.
- The standalone "Connect" section (plain text links) has been removed entirely. Social links now live behind a small pill-style "Connect" button in the footer, which opens a popup/modal centered on screen showing Instagram/TikTok/Facebook as icon-only circles (outlined, blue accent color, not full-color brand badges — reuse the existing icon SVG paths from the site but restyle them monochrome). This needs a small amount of JS to toggle the modal open/closed.
- Dark mode: deliberately not being added. It was considered and explicitly rejected — don't implement it, and don't ask about it again unless the user brings it up.

**Private page (`oloigbe.html`):**
- The hero caption ("for the one who locked me up and never let me out") is now bigger and bold (was 2.4rem regular, now 2.9rem, font-weight 700) for readability — it was hard to read at the old size.
- The letter text has been revised to remove em dashes throughout — use the updated text in section 3 below exactly, it replaces the previous version.
- The "moments" section now uses the same 2-column grid / bigger-frame treatment as the public gallery, replacing the old loose scatter.
- The closing line ("for you, only") is bigger (was 1.6rem, now 2.1rem).

Everything else from the v3 brief below still applies — this section only covers what changed.

---

"Afedia" is Glory's surname. The site is a tribute gallery about her, built by someone who admires her — not a photography portfolio, not written in first person as "I'm a passionate photographer." She isn't a photographer; she likes taking photos of herself and of sceneries she finds beautiful. The public site showcases her. The private page (`oloigbe.html`) is the personal letter plus photos of the two of them together.

## 1. Visual Direction — "Soft & intimate"

Two earlier directions (a Kilogbede-inspired bold editorial look, then a quieter magazine-style layout) were both rejected. The approved direction is warmer and more handmade: a blush-ivory background, her name set in large script as the actual headline (not a bold serif), and photos presented in tilted white polaroid frames scattered like a scrapbook rather than in a grid or card layout. It should feel tender and personal, not "designed."

### Palette
```
--bg:      #FBF6F1   (blush ivory background)
--ink:     #332A26   (warm near-black text)
--muted:   #A4948A   (secondary/caption text)
--blue:    #7C93B5   (soft dusty blue — used sparingly: small eyebrow text, links)
--frame:   #FFFFFF   (polaroid frame)
--frame-shadow: rgba(51,42,38,0.12)
```

### Typography
- **Corinthia** (script) — used LARGE for the actual headline (e.g. "Glory" on the public hero, the caption line on the private hero). This is the dominant display treatment now, not Fraunces.
- **Fraunces** (serif, weight 400–500, often italic) — used for section headings and the letter body text, smaller/quieter than the headline.
- **Inter** — body copy, small labels, eyebrow text.
- Load all three via the same Google Fonts approach already used in the project.

### The polaroid mechanic (core visual signature)
Every photo — hero and gallery — sits inside a white "frame" div with padding, a soft box-shadow, and a slight CSS `rotate()` transform (alternating small positive/negative degrees, plus a little `translateY` offset on alternating items) so the set reads as scattered rather than gridded. See `.polaroid` and `.scatter` in the draft CSS for exact values. Frames are large (roughly 230–300px wide) — don't shrink them into a dense grid.

### What NOT to carry over from earlier passes
- No alternating dark/cream section blocks.
- No bold uppercase eyebrow labels as a dominant device — keep them small and quiet if used at all.
- No hover-reveal gradient overlays on gallery images.
- No numbered captions ("one", "two", "three"...) — these aren't a real sequence, so don't imply one.
- Public "About" section is text-only — no circular avatar photo.

---

## 2. Public Site (`index.html`) — section by section

Match `afedia-layout-draft-soft.html` exactly for structure and styling. Content specifics:

1. **Header** — just the "Afedia" wordmark in Corinthia script, centered, no nav.
2. **Hero** — one polaroid-framed photo of Glory (tilted), her name "Glory" in large Corinthia script below it, one soft Inter tagline line beneath that. No text overlaid on the photo itself.
3. **About** — small italic Fraunces eyebrow line + 1–2 short Inter paragraphs about her (warm, third-person or direct address — not first-person photographer voice). No image in this section.
4. **Gallery** — heading: **"A few of my favorites."** A scattered polaroid layout (see `.scatter`) containing **every available photo that is actually of Glory** from `/assets/images/me/` — skip any file that doesn't feature her (documents, scenery-only shots, photos of other people, etc.). No captions on these unless the user adds them later. Confirm the final filename list with the user before finalizing — don't guess.
5. **Connect** — simple text links (Instagram / TikTok / Facebook) separated by "·", small caps, dusty blue color. No pill buttons, no dark background block.
6. **Footer** — one quiet line, e.g. "A small site, made with care."

## 3. Private Page (`oloigbe.html`)

Match `afedia-private-draft-soft.html` exactly. No header, no nav, no footer link back to the public site — it should feel entirely separate.

1. **Hero** — one polaroid-framed photo of the two of them (tilted), and below it, this exact line in large Corinthia script: **"for the one who locked me up and never let me out."**
2. **Letter** — Fraunces serif body text, rendered as normal finished text (no dashed border, no "draft" label). Final text:

> Glory,
>
> I spend most of my time behind this lens looking for something worth keeping. A shape, a shadow, a moment that won't sit still long enough anywhere else. I built a whole gallery out of it.
>
> That gallery is you. Every frame in it, on purpose, because you're the one thing I never get tired of finding, and somehow never tired of looking for. But this page isn't a photograph. It's not something to look at. It's something I've been carrying around for a while, and haven't known how to say out loud.
>
> We've never really talked about what this is, you and me. Maybe it's easier this way, building you a whole website instead of just telling you outright. But I think you should know, this isn't just admiration, and it isn't just a friendship I've been careful with. It's more than that, and it has been for a while.
>
> So this page isn't part of the site. It's not linked, not listed, not for anyone else to find. It's just for you, Mrs. Jailer, since you've had me locked up for a while now, and I haven't exactly been trying to argue my way out. I'm not even sure I want to.
>
> — Mr. Jailer

Leave this text editable/obvious in the source so the user can add a personal line before sending, but don't add a visible "draft" UI treatment around it.

3. **Moments** — a scattered polaroid section (same mechanic as the public gallery) with a small italic Fraunces heading: "a few moments, just ours." Photos of the two of them together — the user will supply these; use placeholder frames until they do.
4. **Closing line** — small centered Corinthia text: "for you, only." No footer, no nav, nothing else.

---

## 4. Technical Notes (carried over, unchanged)

- **Before making any further changes, create and switch to a `dev` branch, starting from the current state of the repo.** Nothing has been pushed to `origin` yet, so there's no need to reset or discard the redesign work already done — `dev` just continues forward from here. All work from this point on happens on `dev`, not `main`. Do not merge or push to `main` unless explicitly told to.
- `@tailwindcss/vite` properly wired via `vite.config.js`, multi-entry build including `oloigbe.html`.
- `public/robots.txt` — `Allow: /` only, no Disallow line. Privacy relies on the page being unlinked plus its `noindex, nofollow` meta tag.
- Don't auto-deploy or push — local review first.
- If any output/diff/summary is large, write it to `output.txt` in the project root rather than printing it inline.
- Replace placeholder `<div class="ph">...</div>` blocks with real `<img>` tags (keeping the same `.polaroid`/`.ph` wrapper structure) once real photos are available — ask the user for exact filenames rather than guessing.

## 5. Open Items for User

- Exact filenames of every photo that features Glory, for the public gallery (CC should ask, not assume).
- Real photos of the two of them together, for the private page's hero and "moments" section.
- Any final personal touch the user wants to add to the letter before sending.
