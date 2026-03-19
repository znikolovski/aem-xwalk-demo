# CBA Content Models

Concrete content model examples for commbank.com.au EDS migration blocks. Use these as the authoritative models when making authoring decisions or building new CBA blocks.

---

## Standalone Models

### Hero Block

The `hero` block is a Standalone model with 4 variants. The variant class controls layout.

**Standard Hero (most common):**
```
| Hero |
|------|
| ![Hero image](hero.png) |
| # Find a home loan that's right for you |
| Borrow up to 95% with a low deposit, or get conditional approval in minutes. |
| [Book an appointment](/appointments?ei=) [Get started](/home-loans/apply) |
```

**Hero (Image Right) — used on product detail pages:**
```
| Hero (Image Right) |
|-------------------|
| # Digi Home Loan | ![Product image](digi-loan.png) |
| Variable rate with offset account, no monthly fee.<br>**5.89% p.a.** interest rate<br>**6.02% p.a.** comparison rate[*] | [Apply now](modal-apply) |
```

**Hero (Full Bleed) — corporate hub pages:**
```
| Hero (Full Bleed) |
|------------------|
| ![Background image](hub-background.png) |
| # Insurance to help protect what matters |
| Cover for life, car, home, travel, pet and business. |
| [Explore insurance](/insurance) |
```

**Hero (Editorial) — newsroom articles:**
```
| Hero (Editorial) |
|-----------------|
| Economic news |
| # RBA holds cash rate at 4.10% |
| *17 March 2026* |
```

---

### Rate Display Block

The `rate-display` block is a Standalone model. Always shows interest rate + comparison rate as a pair with superscript footnote references.

```
| Rate Display |
|-------------|
| Interest rate | **5.89% p.a.** |
| Comparison rate | **6.02% p.a.[*]** |
```

For variable rate ranges:
```
| Rate Display |
|-------------|
| Variable interest rate | **5.89% – 7.24% p.a.** |
| Comparison rate | **6.02% – 7.47% p.a.[*]** |
```

---

### Announcement Banner Block

The `announcement-banner` block is a Standalone model. One row with optional CTA link.

**Rate change announcement:**
```
| Announcement Banner |
|--------------------|
| Home loan interest rates have changed. [View current rates](/home-buying/interest-rates.html) |
```

**Promotional offer:**
```
| Announcement Banner (Promo) |
|----------------------------|
| Get up to 300,000 Qantas Points on eligible home loans. Offer ends 30 June 2026. [Find out more](/home-buying/home-loans/qantas-points) |
```

---

### Modal Apply Block

The `modal-apply` block is a Standalone model. It captures the two-path CTA that appears on every product page.

```
| Modal Apply |
|------------|
| Already a customer banking online with us? | [Apply online](https://mobile-app-redirect.commbank.com.au/smart-awards-cc) |
| New customer or don't bank online? | [Get started](/digital-banking/apply-in-app.html) |
```

Note: The `mobile-app-redirect.commbank.com.au` URL product ID must match the specific product being applied for.

---

### Footnotes Block

The `footnotes` block is a Standalone model. **Mandatory on all CBA product pages.**

Each row is one footnote, keyed by its marker symbol. Use the same superscript markers (`[1]`, `[*]`, `[+]`, etc.) that appear in body content.

```
| Footnotes |
|-----------|
| [*] This is a comparison rate. The comparison rate for the Digi Home Loan is based on a secured loan of $150,000 over 25 years. WARNING: This comparison rate applies only to the examples given. |
| [1] Terms, conditions, fees and charges apply. Full details available on application. Credit provided by Commonwealth Bank of Australia ABN 48 123 123 124 AFSL 234945. |
| [+] Qantas Points offer: Earn up to 300,000 bonus points. Eligibility criteria and T&Cs apply. Offer ends 30 June 2026. |
```

---

### Promo Offer Banner Block

The `promo-offer-banner` block is a Standalone model. Has a heading, offer details, deadline, and dual CTAs.

```
| Promo Offer Banner |
|-------------------|
| ## Home loan today. Holiday tomorrow. |
| Earn up to 300,000 Qantas Points when you take out an eligible CommBank variable rate home loan and keep it for at least 3 months. New home loan customers only. Offer ends 30 June 2026. |
| [Get started](modal-apply) | [See full offer details](/home-buying/home-loans/qantas-points) |
```

---

### Partner Block

The `partner-block` is a Standalone model for co-branded partner integrations.

```
| Partner Block |
|--------------|
| ![Home-in conveyancing image](homein-hero.png) | ![provided by Home-in](homein-logo.png)<br>## Settlement made simpler with Home-in<br>Move through your property settlement faster and with less stress, with Home-in — CommBank's preferred conveyancing partner.<br>[Find out more](/home-buying/home-loans/homein-conveyancing) |
```

---

### In-Page Nav Block

The `in-page-nav` block is a Standalone model. One row with anchor links.

```
| In Page Nav |
|------------|
| [At a glance](#glance) | [Awards program](#awards) | [Rates & fees](#rates) | [Support](#support) |
```

For longer product pages with more sections:
```
| In Page Nav |
|------------|
| [Overview](#glance) | [Features](#features) | [Rates & fees](#rates) | [How to apply](#apply) | [FAQs](#faqs) |
```

---

### App Download Block

The `app-download` block is a Standalone model. Device mockup image + heading + app store badges.

```
| App Download |
|-------------|
| ![CommBank App on iPhone](app-iphone.png) | ## Bank anywhere with the CommBank App<br>4.8 stars • 1M+ reviews<br>[Download on the App Store](https://apps.apple.com/au/app/commbank/id310251202) [Get it on Google Play](https://play.google.com/store/apps/details?id=com.commbank.netbank) |
```

---

### Featured Content Block

The `featured-content` block is a Standalone model. Used for the large 780×416 editorial card.

```
| Featured Content |
|----------------|
| ![Wide feature image](feature-wide.png) |
| ## Making the most of falling rates |
| With the RBA cutting rates, here's what it means for your home loan and savings. |
| [Read more](/articles/newsroom/2026/03/rba-rate-cut-explainer) |
```

---

## Collection Models

### Product Card Block

The `product-card` block is a Collection model — each row is one product card.

**Standard product card (3 items shown):**
```
| Product Cards |
|--------------|
| ![Home loan icon](home-loan.png) | ## Variable Rate Home Loan<br>- No monthly fee<br>- Offset account option<br>- Redraw facility<br>[Tell me more](/home-buying/home-loans/standard-variable) |
| ![Digi loan icon](digi-loan.png) | ## Digi Home Loan<br>- Lowest variable rate<br>- 100% offset account<br>- Managed entirely online<br>[Tell me more](/home-buying/home-loans/digi-home-loan) |
| ![Fixed loan icon](fixed-loan.png) | ## Fixed Rate Home Loan<br>- Lock in your rate for 1–5 years<br>- Rate certainty for budgeting<br>- Repayment flexibility<br>[Tell me more](/home-buying/home-loans/fixed-rate) |
```

**Extended product card (credit cards — includes rate data):**
```
| Product Cards (Extended) |
|--------------------------|
| ![Smart Awards card](smart-awards.png) | ## Smart Awards Credit Card |
| Purchase rate | 20.99% p.a. |
| Monthly fee | $19 (waived if $2,000+ spend) |
| Interest free days | Up to 55 days |
| Min credit limit | $500 |
| [Apply now](modal-apply) | [Learn more](/credit-cards/smart-awards) |
| ![Low Rate card](low-rate.png) | ## Low Rate Credit Card |
| Purchase rate | 13.24% p.a. |
| Monthly fee | $6 |
| Interest free days | Up to 55 days |
| Min credit limit | $500 |
| [Apply now](modal-apply) | [Learn more](/credit-cards/low-rate) |
```

---

### Anchor Tile Nav Block

The `anchor-tile-nav` block is a Collection model — each row is one tile.

```
| Anchor Tile Nav |
|-----------------|
| ![icon](rates.png) | [Home loan rates](#rates) |
| ![icon](fixed.png) | [Fixed rate home loans](#fixed) |
| ![icon](variable.png) | [Variable rate home loans](#variable) |
| ![icon](refinance.png) | [Refinancing](#refinancing) |
| ![icon](investment.png) | [Investment home loans](#investment) |
| ![icon](construction.png) | [Construction loans](#construction) |
| ![icon](low-deposit.png) | [Low deposit home loans](#low-deposit) |
| ![icon](first-home.png) | [First home buyer](#first-home) |
```

---

### Feature Grid Block

The `feature-grid` block is a Collection model — 4 items per row (2 rows = 8 items, though 4 is typical).

```
| Feature Grid |
|-------------|
| ![CANSTAR award](canstar.png) | ## 5-star CANSTAR award winner<br>Recognised for outstanding value home loans. |
| ![Speed icon](fast.png) | ## Conditional approval in minutes<br>Apply online and get a fast decision. |
| ![Support icon](support.png) | ## Dedicated home lending specialist<br>Talk to an expert at any branch. |
| ![App icon](app.png) | ## Manage your loan in the app<br>Track your balance, make payments, and more. |
```

---

### Article Cards Block

The `article-cards` block is a Collection model — each row is one article card.

```
| Article Cards |
|--------------|
| ![Article thumbnail](article1.png) | ## RBA holds cash rate: What it means for you<br>Understanding the impact of the Reserve Bank's latest decision on your home loan and savings.<br>[Read more](/articles/newsroom/2026/03/rba-holds-rate) |
| ![Article thumbnail](article2.png) | ## First home buyer guide: 5 steps to buying your first home<br>Everything you need to know about the first home buyer process in Australia.<br>[Read more](/articles/guides/first-home-buyer-steps) |
| ![Article thumbnail](article3.png) | ## How to compare home loans<br>Key features to look for when comparing home loan options.<br>[Read more](/articles/guides/compare-home-loans) |
```

---

### Support Cards Block

The `support-cards` block is a Collection model — each row is one support category card.

```
| Support Cards |
|--------------|
| ![Support icon](support-icon.png) | ## Support & FAQs<br>[Find answers to common questions](/help/faqs)<br>[Security centre and scams](/security)<br>[Financial assistance](/financial-assistance)<br>[Accessibility](/accessibility) |
| ![Contact icon](contact-icon.png) | ## Contact us<br>[Call 13 22 21](/contact)<br>[Chat with us online](/chat)<br>[Book an appointment](/appointments)<br>[Find a branch](/branch-locator) |
| ![Locate icon](locate-icon.png) | ## Locate us<br>[Find a branch](/branch-locator)<br>[Find an ATM](/atm-locator)<br>[International assistance](/contact/international) |
```

---

### Step Process Block

The `step-process` block is a Collection model — each row is one numbered step.

```
| Step Process |
|-------------|
| ![Step 1](step1.png) | ## Check your eligibility<br>Use our borrowing power calculator to see what you can borrow. |
| ![Step 2](step2.png) | ## Get conditional approval<br>Apply online in minutes and receive a conditional approval decision. |
| ![Step 3](step3.png) | ## Engage a conveyancer<br>Use Home-in or your own conveyancer to handle the legal paperwork. |
| ![Step 4](step4.png) | ## Complete your application<br>Upload supporting documents and complete your full application. |
| ![Step 5](step5.png) | ## Get formal approval<br>We'll assess your application and provide formal approval. |
| ![Step 6](step6.png) | ## Settlement<br>Your conveyancer and CommBank will coordinate settlement. |
```

---

### Rates Fees Table Block

The `rates-fees-table` block is a Collection model — each row is one fee/rate line item with 2–3 columns.

**Credit card rates & fees (3 columns):**
```
| Rates Fees Table |
|-----------------|
| **Fee / Rate** | **Amount** | **Conditions** |
| Monthly account fee | $19 | Waived if $2,000+ spend in statement month |
| Purchase rate | 20.99% p.a. | Standard purchase interest rate |
| Cash advance rate | 21.99% p.a. | Applies to cash advances |
| International transaction fee | 0% | No overseas transaction fees |
| Late payment fee | $20 | Applied when minimum payment missed |
```

**Reward points earn rates (3 columns):**
```
| Rates Fees Table |
|-----------------|
| **Purchase Type** | **Points per $1** | **Spend Threshold** |
| Highest eligible tier | 2 pts | First $2,500 per statement |
| Major retailers | 1.5 pts | Up to $5,000 per statement |
| CommBank Everyday | 1 pt | Uncapped |
```

---

### Accordion (FAQ) Block

CBA uses accordion for FAQ sections. Collection model — each row is one FAQ item.

```
| Accordion |
|----------|
| What is a comparison rate? | A comparison rate is designed to help you identify the true cost of a loan by incorporating the interest rate as well as most fees and charges. It's expressed as a single percentage figure. |
| How much can I borrow? | Your borrowing power depends on your income, expenses, existing debts, and the property value. Use our [borrowing calculator](/calculators/home-loan-borrowing-power) for an estimate. |
| What is LVR? | LVR stands for Loan to Value Ratio. It's calculated by dividing your loan amount by the property value, expressed as a percentage. A lower LVR may mean a lower interest rate. |
| Do I need Lenders Mortgage Insurance? | LMI is generally required when your LVR exceeds 80%. It protects the lender (not you) if you default. First home buyers may be eligible for the First Home Guarantee which waives LMI. |
```

---

## Configuration Models

### Rate Calculator Block

The `rate-calculator` block uses a Configuration model. All configuration drives the dynamic JavaScript-powered calculator.

```
| Rate Calculator |
|----------------|
| type | home-loan |
| default-loan-amount | 500000 |
| default-property-value | 625000 |
| min-loan-amount | 10000 |
| max-loan-amount | 5000000 |
| show-comparison-rate | true |
| rates-api | /api/rates/home-loans |
```

---

### Newsroom Listing Block

The `newsroom-listing` block uses a Configuration model. Tag-based filtering and load-more pagination are driven by configuration.

```
| Newsroom Listing |
|-----------------|
| limit | 12 |
| sort | date-desc |
| default-category | all |
| categories | Economic news, Technology, Regional, Community, Insights, Media releases |
| load-more | true |
```

---

## Auto-Blocked Models

### Tabs (CommBank Yello)

CommBank Yello tabs use the Auto-blocked model. Each section (separated by `---`) with matching `style | tabs` section metadata becomes one tab.

```
| Section Metadata |
|-----------------|
| style | tabs |

## Benefits

Discover the exclusive benefits available to CommBank Yello members.

| Loyalty Tiers |
...

---

| Section Metadata |
|-----------------|
| style | tabs |

## How it works

Yello rewards are based on your CommBank products. The more you bank with us, the more you earn.

...

---

| Section Metadata |
|-----------------|
| style | tabs |

## Offers

Browse the latest exclusive offers from our retail partners.

...
```

---

## CBA Content Modeling Anti-Patterns

These patterns appear in the legacy AEM site and **must be avoided** in the EDS content models:

### ❌ Rate data hardcoded in content
```
BAD: Hardcoding "5.89%" directly in a hero block cell
WHY: Rates change frequently — requires CMS edit on every rate change
FIX: Use rate-display block that pulls from a data source, or keep as default
     content that authors update via the rate-display block
```

### ❌ `?ei=` parameters in link hrefs
```
BAD: [Get started](/home-buying/apply?ei=cta-hlhero-getstarted)
WHY: EDS uses data attributes for analytics, not URL parameters
FIX: [Get started](/home-buying/apply) — analytics handled by EDS plugin
```

### ❌ UUID-based anchor targets from AEM
```
BAD: [Apply now](#carditem_6f3a2b1c-8d4e-4f2a-9b5c-1a2b3c4d5e6f)
WHY: AEM generates UUIDs — not reproducible or author-friendly in EDS
FIX: Use semantic anchors: [Apply now](#smart-awards) or trigger modal-apply block
```

### ❌ Scene7 crop parameters in image src
```
BAD: ![Hero](https://assets.commbank.com.au/is/image/commbank/hero$W780_H416$&fit=crop)
WHY: EDS manages image optimisation natively via /media_ pipeline
FIX: Download master asset, let EDS handle crops: ![Hero](./images/hero.png)
```

### ❌ Mbox wrapper divs in content
```
BAD: Preserving <div class="mboxDefault" id="CB-HL-HERO"> in imported HTML
WHY: AEM Target mboxes don't exist in EDS — creates empty wrapper divs
FIX: Extract only the content inside the mbox div
```
