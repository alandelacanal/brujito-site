# Implementation Plan — El Medico Brujito (sitio portfolio estatico)

Static one-page portfolio for the music producer **El Medico Brujito** (German Canete),
"The Little WitchDoctor", Productor en WitchDoctor Label. Spanish-language, dark/warm mystical
aesthetic, modeled structurally on lastronauta.com.ar. Plain static **HTML + CSS + vanilla JS**,
no frameworks, no build step. Opens directly via `index.html`.

## Scope and ground rules

- Build everything under `c:\wks\my\Projects\Design&Prototyping\SkillsTest\brujito-site\`.
- Do NOT touch anything outside that folder except reading reference files.
- No worktree. No build tooling. No npm. The deliverable is files served by opening `index.html`
  in a browser (or `python -m http.server` from the site root for the Spotify iframe to load over
  http rather than `file://`).
- All copy in Spanish (original prose; do not paste long text from external sources).

## File layout (confirmed on disk)

```
brujito-site/
├── index.html                  (CREATE)
├── css/
│   └── styles.css              (CREATE — js/ and css/ folders do not exist yet; create them)
├── js/
│   └── main.js                 (CREATE)
├── assets/
│   └── img/                    (EXISTS, empty — place generated SVG + screenshots here)
│       ├── seal.svg            (optional: seal may be inlined in HTML instead — decide in step 7)
│       ├── screenshot-desktop.png  (verification artifact)
│       └── screenshot-mobile.png   (verification artifact)
└── .agents/
    └── plan.md                 (this file)
```

**Decision:** keep CSS and JS external (not inlined) so the three concerns stay separate and
reviewable. One stylesheet and one script are enough; no module splitting for a one-pager.

## Design decisions and the brief-vs-references tension (read first)

The workspace design references (`.agents/skills/design-taste-frontend/references/*`) warn against
three things this brief explicitly asks for. The **brief is authoritative** and the artist's brand
owns warm amber, so we honor the brief and apply the references' discipline only where it does not
conflict. Decisions, with rationale:

1. **Warm amber accent + warm dark ground.** `colour.md` flags the cream+terracotta family and
   "warmth is not beige". We are NOT using a light cream ground with a terracotta button — we use a
   near-black warm charcoal ground (`--bg #0d0b08`) with cream *text*, and amber as a deep-night
   studio glow. This is the brand's colour (studio amber light), so we keep it deliberately, like
   `colour.md` §9's "the brand owns the colour" exception. Rationale noted so the reviewer does not
   treat it as the generic AI look.
2. **Radial amber glows on a dark page.** `colour.md` §6 says depth on dark should come from a
   lighter surface step, not glows. The brief explicitly wants "soft radial amber glows behind the
   hero and section titles" as the analog-studio signature. We keep the glows but ALSO use a real
   surface step (`--bg-2`) for panels/cards, so depth does not depend on the glow alone. Glows stay
   subtle (low-opacity radial gradients, large blur) so they read as atmosphere, not decoration.
3. **Accent on headings.** `colour.md` §3 says a headline is ink, accent marks the action. The brief
   wants amber titles. Compromise that keeps both legible and on-brand: section **eyebrow/heading
   accents and hover states** use amber, but body-level headings sit mostly in `--cream` ink with
   amber reserved for links, the hero wordmark glow, CTAs, and hover. Keep amber under ~5% of any
   screen per `colour.md` §3.

Discipline we DO adopt from the references:
- Contrast floor: body text >= 4.5:1, display >= 3:1 on its ground; verify `--cream` on `--bg`.
- Type scale: few sizes far apart (display, lead, body, small, one heading step) per `type.md` §2.
- Motion is choreographed per section, not one uniform fade-up everywhere; respect
  `prefers-reduced-motion` with the finished state as the reduced state (`motion.md` §8).
- Equal left/right margins at every width; nav on the same margins as content (`layout.md` §5).
- Sections told apart by ground tone and spacing, not hairlines (`layout.md` §4–6).
- End on a designed footer scene, not a link-column dump (`layout.md` §8).
- `color-scheme: dark` on root; lighter font weights on dark (`colour.md` §6).

## Section + anchor id map (nav targets, in order)

Smooth-scroll nav anchors point at these ids. Hero is the top; nav links target 2–7.

| # | Section            | `id`          | Nav label (ES)   |
|---|--------------------|---------------|------------------|
| 1 | Hero               | `#inicio`     | (wordmark/home)  |
| 2 | Sobre / Bio        | `#sobre`      | Sobre            |
| 3 | Produccion (serv.) | `#produccion` | Produccion       |
| 4 | Discografia        | `#discografia`| Discografia      |
| 5 | Musica (Spotify)   | `#musica`     | Musica           |
| 6 | Sesiones           | `#sesiones`   | Sesiones         |
| 7 | Contacto / Redes   | `#contacto`   | Contacto         |
| 8 | Footer             | `<footer>`    | (back-to-top)    |

Nav order in markup: Sobre, Produccion, Discografia, Musica, Sesiones, Contacto.

---

# Steps

Each step leaves the site openable in a browser. Verification uses the real way this project runs:
open `index.html` (serve over `http.server` for the Spotify step) and check in the browser / via the
Playwright MCP tools already available to the coder. Grep is not verification.

- [ ] 1. Create the HTML skeleton and document head.
      Build `index.html` with `<!doctype html>`, `lang="es"`, meta charset/viewport, a descriptive
      `<title>` ("El Medico Brujito — Productor | WitchDoctor Label") and meta description, and
      `<meta name="theme-color" content="#0d0b08">`. Add Google Fonts with `preconnect` to
      `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin) then one stylesheet `<link>`
      requesting **Oswald** (display, weights 500/600) and **Work Sans** (body, 400/500) — two faces,
      two-three weights total per `type.md` §5. Link `css/styles.css` in `<head>` and
      `<script src="js/main.js" defer></script>` before `</body>`. Add the one-line inline script
      `document.documentElement.classList.add('js')` at the top of `<body>` so JS-hidden states never
      strand content when JS is off (`motion.md` §6). Lay in semantic landmarks: `<header>` (nav),
      `<main>` with the seven `<section>` ids above, `<footer>`.
      Files: `index.html`
      Verify: open `index.html` in a browser — page loads, title shows in the tab, no 404s for the
      font link in DevTools Network, DevTools Console has no errors.

- [ ] 2. Fill the Hero section (`#inicio`) and the sticky top nav.
      Nav: wordmark/home link on the left, anchor links (Sobre, Produccion, Discografia, Musica,
      Sesiones, Contacto) on the right, plus a mobile menu toggle button (`<button aria-expanded>`
      with `aria-controls` pointing at the nav list). Nav is `position: sticky`/fixed, transparent
      at top. Hero: `<h1>` "El Medico Brujito" at display size, subtitle "Musico independiente ·
      Productor" and "The Little WitchDoctor", and a subtle scroll-down cue (animated chevron or
      "scroll" caption) that links to `#sobre`. Mark hero text with `data-line`/`data-load` hooks for
      the load choreography added in step 9. Place the SVG seal here or in the footer (final call in
      step 7). Give the hero one `h1` that says who/what this is on first paint (`layout.md` §5).
      Files: `index.html`
      Verify: open in browser — hero fills the first screen, nav links visible, clicking a nav link
      jumps to the right section; Console clean.

- [ ] 3. Fill Sobre/Bio (`#sobre`) and Produccion (`#produccion`).
      Sobre: 2–3 short original Spanish paragraphs built from the taglines (German Canete a.k.a. El
      Medico Brujito; musico independiente; productor en WitchDoctor Label; Working Class Hero;
      raices reggae/roots/dub; home-studio analogico). Keep measure 45–75ch on the paragraph, not the
      page (`type.md` §4). Produccion: a card grid of services — Arreglos y orquestacion, Grabacion,
      Mezcla, Edicion y masterizacion, Produccion artistica, Guitarras y synthes — each card a title +
      one-line description. Add the CTA "Para produccion musical, escribime por DM" linking to
      `https://www.instagram.com/elmedicobrujito/` (`target="_blank"` + `rel="noopener noreferrer"`).
      Mark cards with a reveal hook (`data-reveal`) for step 9.
      Files: `index.html`
      Verify: open in browser — both sections render, six service cards present, CTA link opens the
      Instagram profile in a new tab; Console clean.

- [ ] 4. Fill Discografia (`#discografia`) and Sesiones (`#sesiones`).
      Discografia cards (title + short description + credits where available):
      • **El Medico Brujito & Los Herejes — Skinhead Train** — homenaje al Early Reggae (1969),
        referencias The Charmers y Laurel Aitken; ya disponible en plataformas. Creditos: El Medico
        Brujito (arreglos, orquestacion, guitarras, synthes), Juan Ignacio Isgro (saxo alto y tenor),
        @bara_bass69 (contrabajo). Producido para WitchDoctor Label 2026. Mezcla, edicion y
        masterizacion: El Medico Brujito.
      • **IL SanTo Reggae** — historica banda de reggae de La Plata (Los Hornos); proyecto 2008–2026;
        lanzamiento **18 de noviembre de 2026**, todas las plataformas. Use `<time datetime="2026-11-18">`.
      • **Serie Riddims** — procesos de maquetacion / homenajes roots: Let's Move Riddim (Burning
        Spear), Running Away Riddim (Bob Marley), 400 Years Riddim (Peter Tosh).
      Sesiones: "Brujito's Sessions" — micro-composiciones experimentales sobre samples; mention
      Jam #03 "La Voz del Cielo". Placeholder session cards (no real video URLs) styled as entries;
      do NOT fabricate links — use non-link cards or disabled/`aria-disabled` placeholders.
      Files: `index.html`
      Verify: open in browser — three discography cards + riddims list, sessions cards render, the
      18 nov 2026 date shows; Console clean.

- [ ] 5. Fill Musica (`#musica`) with the Spotify embed and Contacto (`#contacto`).
      Musica: one short intro line about WitchDoctor Label, then the Spotify iframe:
      `src="https://open.spotify.com/embed/playlist/56qCvEpRpszWgxSPSRTcdB?utm_source=generator"`,
      `width="100%"`, `height="400"` (within 380–420), `loading="lazy"`, `frameborder="0"`,
      `allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"`, and a
      `title` for accessibility. Wrap in a responsive container. Contacto: bold links to Instagram
      artista (`/elmedicobrujito/`), Instagram sello (`/witchdoctorlabel/`), Linktree
      (`https://linktr.ee/elmedicobrujito`), Spotify playlist
      (`https://open.spotify.com/playlist/56qCvEpRpszWgxSPSRTcdB`). Icon/text links get
      `aria-label`, `target="_blank"`, `rel="noopener noreferrer"`.
      Files: `index.html`
      Verify: serve the folder (`python -m http.server 8000` from `brujito-site/`) and open
      `http://localhost:8000/` — the Spotify player loads and shows the playlist (iframe will not load
      from `file://`); all four contact links open the right targets; Console clean.

- [ ] 6. Fill the Footer and complete the static HTML content pass.
      Footer: "The WitchDoctor Label 2026 ®" line (use `&reg;`), small print in the body face at a
      readable size, and a back-to-top link to `#inicio`. End on a designed scene (wordmark or seal
      repeated), not a link-column dump (`layout.md` §8). This is the last content-only step; the HTML
      is now complete and styled by the browser default only.
      Files: `index.html`
      Verify: open in browser — footer renders, back-to-top link scrolls to the hero; all eight
      sections present in order; Console clean.

- [ ] 7. Create `css/styles.css` — tokens, reset, palette, typography, texture.
      Define `:root` custom properties: palette `--bg #0d0b08`, `--bg-2 #171210`, `--amber #E8A33D`,
      `--amber-soft #f0c27a`, `--brick #b4432a`, `--olive #6f7d3f`, `--cream #efe3cf`,
      `--muted #a99a84`; plus role aliases `--ink: var(--cream)` and `--surface: var(--bg-2)` so the
      references' role model maps cleanly. Set `color-scheme: dark` on `:root`. Type scale via
      `clamp()`: `--step-display` (hero, ~clamp(3rem,1rem+9vw,8rem)), `--step-head`, `--step-lead`,
      `--step-body` (~17–19px), `--step-small`; `--font-display: "Oswald", "Arial Narrow", sans-serif`,
      `--font-text: "Work Sans", system-ui, sans-serif`. Margins/grid: `--margin: clamp(1rem,2.2vw,2rem)`,
      equal on both sides. Motion tokens from `motion.md` §4 (`--ease-out`, `--ease-expo`,
      `--ease-in-out`, `--t-hover`, `--t-reveal`, stagger vars). Base reset (`box-sizing`, `margin:0`,
      body font/size/line-height 1.5, `text-rendering: optimizeLegibility`). Headings in `--font-display`,
      uppercase, generous `letter-spacing`, display line-height ~0.95. Links/`::selection`/`:focus-visible`
      use `--amber`. **Grain texture:** `body::before` fixed overlay, `pointer-events:none`,
      low opacity (~0.05), `background-image` a data-URI inline SVG using `feTurbulence`
      (`baseFrequency` ~0.8, fractalNoise) for the analog film grain. **Amber glows:** radial-gradient
      pseudo-elements behind the hero and section headings, low opacity, large radius, pointer-events
      none, sitting over the real `--bg-2` surface step.
      Files: `css/styles.css`
      Verify: open in browser — palette applied, display font renders (check DevTools Computed →
      font-family resolves to Oswald, not fallback), grain overlay faintly visible, no horizontal
      scrollbar at 1280px; Console clean.

- [ ] 8. Style layout, sections, cards, nav, and responsive breakpoints in `css/styles.css`.
      Lay out: equal margins via a `.wrap` padding-inline; card grids (Produccion, Discografia,
      Sesiones) with CSS grid, `--bg-2` surface panels one tone step from ground (no hairlines,
      `colour.md` §4), generous padding, hover lift (`transform: translateY`) gated behind the motion
      media query. Nav: transparent at top, becomes opaque (`--bg` with slight blur/shadow) via a
      `.scrolled` class toggled in step 9; mobile (`<=760px`) collapses the links into a full-screen
      sheet toggled by the menu button, touch targets >=44px, body text 16–18px, margins 16–20px.
      Make the Spotify iframe container fluid. Style the footer scene. Mobile-first: author the 360px
      layout, then add `min-width` media queries up to 1440px; re-author hero line breaks and ensure
      one dominant element per phone screen (`layout.md` §9). Sections spaced 72–112px on phone,
      120–240px desktop, gap between sections clearly larger than within.
      Files: `css/styles.css`
      Verify: open in browser and resize 360px → 1440px (DevTools device toolbar) — no horizontal
      overflow, nav collapses to a working mobile sheet, cards reflow to one column on phone, the
      Spotify iframe stays within the viewport; Console clean.

- [ ] 9. Create `js/main.js` — behaviors with reduced-motion handling.
      Implement, all guarded so content is never hidden when JS is off (the `.js` class + CSS does the
      hiding): (a) **IntersectionObserver fade-up reveals** on `[data-reveal]` sections/cards, firing
      once when ~85% into the viewport, staggered per `motion.md` (adds a `.is-visible` class; the CSS
      transition does the move). (b) **Smooth anchor scrolling** for in-page nav links
      (`scroll-behavior: smooth` in CSS as the base, plus a JS handler that also closes the mobile
      sheet and moves focus to the target for keyboard users). (c) **Nav opacity on scroll** — toggle a
      `.scrolled` class on the header past a scroll threshold (use a scroll listener with
      `requestAnimationFrame` throttle or an IntersectionObserver sentinel at the top). (d) **Mobile nav
      toggle** — button toggles the sheet, updates `aria-expanded`, closes on link click and on Escape,
      and is keyboard-operable. (e) **Reduced-motion**: read
      `matchMedia('(prefers-reduced-motion: reduce)')`; when set, reveal everything immediately (add
      `.is-visible` to all targets up front) and skip smooth-scroll easing — the finished state is the
      reduced state (`motion.md` §8). Keep the hero load choreography (step 2 hooks) inside the
      `no-preference` media query in CSS.
      Files: `js/main.js` (and small CSS additions in `css/styles.css` for `.is-visible`/`.scrolled`
      states if not already present)
      Verify: open in browser — scrolling reveals sections once, nav turns opaque after scrolling,
      clicking nav links smooth-scrolls, the mobile menu opens/closes by click and Escape; set
      "Emulate prefers-reduced-motion: reduce" in DevTools Rendering and confirm all content is visible
      with no transforms animating; Console clean throughout.

- [ ] 10. Create the WitchDoctor Label SVG seal.
      Build a hand-drawn-ish circular "WITCH DOCTOR LABEL" seal as an inline `<svg>` (preferred — one
      less request and it can inherit `currentColor` for the amber) placed in the hero or footer per the
      step-7/step-2 decision, OR as `assets/img/seal.svg` referenced by `<img alt="WitchDoctor Label">`.
      Use SVG `<path>`/`<circle>` and `<textPath>` around a circle for the ring text; strokes in
      `--amber`/`currentColor`. Keep it decorative with `aria-hidden="true"` if the label text is
      otherwise present, or give it a `role="img"` + `<title>` if it is the only label.
      Files: `index.html` (inline) and/or `assets/img/seal.svg`, minor `css/styles.css` for sizing
      Verify: open in browser — the seal renders crisp at hero/footer size, scales without blur, color
      matches the amber accent; Console clean.

- [ ] 11. Verification pass — screenshots, anchors, iframe, console, contrast.
      Using the Playwright MCP browser tools already available: serve the site
      (`python -m http.server 8000` from `brujito-site/`), navigate to `http://localhost:8000/`.
      • **Desktop screenshot** at ~1280px wide → save to `assets/img/screenshot-desktop.png`.
      • **Mobile screenshot** at ~390px wide → save to `assets/img/screenshot-mobile.png`.
      • **Nav anchor check**: click each nav link (Sobre, Produccion, Discografia, Musica, Sesiones,
        Contacto) and confirm the URL hash updates and the matching section is in view.
      • **Spotify iframe check**: confirm the iframe `src` equals
        `https://open.spotify.com/embed/playlist/56qCvEpRpszWgxSPSRTcdB?utm_source=generator` and the
        player renders (not a blank/`file://` failure).
      • **Console check**: collect console messages during load + a full scroll; expect zero errors.
      • **WCAG AA contrast check**: compute the contrast ratio of `--cream #efe3cf` on `--bg #0d0b08`
        and confirm it is >= 4.5:1 for body text (it is ~15:1, so it passes with wide margin); spot-check
        `--muted #a99a84` on `--bg` is >= 4.5:1 for secondary text, and `--amber #E8A33D` link text on
        `--bg` is >= 4.5:1 — if `--muted` or any accent-on-ground text falls short, darken the ground or
        lift the text token until it passes, then re-screenshot.
      Files: `assets/img/screenshot-desktop.png`, `assets/img/screenshot-mobile.png` (artifacts);
      any token fixes land in `css/styles.css`.
      Verify: both screenshots exist and look correct (dark warm aesthetic, no overflow, Spotify
      player visible on desktop shot), all six nav anchors work, iframe src matches exactly, console
      error count is 0, and the contrast ratios meet AA. This is the final acceptance gate.

## Notes / assumptions (gaps filled with reasonable defaults)

- **Fonts:** Oswald (display) + Work Sans (body) chosen over Anton/Bebas because Oswald's condensed
  vintage-poster feel fits the brief while remaining readable at heading sizes, and Work Sans is a
  clean, well-hinted body face. Both are on Google Fonts. If the coder prefers Bebas Neue for a
  louder display, that is an acceptable swap as long as only two faces / three weights load total.
- **Serving:** the Spotify iframe needs http(s), not `file://`. Local verification uses Python's
  `http.server` (present on the Windows box via `python`); if `python` is unavailable, any static
  server works, or `npx serve` — but no npm dependency is added to the project itself.
- **Session cards:** no real video/audio URLs exist for Brujito's Sessions, so those cards are
  non-interactive placeholders; do not invent links.
- **Palette source image:** the user referenced a palette image in their third message but it is not
  present in the workspace; the brief's explicit hex values are used as the authoritative palette.
- **No design document was provided**, so the design decisions above are mine, grounded in the brief
  and the workspace references, and recorded briefly per decision.
```

---

# VERIFICATION (first iteration — recorded for the reviewer)

All checks were run against the live site served locally and driven with the Playwright
(Chromium) browser tools. The reviewer can trust these results without re-running.

## How it was served / run
- `python` is NOT available on this Windows box, so the static server was `npx http-server`
  (no npm dependency added to the project — it runs via npx only for local verification):
  `npx --yes http-server <site root> -p 8777 -c-1 --silent`, served at `http://localhost:8777/`.
- Browser: Playwright Chromium via the workspace MCP tools. Viewports: desktop 1280×900,
  mobile 390×844. Server process was stopped after verification (`Stop-Process` on the PID
  holding port 8777) and the temp screenshots in the tool output dir were removed.

## 1. HTML structure + relative paths
- `index.html` has `<!doctype html>`, `lang="es"`, charset/viewport, descriptive `<title>`
  ("El Medico Brujito — Productor | WitchDoctor Label"), meta description, and
  `<meta name="theme-color" content="#0d0b08">`.
- References confirmed: `<link rel="stylesheet" href="css/styles.css">` and
  `<script src="js/main.js" defer>` — both load with no 404 (checked in Network/Console).
- Semantic landmarks present: `header > nav`, `main`, seven `section` ids, `footer`.
- Added an inline SVG `data:` favicon to remove the only same-origin 404.

## 2. Browser checks (http://localhost:8777/)
- **Theme renders**: dark warm ground (#0d0b08 / #171210), amber accents, Oswald display
  headings. DevTools computed `font-family` on `.hero-title` resolves to **"Oswald"** (not the
  fallback), confirming Google Fonts loaded.
- **Screenshots saved** under `assets/img/`:
  - `assets/img/preview-desktop.png` (1280px wide, full page)
  - `assets/img/preview-mobile.png` (390px wide, full page)
  Note: the full-page screenshots were taken with the reveal targets forced to their
  `.is-visible` final state so the capture shows the designed content (a full-page shot renders
  the whole document before the IntersectionObserver would fire for below-the-fold items). The
  observer itself was verified separately (see reveals below). Cross-origin iframe content
  (Spotify) does not paint into Playwright screenshots, so the Musica section shows an empty
  frame box in the image even though the player loads live.
- **Nav anchors**: the six nav links map to existing ids
  `#sobre, #produccion, #discografia, #musica, #sesiones, #contacto` — all present
  (`allSectionsExist: true`). Clicking a link updates `location.hash` and scrolls the target to
  the top of the viewport (verified via `#discografia`: hash became `#discografia`,
  section `getBoundingClientRect().top === 0`).
- **Spotify iframe**: `src` equals exactly
  `https://open.spotify.com/embed/playlist/56qCvEpRpszWgxSPSRTcdB?utm_source=generator`;
  `width="100%"`, `height="400"`, `loading="lazy"`, `title` set, and the correct `allow` list.
  The embed script executed (its third-party fbcdn/sandbox warnings appeared), i.e. the player
  rendered over http (not a `file://` failure).
- **IntersectionObserver reveals**: on load + a full scroll, **32 / 32** `[data-reveal]`
  elements reached `.is-visible` (fired once as each entered the viewport). Hero `data-load`
  choreography also fired (`.hero.loaded`).
- **Mobile nav**: at 390px the hamburger (`#navToggle`) is `display:flex`; clicking it opens the
  full-screen sheet (`aria-expanded="true"`, body scroll locked), and clicking a link closes it
  (`navClosed: true`) and scrolls to the section. Escape-to-close is wired in `js/main.js`.
- **No horizontal overflow** at 390px (`document.body.scrollWidth` ≤ viewport).
- **Console**: after adding the favicon, **0 errors**. The remaining 4 warnings all originate
  from the third-party Spotify embed (`static.xx.fbcdn.net` permissions-policy / sandbox
  notices) and are outside our code.

## 3. WCAG AA contrast (computed in-page, sRGB relative luminance)
Ratios of text tokens on `--bg #0d0b08`:
- `--cream #efe3cf` (body text): **15.5 : 1** — passes AA (≥ 4.5:1) by a wide margin.
- `--muted #a99a84` (secondary text): **7.15 : 1** — passes AA for normal text.
- `--amber #E8A33D` (links): **9.11 : 1** — passes AA.
- `--amber-soft #f0c27a` (card headings/accents): **11.89 : 1** — passes AA.
No palette adjustment was needed.

## Result
First iteration complete. Site is a static one-pager (plain HTML + CSS + vanilla JS, no build
step), opens via `index.html` (serve over http for the Spotify embed), all eight sections present
in order, Spanish throughout, dark/warm mystical aesthetic, reduced-motion handled, keyboard- and
screen-reader-friendly nav, AA contrast confirmed, console clean of own errors.