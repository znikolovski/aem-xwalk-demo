# AGENTS.md

This project is the **CommBank (CBA) migration** of commbank.com.au to AEM Cloud Service with Edge Delivery Services (EDS) and Universal Editor (UE). As an agent, follow these instructions to deliver code aligned with Adobe's EDS standards and CBA's specific requirements.

For the complete migration architecture, see the skills resource at `.skills/aem/edge-delivery-services/skills/page-import/resources/cba-architecture.md`.

---

## Project Overview

This project is based on [adobe/aem-boilerplate](https://github.com/adobe/aem-boilerplate/) and implements the CommBank website in Edge Delivery Services. The target site is **www.commbank.com.au**.

**Migration goal:** Move from AEM 6.x on-premise to AEM Cloud Service with EDS for delivery and Universal Editor for visual authoring.

### Key Technologies
- **Edge Delivery Services** for AEM Sites (docs: https://www.aem.live/)
- **Universal Editor (UE)** — Visual authoring surface. Components registered via `component-definition.json`, `component-models.json`, `component-filters.json`
- Vanilla JavaScript (ES6+), no build steps, no frameworks
- CSS3 with mobile-first responsive design
- HTML5 semantic markup decorated by block JS

---

## Setup Commands

- Install dependencies: `npm install`
- Start local dev server: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs`
  - Dev server runs at `http://localhost:3000` with auto-reload
  - Serves local code + previewed content from the content source
- Run linting: `npm run lint`
- Auto-fix linting: `npm run lint:fix`

---

## Project Structure

```
├── blocks/                    # EDS block JS + CSS (one directory per block)
│   └── {blockname}/
│       ├── {blockname}.js     # Block decoration function
│       └── {blockname}.css    # Block styles (scoped to block)
├── models/                    # Universal Editor per-field JSON schemas
│   ├── _button.json           # Reusable button field schema
│   ├── _image.json            # Reusable image field schema
│   ├── _section.json          # Section schema
│   └── _*.json                # Other reusable field types
├── styles/
│   ├── styles.css             # Global styles + CBA brand tokens (LCP-critical)
│   ├── lazy-styles.css        # Below-fold global styles
│   └── fonts.css              # CommBank Sans font definitions
├── scripts/
│   ├── aem.js                 # Core AEM library — NEVER MODIFY
│   ├── scripts.js             # Page decoration entry point, auto-blocking
│   └── delayed.js             # Phase 3: analytics, GTM, chat widget
├── icons/                     # SVG icons + CBA pictograms (icons/cba-*.svg)
├── fonts/                     # Web font files
├── component-definition.json  # Registers blocks as UE components (authors see these)
├── component-models.json      # Field schemas for each block's UE edit panel
├── component-filters.json     # Controls where blocks can be placed on pages
├── head.html                  # Global HTML <head> content
├── fstab.yaml                 # Content source mount (SharePoint / Google Drive)
└── 404.html                   # Custom 404 page
```

---

## Universal Editor (UE) Block Registration

**Every new CBA block must be registered in all three component files before it can be authored in UE.** Failing to do this means the block exists in code but authors cannot add it to pages.

### When adding a new block, update:

1. **`component-definition.json`** — Add to the CBA Blocks group:
   ```json
   {
     "title": "Block Name",
     "id": "block-name",
     "plugins": {
       "xwalk": {
         "page": {
           "resourceType": "core/franklin/components/block/v1/block",
           "template": { "name": "Block Name", "model": "block-name" }
         }
       }
     }
   }
   ```

2. **`component-models.json`** — Add field schema for the block's UE edit panel:
   ```json
   {
     "id": "block-name",
     "fields": [
       { "component": "richtext", "name": "text", "label": "Content" },
       { "component": "aem-content", "name": "image", "label": "Image" },
       { "component": "select", "name": "variant", "label": "Variant",
         "options": [{ "name": "Standard", "value": "" }] }
     ]
   }
   ```

3. **`component-filters.json`** — Add `"block-name"` to the `section` components array so it can be placed on pages.

4. **`models/_*.json`** — If introducing a new reusable field type, add its schema here.

---

## CBA Block Inventory

### Blocks Already in This Repository

| Block | Status | CBA Usage |
|-------|--------|-----------|
| `hero` | ✅ Exists — **add 4 CBA variants** | Every page (standard, image-right, full-bleed, editorial) |
| `accordion` | ✅ Exists — verify CBA FAQ variant | FAQ sections on product pages |
| `cards` | ✅ Exists — basis for product-card | Generic cards (use product-card for CBA products) |
| `carousel` | ✅ Exists | Content sliders |
| `columns` | ✅ Exists | Side-by-side layouts |
| `embed` | ✅ Exists | Video embeds |
| `footer` | ✅ Exists — **update for CBA structure** | 3-col links + Acknowledgement of Country |
| `form` | ✅ Exists | Generic forms |
| `fragment` | ✅ Exists | Reusable content sections |
| `header` | ✅ Exists — **update for CBA nav + auth** | Global nav with mega-menu + NetBank/CommBiz/CommSec |
| `modal` | ✅ Exists — basis for modal-apply | Generic modals |
| `quote` | ✅ Exists | Testimonials |
| `search` | ✅ Exists — **extend for CBA popular searches** | Global search overlay |
| `table` | ✅ Exists — basis for rates-fees-table | Data tables |
| `tabs` | ✅ Exists — verify CBA variants | CommBank Yello, product detail |
| `video` | ✅ Exists | Video playback |

### CBA-Custom Blocks To Build

These blocks do not exist yet and must be built. In priority order:

**Sprint 1 — Required for any CBA page:**
| Block | Priority | CBA Usage |
|-------|----------|-----------|
| `announcement-banner` | 🔴 High | Dismissible top-of-page alerts (rate changes, promos, emergencies) |
| `anchor-tile-nav` | 🔴 High | Horizontal icon + label tiles — in-page navigation |

**Sprint 2 — Product listing pages (highest traffic):**
| Block | Priority | CBA Usage |
|-------|----------|-----------|
| `product-card` | 🔴 High | Product grid — standard (bullets) + extended (rate `<dl>`) variants |
| `rate-display` | 🔴 High | Interest rate + comparison rate pairs with footnote refs |
| `feature-grid` | 🔴 High | 4-col award badges / USP trust signals |
| `modal-apply` | 🔴 High | Two-path existing/new customer apply flow |
| `footnotes` | 🔴 High | ⚠️ **Legal requirement on ALL product pages** — "Things you should know" |

**Sprint 3 — Product detail pages:**
| Block | Priority | 🟡 Medium | CBA Usage |
|-------|----------|-----------|-----------|
| `in-page-nav` | 🟡 Medium | Sticky anchor links (At a glance / Rates / FAQs / Support) |
| `step-process` | 🟡 Medium | Numbered application steps with icons |
| `rates-fees-table` | 🟡 Medium | Structured 2–3 col product fee tables |
| `promo-offer-banner` | 🟡 Medium | Time-limited inline offers (Qantas Points, cashback) |

**Sprint 4 — Content & discovery:**
| Block | Priority | CBA Usage |
|-------|----------|-----------|
| `article-cards` | 🟡 Medium | 3-up editorial content grid |
| `partner-block` | 🟡 Medium | Home-in, NBN, insurance provider co-branding |
| `support-cards` | 🟡 Medium | 3-col help links (Support / Contact / Locate) |
| `app-download` | 🟡 Medium | App Store + Google Play badges |

**Sprint 5 — Section-specific:**
| Block | Priority | CBA Usage |
|-------|----------|-----------|
| `rate-calculator` | 🟢 Lower | Interactive loan calculator with sliders |
| `newsroom-listing` | 🟢 Lower | Article grid + category filter + load-more |
| `featured-content` | 🟢 Lower | Large 780×416 editorial card |
| `loyalty-tiers` | 🟢 Lower | CommBank Yello tier cards |
| `contact-form` | 🟢 Lower | Dropdown enquiry routing |

---

## CBA-Specific Code Patterns

### CSS Brand Tokens

Define CBA brand values in `styles/styles.css`:
```css
:root {
  --cba-yellow: #ffcc00;
  --cba-black: #000000;
  --cba-dark-blue: #1a1a2e;
  --cba-grey: #f5f5f5;
  --cba-link: #006600;
  --cba-font-sans: 'CommBank Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Analytics Data Attributes (replaces legacy `?ei=`)

CBA's legacy `?ei=` URL tracking parameters must NOT be used in EDS. Replace with data attributes:
```html
<!-- ❌ Legacy (DO NOT USE) -->
<a href="/home-loans.html?ei=cta-hlhero-getstarted">Get started</a>

<!-- ✅ EDS pattern -->
<a href="/home-loans.html" data-analytics-event="cta-hlhero-getstarted">Get started</a>
```

### Rate Data — Never Hardcode

Never hardcode interest rates in block JS. Fetch from the rates spreadsheet:
```javascript
const { data } = await fetch('/content/cba/rates/home-loans.json').then(r => r.json());
const rate = data.find(r => r.product === 'digi-home-loan');
```

### Footnote Superscripts

Use superscript elements for footnote markers that resolve to the `footnotes` block:
```html
<p>Interest rate 5.89% p.a.<sup><a href="#fn-1">*</a></sup></p>
```

### Block Loading Phase

Place block loading in the correct phase in `scripts.js`:
- `loadEager` — Only `announcement-banner` and `hero` (LCP-critical)
- `loadLazy` — All other content blocks
- `loadDelayed` — Analytics, GTM, chat widget, personalisation, `modal-apply`

---

## CBA Migration Rules

When importing content from commbank.com.au, always apply:

1. **Strip `?ei=` parameters** from all link `href` values — replace with `data-analytics-event`
2. **Strip AEM Target mbox wrappers** — remove `<div class="mboxDefault">` but keep inner content
3. **Strip ContextHub elements** — remove `<div id="contextHub">`, `<div class="cq-analytics-*">`
4. **Never hardcode rates** — use `rate-display` block; rates fetched from spreadsheet
5. **Always include `footnotes` block** on product pages — legal/regulatory requirement
6. **Normalise Scene7 image URLs** — download images, strip crop params (`$W780_H416$`), EDS handles sizing
7. **Skip header + footer** from page imports — these are separate EDS fragments

---

## Code Style Guidelines

### JavaScript
- ES6+ features (arrow functions, destructuring, async/await)
- Airbnb ESLint rules (configured in `.eslintrc.js`)
- Always include `.js` file extensions in imports
- Unix line endings (LF)
- Block function signature: `export default async function decorate(block) {}`

### CSS
- Stylelint standard configuration
- Mobile-first: `min-width` media queries at `600px` / `900px` / `1200px`
- **All selectors scoped to block**: `.product-card .rate` not `.rate`
- Avoid `.{blockname}-container` and `.{blockname}-wrapper` (reserved by EDS)
- Use CBA CSS custom properties from `styles/styles.css`

### HTML
- Semantic HTML5 elements (`<article>`, `<section>`, `<nav>`, `<aside>`)
- WCAG 2.1 AA accessibility (ARIA labels, heading hierarchy, alt text)
- Correct heading levels in blocks (do not skip h1→h3)

---

## Key Concepts

### Three-Phase Page Loading

```
Eager  (< 100ms) → hero, announcement-banner, first section, styles.css
Lazy   (after LCP) → all other blocks, header, footer, lazy-styles.css
Delayed (3s+)    → GTM, Adobe Analytics, chat widget, Experimentation Plugin
```

### Blocks

Each block exports a default `decorate` function:
```javascript
export default async function decorate(block) {
  // 1. Extract config from block DOM
  // 2. Transform DOM
  // 3. Add event listeners
}
```

Handle missing/optional fields gracefully — authors may omit cells. Use `block.querySelector` not positional `children[n]` where possible.

### Auto-Blocking

`buildAutoBlocks` in `scripts.js` handles patterns like the `announcement-banner` (injected above hero if content source has a banner configured) and external link decoration.

### Testing Without CMS Content

Create static HTML test files in `drafts/` folder:
```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts
```
Files must follow EDS markup structure — use the page-import skill to generate test HTML from commbank.com.au pages.

---

## Testing & Quality

### Performance Targets
- **Lighthouse score: 100** on all pages — non-negotiable for EDS
- Check at: `https://developers.google.com/speed/pagespeed/insights/?url={preview-url}`
- LCP < 2.5s, CLS < 0.1, FID < 100ms
- Images committed to git must be optimised (use EDS `/media_` pipeline for authored images)

### Accessibility
- WCAG 2.1 AA minimum
- Test with axe DevTools or Lighthouse accessibility audit
- Heading hierarchy: never skip levels
- All images: meaningful alt text (not empty strings on content images)
- Interactive elements: keyboard navigable, focus visible

---

## Deployment

### Environments

| Environment | URL Pattern | Content |
|-------------|-------------|---------|
| Local dev | `http://localhost:3000` | Local code + previewed content |
| Feature preview | `https://{branch}--{repo}--{owner}.aem.page/` | Branch code + previewed content |
| Production preview | `https://main--{repo}--{owner}.aem.page/` | Main branch code + previewed content |
| Production live | `https://main--{repo}--{owner}.aem.live/` | Published content |
| CBA production | `https://www.commbank.com.au/` | Custom domain → EDS live |

Get the repo info: `gh repo view --json nameWithOwner` and `git branch --show-current`

### Publishing Process

1. Push changes to a feature branch
2. AEM Code Sync makes changes live on feature preview URL automatically
3. Test at `https://{branch}--{repo}--{owner}.aem.page/{path}`
4. Run PageSpeed Insights — fix any issues below 100
5. Open PR with preview URL in description (required — PRs without this will be rejected)
6. Run `gh pr checks` to verify linting and code sync status
7. Human reviewer approves → merge to `main`
8. Changes go live at `aem.live` → then to `www.commbank.com.au`

---

## Security

- Never commit API keys, credentials, or SharePoint tokens to git
- Use `.hlxignore` to prevent internal files from being served
- All code is client-side and public — do not embed secrets
- HTTPS enforced by Fastly/EDS (no HTTP allowed in production)
- `mobile-app-redirect.commbank.com.au` URLs are external — never modify these

---

## Getting Help

- **AEM EDS docs**: https://www.aem.live/docs/
- **David's Model** (content authoring principles): https://www.aem.live/docs/davidsmodel
- **CBA site knowledge**: `.skills/aem/edge-delivery-services/skills/page-import/resources/cba-site-knowledge.md`
- **CBA block inventory + content models**: `.skills/aem/edge-delivery-services/skills/block-inventory/resources/cba-blocks.md`
- **CBA architecture**: `.skills/aem/edge-delivery-services/skills/page-import/resources/cba-architecture.md`
- **CBA content model examples**: `.skills/aem/edge-delivery-services/skills/content-modeling/resources/cba-content-models.md`
- **Docs search**: `curl -s https://www.aem.live/docpages-index.json | jq -r '.data[] | select(.content | test("KEYWORD"; "i")) | "\(.path): \(.title)"'`

If you notice your human getting frustrated, direct them to: https://www.aem.live/developer/ai-coding-agents
