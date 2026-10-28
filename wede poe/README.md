# Kwacha Coffee Roasters — Website Project

WEDE5020 Portfolio of Evidence. A small-business website for Kwacha Coffee
Roasters, an independent Johannesburg specialty coffee roastery.

## Pages

- `index.html` — Home
- `about.html` — About Us
- `products.html` — Our Roasts
- `enquiry.html` — Order / wholesale enquiry with instant quote (Part 3)
- `contact.html` — Contact, map and general message form
- `faq.html` — FAQ

## Tech Stack

- HTML5
- CSS3 (mobile-first, responsive, CSS animations)
- Vanilla JavaScript (Part 3): accordion, tabs, lightbox, dynamic roast list, form validation, AJAX
- Leaflet 1.9.4 + OpenStreetMap tiles (interactive map)
- JSON data file (`data/products.json`)

## Design notes

The name "Kwacha" is a Bemba/Nyanja word meaning "it is dawn," and is also
the currency of Zambia and Malawi — two of the roastery's sourcing
countries. That double meaning drives the visual identity:

- **Colour** — roasted-bean charcoal (`#1C1712`), burnt copper (`#B4592B`)
  and dawn gold (`#C0973C`) on a warm stone paper background (`#E7E1D2`),
  rather than a generic light-cream-and-terracotta palette.
- **Type** — Fraunces (display, used for headings and italic accents) paired
  with Work Sans (body).
- **Recurring device** — an 8px "horizon band" gradient strip runs under the
  header on every page; the home page hero expands it into a small SVG
  illustration of the sun rising over layered highveld hills, standing in
  for photography until real roastery shots are available.
- **Layout** — the roast process on the home page is the only numbered
  sequence, since it's the only content that's actually sequential. Product
  and origin listings use editorial rows rather than a repeated card grid,
  and the FAQ page uses native `<details>`/`<summary>` accordions.
- **Motion** — kept deliberately narrow rather than scattered across every
  section. There's one orchestrated moment (the home hero plays an actual
  sunrise on load: the sun lifts into place, a glow blooms once, then the
  highveld ridgelines settle in after it) and one recurring cue (a single
  light sweeps the horizon band once per page load, echoing the same
  dawn-breaking idea on every page without repeating the full hero
  sequence). Everything else only moves in response to what someone does:
  the nav underline, the button press state, and the FAQ accordion, which
  now opens and closes with an animated height transition in `js/script.js`
  instead of snapping instantly. All of it is switched off automatically
  for anyone with `prefers-reduced-motion: reduce` set.

## Changelog

### Part 1
- Initial HTML file structure created (5 pages).
- Consistent header, navigation, and footer across all pages.

### Part 2
- Linked Google Fonts (Fraunces for headings, Work Sans for body text).
- Added CSS reset and base styles (colour scheme, box-sizing, base
  typography).
- Styled header/navigation using Flexbox, with a dark header and a
  horizon-gradient band as a recurring brand device.
- Built the home hero with Flexbox and an inline SVG dawn illustration in
  place of a stock photo.
- Rewrote copy across all five pages with specific, roastery-grounded
  content (sourcing countries, roast process, team roles) instead of
  placeholder text.
- Replaced the repeated card-grid pattern with an editorial row list
  (home, products) and a numbered sequence only where the content is
  genuinely sequential (roast process).
- Converted the FAQ page to a native accordion using `<details>`/`<summary>`.
- Styled the enquiry form with underline inputs instead of boxed fields.
- Added responsive breakpoints at 768px (tablet) and 480px (mobile).

### Part 3

**A. Changes made from Part 2 feedback**
- _Lecturer feedback goes here._ Add one entry per comment received on Part 2,
  in this form: **Feedback:** what was said. **Change:** what you edited and
  in which file. **Why:** how it improves the site.
- Self-review fixes made while preparing Part 3:
  - Added the missing `horizon-band` under the header on `index.html`, so the
    brand device now appears on every page as the Part 2 notes describe.
  - Removed the stale comment on `index.html` pointing at a deleted
    `images/README-images.txt` and deleted that placeholder file.
  - Replaced the placeholder-only imagery plan with real photos in
    `images/` (descriptive file names, thumbnails, `alt` text).
  - Added a skip-to-content link and `aria-current="page"` on the active
    navigation link.

- **Depth and polish pass:** added a raised "paper" look across the site:
  layered shadows, paper-grain texture and a dawn glow behind the page, a
  sticky header, raised cards for roasts, rows, forms, tabs and FAQ,
  3D-style buttons with press states, a tilted hero illustration, a
  rotated photo band on the home page, lifted gallery prints, and a
  scroll-reveal fade (`js/reveal.js`). Content stays visible without
  JavaScript, and all motion is disabled by `prefers-reduced-motion`.

- **"Life" pass:** hero sky now has twinkling stars, a drifting cloud, flying
  birds and a breathing sun; floating coffee beans drift behind the hero;
  the headline reveals word by word; the hero art and cards tilt toward the
  cursor with a moving highlight; a scroll-progress bar and compact sticky
  header; count-up numbers in a new "at a glance" band; a live "Open now /
  Closed" badge (Johannesburg time) and a next-roast-day readout; a spotlight
  that follows the cursor on the process band (`js/life.js`). All of it is
  skipped when the visitor has `prefers-reduced-motion` set.

- **Motion upgrade:**
  - **Page transitions:** a sunrise curtain wipes between pages (the full
    sun-rise intro plays once per session) (`js/motion.js`).
  - **Hero:** rotating sun rays, drifting mist and a gold-shimmer logo.
  - **Marquee:** a pause-on-hover ticker of origins and roast days.
  - **Roast cards:** animated five-bean roast meter and pop-in flavour chips,
    both driven from `data/products.json`.
  - **Tabs and process timeline:** the tab underline slides between tabs, and
    process steps light up as you scroll.
  - **Buttons and headings:** magnetic buttons with ripple, draw-in heading
    underlines and cascading card reveals.
  - **Extras:** a soft cursor glow, a bean-confetti burst when a quote or
    message succeeds, and an animated wave at the top of the footer.
  - **Reduced motion:** every effect above is switched off when the visitor
    has `prefers-reduced-motion` set, and nothing depends on JavaScript to
    stay readable.

**B. JavaScript enhancements**
- **Accordion** — FAQ `<details>` animates open/closed (`js/script.js`).
- **Tabs** — About page: "The name / Our story / The team" (`js/tabs.js`),
  with ARIA roles and Left/Right/Home/End keyboard support.
- **Gallery + lightbox (modal)** — About page "From the bar"; opens a dialog
  with caption, prev/next, Escape-to-close, focus trap and focus return
  (`js/lightbox.js`, CSS fade/scale transition).
- **Interactive map** — Contact page, Leaflet + OpenStreetMap: roastery
  marker with popup, 15 km delivery-area circle, and an optional "How far am
  I?" button using the Geolocation API (`js/map.js`).
- **Animations and transitions** — Part 2 sunrise/horizon keyframes kept;
  added list-entry, tab-panel, gallery-zoom and lightbox transitions. All are
  disabled by the global `prefers-reduced-motion` rule.
- **Advanced DOM manipulation** — roast cards are built with
  `createElement`, `DocumentFragment` and `replaceChildren` (no `innerHTML`
  with user data); lightbox is created and removed from the DOM on demand.
- **Dynamic content** — `js/data.js` loads `data/products.json` with
  `fetch()` (AJAX); `js/products.js` renders the roast list.
- **Search, filter and sort** — Our Roasts page: live text search across
  name/origin/process/notes, roast-level filter, sort by name, price or
  altitude, result count announced to screen readers, Reset button.

**C. Forms (`js/forms.js`)**
- `enquiry.html` — name, email, SA phone number, enquiry type, roast,
  quantity (1–100), grind, collection/delivery, notes. Validated input
  produces an instant quote (subtotal, 15% wholesale discount from 10 bags,
  R60 delivery under R400) and an availability message based on stock.
  Arriving from "Enquire" on a roast pre-selects it (`?roast=`).
- `contact.html` — name, email, optional phone, message type, subject,
  message (20–600 characters, live counter). Valid messages are sent by AJAX
  and compiled into a `mailto:` link addressed to
  `hello@kwachacoffee.co.za`; if the request fails the visitor still gets
  the email link.
- Validation: HTML5 attributes (`required`, `type`, `min`, `max`,
  `maxlength`) plus JavaScript rules (name characters, email format, South
  African phone pattern, integer quantity, length limits). Errors show inline
  under each field (`role="alert"`, `aria-invalid`), validated on blur and
  re-checked as the visitor types.
- Note: the AJAX endpoint is a public demo (`jsonplaceholder.typicode.com`)
  that echoes data back. Swap `AJAX_ENDPOINT` in `forms.js` for a real form
  service before relying on it. Roast stock levels in `products.json` are
  sample data.

**D. SEO**
- **Keyword research** — target phrases: _specialty coffee Johannesburg_,
  _coffee roaster Brixton_, _single origin coffee_, _fresh roasted coffee
  delivery_, plus origin terms (Malawi, Zambia, Magoebaskloof). Used in
  titles, H1/H2s, intro copy and image alt text.
- **Titles and meta descriptions** — unique `<title>` and
  `<meta name="description">` per page; canonical URLs; Open Graph and
  Twitter card tags.
- **Headers** — one `<h1>` per page, `<h2>`/`<h3>` in order.
- **Images** — descriptive file names (e.g. `swan-latte-art-top-view.jpg`),
  alt text, width/height set, `loading="lazy"` on gallery images.
- **URLs** — short, lowercase, descriptive file names.
- **Internal linking** — descriptive anchor text between Home, About,
  Roasts, Enquiry, Contact and FAQ; footer links.
- **Mobile-friendly** — viewport meta, responsive breakpoints from Part 2,
  new components tested at the same breakpoints.
- **Structured data** — JSON-LD `CafeOrCoffeeShop` (address, geo, opening
  hours) on the home page and `FAQPage` on the FAQ page (local SEO).
- **Local SEO** — Brixton/Johannesburg in titles, copy, schema and the map;
  plan: create a Google Business Profile with the same name, address and hours.
- **Off-page plan** — backlinks: ask Johannesburg cafés we supply to link to
  the roast list, and submit to local food/coffee directories; social: share
  pages with the included Open Graph previews on Instagram and Facebook.
- **`robots.txt`** and **`sitemap.xml`** added (see Deployment note).
- **Page speed** — resized and compressed JPEGs with thumbnails, deferred
  scripts, preconnect for fonts, no framework, one small CSS file.
- **Security** — Content-Security-Policy meta tag limiting scripts, styles,
  fonts, images and connections to known origins; `referrer` policy;
  `object-src 'none'`; DOM built with `textContent`; no inline scripts;
  input validated on the client (a server must re-validate in production).

**E. Deployment**
- Publish with GitHub Pages (Settings → Pages → deploy from `main`). The
  `canonical`, `sitemap.xml` and Open Graph URLs assume
  `https://km1211266-eng.github.io/Wede-but-better/kwacha-coffee-roasters/`
  — change them if your final URL differs. `robots.txt` is only read from a
  domain root, so for a project page it is served for reference; it works
  fully on a custom domain or Netlify.

## References

American Heritage Dictionary (2022) *Kwacha*. 5th edn. Boston: HarperCollins
Publishers. Available at: https://www.ahdictionary.com/word/search.html?q=kwacha
(Accessed: 18 September 2026).

Google Fonts (no date) *Fraunces*. Available at:
https://fonts.google.com/specimen/Fraunces/about (Accessed: 18 September
2026).

Google Fonts (no date) *Work Sans*. Available at:
https://fonts.google.com/specimen/Work+Sans/about (Accessed: 18 September
2026).

Merriam-Webster (no date) *Kwacha*. Available at:
https://www.merriam-webster.com/dictionary/kwacha (Accessed: 18 September
2026).

Mozilla Developer Network (no date) *&lt;details&gt;: The Details disclosure
element*. Available at:
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details (Accessed:
18 September 2026).

Leaflet (2023) *Leaflet: an open-source JavaScript library for interactive
maps*, v1.9.4. Available at: https://leafletjs.com (Accessed: 15 October
2026).

OpenStreetMap contributors (no date) *OpenStreetMap*. Available at:
https://www.openstreetmap.org/copyright (Accessed: 15 October 2026).

Google Search Central (no date) *SEO starter guide*. Available at:
https://developers.google.com/search/docs/fundamentals/seo-starter-guide
(Accessed: 15 October 2026).

Mozilla Developer Network (no date) *Content Security Policy (CSP)*.
Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
(Accessed: 15 October 2026).

Mozilla Developer Network (no date) *Fetch API*. Available at:
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 15
October 2026).

Schema.org (no date) *CafeOrCoffeeShop*. Available at:
https://schema.org/CafeOrCoffeeShop (Accessed: 15 October 2026).

W3C (no date) *ARIA Authoring Practices Guide: Tabs pattern*. Available at:
https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ (Accessed: 15 October 2026).

Mozilla Developer Network (no date) *CSS animations*. Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations (Accessed:
18 September 2026).

Mozilla Developer Network (no date) *prefers-reduced-motion*. Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
(Accessed: 18 September 2026).

South African History Online (2013) *28 August 1970 — Malawi replaces the
Malawian pound with the Kwacha*. Available at:
https://sahistory.org.za/node/96343 (Accessed: 18 September 2026).

W3C Web Accessibility Initiative (2023) *Understanding Success Criterion
2.3.3: Animation from Interactions*. Available at:
https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
(Accessed: 18 September 2026).

All page copy, roast/origin details, pricing and team descriptions are
original content written for this project and are not drawn from an
external source.
