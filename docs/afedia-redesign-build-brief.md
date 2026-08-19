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

## MOTION PASS (v5) — two effects approved, add these on top of everything above

Two motion ideas were prototyped and approved. A third (an envelope-opening intro animation for the private page) was considered and explicitly rejected — the user was concerned about making it responsive across screen sizes given the letter's length, so **do not build the envelope effect.**

### 1. Scroll stagger — applies to the public gallery grid AND the private "moments" grid

As each polaroid scrolls into view, it should fade in and settle into its final tilted position, staggered slightly per item, rather than just appearing. Use an IntersectionObserver. Reference implementation:

```css
.scatter .polaroid{
  opacity:0;
  transform:translateY(40px) rotate(0deg);
  transition:opacity 0.7s ease, transform 0.7s cubic-bezier(.22,1,.36,1);
}
.scatter .polaroid.in-view{opacity:1;}
/* then per nth-child, set the .in-view transform to translateY(0) rotate(<that item's existing tilt angle>) */
```

```js
const items = document.querySelectorAll('.scatter .polaroid');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (Array.from(items).indexOf(entry.target) * 0.12) + 's';
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.3 });
items.forEach(el => io.observe(el));
```

Adapt the transform values to match each grid's existing per-item rotation angles (already defined via `nth-child` in both pages) rather than hardcoding new ones.

### 2. 3D hover tilt — applies to every polaroid photo site-wide, including both hero photos

On mouse movement over a polaroid, it should tilt in real 3D (perspective + rotateX/rotateY) tracking cursor position, like the photo is being picked up and turned in light. Reverts smoothly on mouse-leave. Reference implementation:

```css
.tilt-wrap{perspective:800px;}
.tilt-wrap .polaroid{transition:transform 0.15s ease-out, box-shadow 0.15s ease-out; cursor:pointer;}
.tilt-wrap .polaroid:hover{box-shadow:0 22px 40px var(--frame-shadow);}
```

```js
document.querySelectorAll('.tilt-wrap').forEach(wrap => {
  const card = wrap.querySelector('.polaroid');
  const baseRotate = /* that item's existing rotation angle, in degrees */ 0;
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotate(${baseRotate}deg) perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.05)`;
  });
  wrap.addEventListener('mouseleave', () => {
    card.style.transform = `rotate(${baseRotate}deg)`;
  });
});
```

Every existing `.polaroid` element needs to be wrapped in a `.tilt-wrap` div (or the equivalent perspective container) for this to work — this touches markup on both pages, not just CSS/JS. Preserve each photo's existing base rotation angle as `baseRotate` so the tilt effect starts from its current scattered position rather than resetting it to straight.

Both effects should feel subtle and quick (short durations, no bounce/overshoot) — this is a quiet, sincere site, not a flashy one. If either effect ends up feeling like "too much" once built, flag it rather than tuning it further unilaterally.

---

## DARK MODE PASS (v6) — automatic, no visible toggle

A dark variant is approved, but **it must not have a visible toggle button or any manual switch UI on the page.** Instead, implement it purely via the `prefers-color-scheme` media query, so it activates automatically based on the visitor's own system/browser setting, with zero added interface elements. No JavaScript, no localStorage, no button.

Add this to both `src/style.css` (public site) and the private page's own `<style>` block:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #241E1A;
    --ink: #F3EAE0;
    --muted: #B5A190;
    --blue: #9BB3D1;
    --frame: #FAF3E9;
    --frame-shadow: rgba(0,0,0,0.5);
  }
}
```

Design intent, so this doesn't get reinterpreted: this should feel like flipping through the same photo album at night by lamplight, not like a different, colder site. That's why the dark background is a warm espresso-brown rather than a cold black or gray, and the polaroid frames stay a warm off-white (like real photo paper) rather than going dark themselves. The blue accent is a touch lighter in dark mode for contrast against the darker background. Everything else (fonts, layout, motion effects) stays identical between modes — only the color variables change.

---

## AMBIENT SHAPES PASS (v7) — floating background shapes, whole-page, both public and private pages

Six small blurred SVG shapes drift slowly in the blue accent color, positioned on a fixed layer that sits behind all page content and covers the full viewport — so they stay softly visible no matter where the visitor has scrolled to, not confined to one section. Applies to both `index.html` and `oloigbe.html`.

Wrapper (place as the first element inside `<body>`, once per page):

```css
.ambient-field{position:fixed;inset:0;pointer-events:none;z-index:-1;overflow:hidden;}
.light{
  position:absolute;
  animation:drift 15s ease-in-out infinite;
  filter:blur(5px);opacity:0.5;color:var(--blue);
}
.light svg{display:block;width:100%;height:100%;}
@keyframes drift{
  0%{transform:translate(0,0) rotate(0deg);opacity:0.35;}
  50%{transform:translate(-16px,-26px) rotate(8deg);opacity:0.7;}
  100%{transform:translate(0,0) rotate(0deg);opacity:0.35;}
}
```

The six shapes, each in its own `.light` div inside `.ambient-field`, spread across varied positions on the viewport (not clustered — spread roughly one per screen quadrant plus two more), with staggered `animation-duration` (13s–19s) and `animation-delay` (0 to -11s) so they never move in sync. Sizes range roughly 40–64px. Exact markup:

```html
<div class="ambient-field">
  <!-- flower -->
  <div class="light" style="width:64px;height:64px;left:8%;top:12%;animation-duration:17s;">
    <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="4"/><circle cx="18" cy="10.5" r="4"/><circle cx="15.7" cy="17.5" r="4"/><circle cx="8.3" cy="17.5" r="4"/><circle cx="6" cy="10.5" r="4"/><circle cx="12" cy="12" r="3.2"/></svg>
  </div>
  <!-- heart -->
  <div class="light" style="width:48px;height:48px;left:82%;top:22%;animation-duration:13s;animation-delay:-3s;">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21C12 21 4 14.5 4 8.7C4 5.5 6.5 3 9.6 3C11 3 12 4 12 4C12 4 13 3 14.4 3C17.5 3 20 5.5 20 8.7C20 14.5 12 21 12 21Z"/></svg>
  </div>
  <!-- ring -->
  <div class="light" style="width:56px;height:56px;left:20%;top:55%;animation-duration:19s;animation-delay:-8s;">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><circle cx="12" cy="12" r="7"/></svg>
  </div>
  <!-- star -->
  <div class="light" style="width:40px;height:40px;left:70%;top:65%;animation-duration:14s;animation-delay:-5s;">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.1L12 17.3 5.7 21.3l1.7-7.1L2 9.5l7.1-.6L12 2z"/></svg>
  </div>
  <!-- musical note -->
  <div class="light" style="width:46px;height:46px;left:45%;top:8%;animation-duration:16s;animation-delay:-11s;">
    <svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="8" cy="18" rx="3.2" ry="2.4" transform="rotate(-15 8 18)"/><rect x="10.5" y="4" width="2" height="14.5"/><path d="M12.5 4c3.2 0 5.5 2.1 5.5 5.2-2.1-1.1-4.2-1.1-5.5-.2z"/></svg>
  </div>
  <!-- crown -->
  <div class="light" style="width:50px;height:50px;left:88%;top:80%;animation-duration:18s;animation-delay:-6s;">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z"/></svg>
  </div>
</div>
```

Two personal touches worth preserving exactly, not simplifying away: the musical note (she's a chorister) and the crown (her name is Glory — ties to "GLORY REIGN" on one of her own photos). Don't swap these for generic alternatives.

The `z-index:-1` on `.ambient-field` is intentional and load-bearing — it must render above the page's base background color but behind all normal page content (text, polaroids, buttons). If anything on the page ends up with its own explicit `z-index`, double check the shapes still sit behind it correctly.

---

## 0. Concept (unchanged from v2, still correct)

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
