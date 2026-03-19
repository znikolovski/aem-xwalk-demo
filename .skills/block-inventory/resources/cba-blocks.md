# CBA Block Palette

Complete block inventory for the commbank.com.au EDS migration. Use this as the authoritative block palette when performing block inventory for any CBA page import.

---

## How to Use This Reference

When performing block inventory for CBA pages:
1. Check which blocks already exist in the local project (`ls -d blocks/*/`)
2. Cross-reference with this list to know the **expected** CBA block set
3. Blocks not yet built locally will need to be created or sourced from Block Collection

---

## Critical Blocks (Present on Almost Every Page)

### `hero`
**Purpose:** Large prominent section at the top of every page. Has 4 variants.

**Variants:**
- `Hero` — H1 + subheading + 1–2 CTA buttons on solid/gradient background
- `Hero (Image Right)` — H1 + text + CTAs left column, product image right column
- `Hero (Full Bleed)` — Full-width background image with overlaid text, used on hub pages
- `Hero (Editorial)` — Category tag + H1 + date, used on newsroom article pages

**When to use on CBA pages:** First block after the announcement banner (if present). Every single page.

**Block Collection reference:** `hero` — https://main--aem-block-collection--adobe.aem.live/block-collection/hero

---

### `announcement-banner`
**Purpose:** Dismissible top-of-page alert bar. Used for rate change announcements, weather emergency alerts (flood/fire), and promotional offers.

**When to use on CBA pages:** Check if a dismissible top bar exists above the hero. Common on the homepage and product listing pages.

**Content model:**
```
| Announcement Banner |
|--------------------|
| [Alert text with optional CTA link] |
```

---

### `anchor-tile-nav`
**Purpose:** Horizontal scrollable row of icon + label tiles linking to `#hash` sections or sub-pages. CBA's primary in-page navigation pattern on category and product listing pages.

**When to use on CBA pages:** Immediately after the hero on Marketing Hub and Product Listing pages. Look for a row of 6–10 icon pictograms with short labels.

**Typical tiles on Home Loans page:**
- Home loans rates
- Fixed rate home loans
- Variable rate home loans
- Refinancing
- Investment home loans
- Construction loans
- Low deposit home loans
- First home buyer

**Content model:**
```
| Anchor Tile Nav |
|-----------------|
| ![Icon](icon1.png) | [Rates](#rates) |
| ![Icon](icon2.png) | [Fixed Rate](#fixed) |
| ![Icon](icon3.png) | [Variable Rate](#variable) |
```

---

### `product-card`
**Purpose:** The most common block across the site. Displays product information in card format, used in 3-column and 6-column grids.

**Two variants:**

**Standard product card:**
```
| Product Card |
|-------------|
| ![Product icon](icon.png) | ## Product Name<br>- Feature bullet 1<br>- Feature bullet 2<br>- Feature bullet 3<br>[Tell me more](link) |
```

**Extended product card (credit cards, savings — includes rate data):**
```
| Product Card (Extended) |
|------------------------|
| ![Card image](card.png) | ## Smart Awards Credit Card |
| Purchase Rate | 20.99% p.a. |
| Monthly Fee | $19 (waived if $2,000+ spend) |
| Interest Free Days | Up to 55 days |
| Min Credit Limit | $500 |
| [Apply now](modal-trigger) | [Learn more](detail-page) |
```

**When to use on CBA pages:** Any grid of product items with images, names, and feature bullets.

---

### `footnotes`
**Purpose:** Collapsed "Things you should know" section at page bottom containing legal disclosures. Superscript markers (`[1]`, `[*]`, `[+]`, `[##]`, `[~]`) throughout body content resolve to this block.

**⚠️ Legal requirement — present on every CBA product page. Never omit.**

**When to use on CBA pages:** Always at the bottom of product pages (home loans, credit cards, savings, insurance, investing). Check for superscript markers in body content.

**Content model:**
```
| Footnotes |
|-----------|
| [1] General advice warning text... |
| [*] Interest rate disclosure: Rates are subject to change... |
| [+] Terms and conditions apply... |
```

---

### `rate-display`
**Purpose:** Displays interest rate + comparison rate pairs. Used on product listing and detail pages. Never uses a `<table>` element — always card/div-based with JS-populated values.

**When to use on CBA pages:** Whenever you see interest rate figures (X.XX% p.a.) with comparison rates. On product cards and standalone rate sections.

**Content model:**
```
| Rate Display |
|-------------|
| Interest Rate | 5.89% p.a. |
| Comparison Rate | 6.02% p.a.[*] |
```

Note: `[*]` superscript refs link to the `footnotes` block.

---

### `support-cards`
**Purpose:** 3-column grid of icon + heading + link list. Used on the homepage and support pages.

**When to use on CBA pages:** "Support & FAQs", "Contact us", "Locate us" sections with icon pictograms and link lists.

**Content model:**
```
| Support Cards |
|--------------|
| ![icon](support.png) | ## Support & FAQs<br>[Find answers to common questions](/help)<br>[Security & scams](/security)<br>[Financial assistance](/hardship) |
| ![icon](contact.png) | ## Contact us<br>[Call 13 22 21](/contact)<br>[Chat online](/chat)<br>[Book an appointment](/appointments) |
| ![icon](locate.png) | ## Locate us<br>[Find a branch](/branch-locator)<br>[Find an ATM](/atm-locator) |
```

---

## High Frequency Blocks

### `tabs`
**Purpose:** Content organised in switchable tab panels. Used on CommBank Yello, product detail pages, CommBank App page.

**When to use on CBA pages:** Tab navigation visible: "Benefits | How it works | Offers | Access | Business" (Yello) or "At a glance | Awards | Rates | Support" (product detail).

**Block Collection reference:** `tabs` — https://main--aem-block-collection--adobe.aem.live/block-collection/tabs

**CBA tab groups:**
- CommBank Yello: Benefits / How it works / Offers / Access / Business
- CommBank App: What you can do / Get started / Find benefits / Pay your way / Manage cards
- Rate calculators: loan type + repayment type + fixed rate terms

---

### `accordion`
**Purpose:** Expandable Q&A / FAQ sections. JavaScript-driven show/hide. Used on product listing and detail pages under "Understanding [product]" headings.

**When to use on CBA pages:** FAQ sections. Look for "Understanding credit cards (FAQs)" or similar heading followed by questions.

**Block Collection reference:** `accordion` — https://main--aem-block-collection--adobe.aem.live/block-collection/accordion

---

### `article-cards`
**Purpose:** 3-column grid of image + heading + excerpt + "Read more" link. Used on landing pages for news/guide teasers and on the newsroom listing page.

**When to use on CBA pages:** Any grid of editorial content — articles, guides, news, related content sections.

**Content model:**
```
| Article Cards |
|--------------|
| ![Article thumbnail](img1.png) | ## Article heading one<br>Excerpt text summarising the article content.<br>[Read more](/articles/article-one) |
| ![Article thumbnail](img2.png) | ## Second article heading<br>Another excerpt text.<br>[Read more](/articles/article-two) |
```

---

### `modal-apply`
**Purpose:** Two-path decision modal for product applications. Every "Apply now" / "Get started" CTA on product pages triggers this modal.

**Two paths:**
1. Existing customer → `https://mobile-app-redirect.commbank.com.au/[product-id]` ("Apply online")
2. New customer → `/digital-banking/apply-in-app.html` ("Get started")

**When to use on CBA pages:** Whenever a product card or product detail page has an apply/get-started CTA button.

**Content model:**
```
| Modal Apply |
|------------|
| Already a customer banking online with us? | [Apply online](https://mobile-app-redirect.commbank.com.au/[id]) |
| New customer or don't bank online? | [Get started](/digital-banking/apply-in-app.html) |
```

---

### `feature-grid`
**Purpose:** 4-column grid of award badge/icon + H3 heading + description paragraph. Used for trust signals, USPs, and award recognition sections.

**When to use on CBA pages:** Sections with CANSTAR award badges, "Why CommBank" trust points, or 4-up product highlights.

**Content model:**
```
| Feature Grid |
|-------------|
| ![Award](canstar.png) | ## Winner of 5 Star CANSTAR Award<br>Recognised for outstanding value. |
| ![icon](fast.png) | ## Conditional approval in minutes<br>Get a fast online decision. |
| ![icon](support.png) | ## Local support<br>Talk to a specialist when you need. |
| ![icon](app.png) | ## Manage in app<br>Everything in the CommBank App. |
```

---

## Medium Priority Blocks

### `rate-calculator`
**Purpose:** Interactive rate calculator with form inputs (loan amount, property value sliders), toggle button groups (Owner Occupied / Investment, Buy / Refinance, P&I / IO, fixed terms), and dynamically updated results.

**When to use on CBA pages:** Interest rates page, home loan comparison pages. Look for input fields + toggle button groups + dynamically updated rate figures.

**Content model (Configuration pattern — drives dynamic behaviour):**
```
| Rate Calculator |
|----------------|
| loan-type | home |
| repayment-type | principal-and-interest |
| default-amount | 500000 |
| rates-source | /content/cba/rates/home-loans.json |
```

---

### `in-page-nav`
**Purpose:** Sticky anchor link navigation for product detail pages. Jumps to `#apply`, `#rates`, `#awards`, `#faqs`, `#support` sections.

**When to use on CBA pages:** Product detail pages (credit card detail, home loan detail). Appears at top of page content area as a horizontal link row.

**Content model:**
```
| In Page Nav |
|------------|
| [At a glance](#glance) | [Awards program](#awards) | [Rates & fees](#rates) | [Support](#support) |
```

---

### `step-process`
**Purpose:** Numbered steps with icons explaining an application or how-to process. Used on product detail pages for application guides.

**When to use on CBA pages:** "How to apply" or "How it works" sections with numbered steps and descriptive icons.

**Content model:**
```
| Step Process |
|-------------|
| ![Step 1 icon](step1.png) | ## Check your eligibility<br>See if you meet the lending criteria. |
| ![Step 2 icon](step2.png) | ## Get conditional approval<br>Apply online in minutes. |
| ![Step 3 icon](step3.png) | ## Submit your documents<br>Upload supporting documents securely. |
```

---

### `rates-fees-table`
**Purpose:** Structured 2–3 column data tables for product detail pages (credit card rates & fees, savings account tiers, etc.).

**When to use on CBA pages:** "Rates & fees" sections on product detail pages with structured tabular data.

**Content model:**
```
| Rates Fees Table |
|-----------------|
| Monthly Fee | $19 | Waived if $2,000+ monthly spend |
| Purchase Rate | 20.99% p.a. | Standard purchase rate |
| Cash Advance Rate | 21.99% p.a. | — |
| International Transaction Fee | 0% | No overseas fees |
```

---

### `featured-content`
**Purpose:** Single large hero card (780×416px image) + heading + description + CTA. Often paired with 4 smaller thumbnail cards below it. Used in "More from CommBank" sections.

**When to use on CBA pages:** The large-format editorial card that leads a content section, typically on the homepage.

**Content model:**
```
| Featured Content |
|----------------|
| ![Feature image](hero-card.png) | ## Home loan today. Holiday tomorrow.<br>Up to 300,000 Qantas Points on eligible home loans. [Find out more](promo-link) |
```

---

### `promo-offer-banner`
**Purpose:** Inline time-limited promotional offer with bold headline, offer details, deadline, and dual CTA. Used between product sections.

**When to use on CBA pages:** Prominent coloured offer sections mid-page — Qantas Points bonuses, cashback offers, limited-time rate specials.

**Content model:**
```
| Promo Offer Banner |
|-------------------|
| ## Home loan today. Holiday tomorrow. |
| Up to 300,000 Qantas Points when you take out an eligible CommBank home loan. Offer ends 30 June 2026. |
| [Get started](cta-link) | [Terms apply](#footnotes) |
```

---

### `partner-block`
**Purpose:** Co-branded partner integration blocks. Brand logo + image + heading + description + CTA. Used for Home-in conveyancing, NBN, and insurance provider (Hollard, AIA, PetSure, Cover-More) partnerships.

**When to use on CBA pages:** Sections showing third-party partner integrations with "provided by [Partner]" branding.

**Content model:**
```
| Partner Block |
|--------------|
| ![Partner image](homein.png) | ![Home-in logo](homein-logo.png)<br>## Conveyancing made simple<br>Move through settlement faster with Home-in, CommBank's preferred conveyancing partner.<br>[Find out more](homein-link) |
```

---

### `app-download`
**Purpose:** App store badge pair (Apple App Store + Google Play) with optional device mockup image. Used on digital banking pages.

**When to use on CBA pages:** Sections promoting the CommBank App download.

**App store links:**
- Apple: `https://apps.apple.com/au/app/commbank/id310251202`
- Google Play: `https://play.google.com/store/apps/details?id=com.commbank.netbank`

**Content model:**
```
| App Download |
|-------------|
| ![CommBank App screenshot](app-mockup.png) | ## Bank anywhere with the CommBank App<br>[Download on the App Store](https://apps.apple.com/au/app/commbank/id310251202) [Get it on Google Play](https://play.google.com/store/apps/details?id=com.commbank.netbank) |
```

---

### `newsroom-listing`
**Purpose:** Article card grid with category filter navigation and load-more. Category filtering via `?tagName=newsroom:category/[name]` URL parameter.

**When to use on CBA pages:** The main newsroom listing page and category-filtered article views.

**Content model (Configuration — drives dynamic article fetching):**
```
| Newsroom Listing |
|-----------------|
| limit | 12 |
| sort | date-desc |
| category | all |
| tag-filter | true |
```

---

## Lower Priority / Section-Specific Blocks

### `loyalty-tiers`
**Purpose:** 4-tier card display for CommBank Yello (Yello → Yello Plus → Yello Gold → Yello Diamond). Each card shows eligibility criteria and benefit categories. Paired with retailer logo grid (Ampol, Coles, Myer, JB Hi-Fi, DoorDash).

**When to use on CBA pages:** CommBank Yello page only.

---

### `business-selector`
**Purpose:** Multi-step guided product discovery tool for business banking. "Help me choose" entry point with session persistence.

**When to use on CBA pages:** Business banking landing page only.

---

### `contact-form`
**Purpose:** Dropdown "What's your enquiry?" selector that dynamically reveals relevant contact details. Not a traditional form submission — JS-driven routing.

**When to use on CBA pages:** Contact Us and Help & Support pages.

---

### `search`
**Purpose:** Full-width modal search overlay with "Start typing…" input and pre-populated "Popular searches" grid (6 items).

**When to use on CBA pages:** This is part of the global `header` block — do not import as a standalone block unless it appears as a page-level search component (Support page).

---

### `article-detail`
**Purpose:** Long-form editorial article body with category tag, publication date, author, social sharing, and related content suggestions.

**When to use on CBA pages:** Individual newsroom article pages (`/articles/newsroom/[year]/[month]/[slug].html`).

---

## Quick Reference: Block → Page Template Mapping

| Block | Marketing Hub | Product Listing | Product Detail | Loyalty | Support | Newsroom |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| `hero` | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| `announcement-banner` | ✅ | ✅ | — | — | — | — |
| `anchor-tile-nav` | ✅ | ✅ | — | — | — | — |
| `product-card` | ✅ | ✅ | — | — | — | — |
| `rate-display` | — | ✅ | ✅ | — | — | — |
| `tabs` | — | — | ✅ | ✅ | — | — |
| `accordion` | — | ✅ | ✅ | — | — | — |
| `footnotes` | — | ✅ | ✅ | — | — | — |
| `in-page-nav` | — | — | ✅ | — | — | — |
| `step-process` | — | — | ✅ | — | — | — |
| `rates-fees-table` | — | — | ✅ | — | — | — |
| `feature-grid` | — | ✅ | ✅ | — | — | — |
| `promo-offer-banner` | ✅ | ✅ | — | — | — | — |
| `article-cards` | ✅ | — | — | — | — | — |
| `newsroom-listing` | — | — | — | — | — | ✅ |
| `loyalty-tiers` | — | — | — | ✅ | — | — |
| `support-cards` | ✅ | — | — | — | ✅ | — |
| `app-download` | — | — | ✅ | ✅ | — | — |
| `contact-form` | — | — | — | — | ✅ | — |
| `search` | — | — | — | — | ✅ | — |
