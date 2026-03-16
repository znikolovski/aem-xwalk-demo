# SKILLS.md — ANZ Personal Homepage Mega Menu

## Purpose
This file provides structured instructions for AI coding assistants building the ANZ mega menu navigation component. It is designed to be referenced by Claude Code, Cursor, Copilot, or similar tools.

Read this file in full before generating any navigation code.

---

## 1. GOLDEN RULES

- **Never hardcode link labels or URLs.** All navigation content is defined in `nav-data.json` (see Section 3). Components must consume this data structure — no inline strings.
- **Build in layers.** Never attempt to generate the full mega menu in a single pass. Follow the build sequence in Section 6.
- **One tab works before four tabs exist.** Get Tab 1 (Personal) fully functional before replicating to other tabs.
- **Desktop and mobile are separate render paths.** They share the same data source but use completely different interaction patterns and markup structures. Do not try to make one set of markup serve both.
- **Accessibility is a dedicated pass, not an afterthought.** Get visual/functional behaviour working first, then layer in ARIA, keyboard nav, and focus management as a separate step.

---

## 2. COMPONENT ARCHITECTURE

The mega menu is composed of these sub-components. Build them independently, then compose.

```
MegaMenu/
├── MegaMenuDesktop/
│   ├── TopBar              → Alert/scam banner (dismissible)
│   ├── HeaderBar           → Logo + primary nav tabs + utility nav + login dropdown
│   ├── FlyoutPanel         → One per tab, contains link grid + optional promo panel
│   └── LoginDropdown       → Standalone dropdown, independent state from flyouts
├── MegaMenuMobile/
│   ├── MobileHeader        → Logo + hamburger toggle + utility links
│   ├── MobileAccordion     → Accordion sections matching nav tabs
│   └── MobileLoginSection  → Login links within mobile drawer
└── nav-data.json           → Single source of truth for all navigation content
```

---

## 3. DATA STRUCTURE

All navigation content lives in a single JSON file. The component reads from this — never from hardcoded markup.

```json
{
  "alertBanner": {
    "message": "Be alert to fake direct debit confirmation emails that are impersonating banks.",
    "ctaLabel": "Learn more",
    "ctaUrl": "https://www.anz.com.au/security/latest-scams-australia/#direct-debit",
    "dismissible": true
  },
  "logo": {
    "src": "/assets/images/logo-promo-anz-small.png",
    "alt": "ANZ Bank logo — three shapes representing Australia, New Zealand, and Asia-Pacific forming a central human figure",
    "href": "/personal/"
  },
  "primaryNav": [
    {
      "id": "personal",
      "label": "Personal",
      "href": "/personal/",
      "links": [
        {
          "label": "Bank accounts",
          "subtitle": "Everyday/savings & term deposits",
          "href": "/personal/bank-accounts/"
        },
        {
          "label": "Credit cards",
          "subtitle": "Low interest rate, rewards frequent flyer & platinum",
          "href": "/personal/credit-cards/"
        }
        // ... remaining links per migration brief Section 4.3
      ],
      "promo": {
        "image": "/assets/images/nav-falcon-personal.jpg",
        "imageAlt": "Lady with a Falcon on her shoulder",
        "headline": "Fraud protection. Now it's personal.",
        "body": "ANZ Falcon® technology monitors millions of transactions every day to help keep you safe from fraud.",
        "ctaLabel": "Visit our security hub",
        "ctaUrl": "/security/?pid=sec-fly-td-hp-07-25-ser-falcon",
        "legal": "Falcon® is a registered trademark of Fair Isaac Corporation."
      }
    },
    {
      "id": "business",
      "label": "Business",
      "href": "/business/",
      "links": [ /* ... per migration brief */ ],
      "extraLinks": {
        "heading": "Explore more",
        "links": [ /* Business banking offers, Commercial Broker, Industry banking */ ]
      },
      "promo": null
    },
    {
      "id": "institutional",
      "label": "Institutional",
      "href": "/institutional/",
      "links": [ /* ... per migration brief */ ],
      "sidePanel": {
        "loginLabel": "ANZ Transactive – Global",
        "loginUrl": "https://transactive.online.anz.com/",
        "exploreLinks": [ /* Digital Services status, Help, Security device guide */ ]
      },
      "promo": null
    },
    {
      "id": "learn",
      "label": "Learn",
      "href": "/learn/",
      "links": [ /* ... per migration brief */ ],
      "promo": {
        // Same structure as Personal promo — different image, same Falcon copy
      }
    }
  ],
  "utilityNav": [
    { "label": "Find ANZ", "href": "/locations/" },
    { "label": "Support Centre", "href": "/support/" }
  ],
  "loginDropdown": {
    "label": "Log in",
    "links": [
      { "label": "Internet Banking", "href": "https://login.anz.com/internetbanking" },
      { "label": "ANZ Self Managed Super", "href": "https://login.anz.com/internetbanking" },
      { "label": "Investor Access", "href": "https://access.onepathsuperinvest.com.au/anz/logon.aspx" },
      { "label": "ANZ Smart Choice Super", "href": "https://hub.anzsmartchoice.com.au/access/" },
      { "label": "Register for Internet Banking", "href": "https://register.anz.com/internetbanking" }
    ]
  },
  "mobileExtraSection": {
    "label": "About us",
    "href": "https://www.anz.com/about-us/",
    "links": [
      { "label": "About ANZ", "href": "https://www.anz.com/about-us/" },
      { "label": "Debt Investor Centre", "href": "https://debtinvestors.anz.com/" },
      { "label": "Our Company", "href": "https://www.anz.com/about-us/our-company/" },
      { "label": "Media Centre", "href": "https://www.anz.com/about-us/media-centre/" },
      { "label": "Shareholder Centre", "href": "https://shareholder.anz.com/" },
      { "label": "Corporate Sustainability", "href": "https://www.anz.com/about-us/corporate-sustainability/" }
    ]
  }
}
```

**IMPORTANT:** The JSON above is a structural template. Populate ALL links from the migration brief (Section 4.3) before building. Do not generate placeholder data.

---

## 4. INTERACTION STATES

The mega menu has exactly these discrete states. Every state must be accounted for — no ambiguous "partially open" states.

### Desktop States
| State ID | Description | What is visible |
|---|---|---|
| `CLOSED` | Default. No flyout or dropdown open. | Header bar only. Alert banner if not dismissed. |
| `TAB_OPEN:{tabId}` | One flyout panel is open. | Header bar + the flyout panel for `{tabId}`. All other panels hidden. |
| `LOGIN_OPEN` | Login dropdown is open. | Header bar + login dropdown. All flyout panels hidden. |
| `BANNER_DISMISSED` | Alert banner has been closed. | Header bar without alert banner. Persists for session. |

**State transition rules:**
- Opening a tab closes any other open tab AND closes the login dropdown.
- Opening the login dropdown closes any open tab.
- Clicking outside any open panel returns to `CLOSED`.
- Pressing `Escape` returns to `CLOSED`.
- Hovering a tab opens it on desktop (with ~150ms delay to prevent accidental triggers). Clicking also works.

### Mobile States
| State ID | Description | What is visible |
|---|---|---|
| `DRAWER_CLOSED` | Default. | Mobile header bar only. |
| `DRAWER_OPEN` | Mobile drawer/menu is open. | Full-screen overlay with accordion sections collapsed. |
| `SECTION_EXPANDED:{tabId}` | One accordion section is expanded. | Drawer open, one section showing its child links. |

**State transition rules:**
- Hamburger icon toggles `DRAWER_CLOSED` ↔ `DRAWER_OPEN`.
- Tapping a section heading toggles that section. Only one section open at a time.
- Body scroll is locked when drawer is open.

---

## 5. FLYOUT PANEL LAYOUT SPEC

Each flyout panel has a consistent internal structure but with tab-specific variations:

### Standard Layout (Personal, Learn)
```
┌──────────────────────────────────────────────────────┐
│  FLYOUT PANEL                                        │
│  ┌─────────────────────────┐  ┌────────────────────┐ │
│  │  LINK GRID              │  │  PROMO PANEL       │ │
│  │                         │  │                    │ │
│  │  [Label]                │  │  [Image]           │ │
│  │   Subtitle              │  │  Headline          │ │
│  │                         │  │  Body copy         │ │
│  │  [Label]                │  │  [CTA Button]      │ │
│  │   Subtitle              │  │  Legal footnote    │ │
│  │                         │  │                    │ │
│  │  ... (up to 13 links)   │  │                    │ │
│  └─────────────────────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────┘
```
- Link grid takes approx 60-65% width.
- Promo panel takes approx 35-40% width.
- Links may flow into 2 columns within the grid if count exceeds ~7.

### Business Layout
```
┌──────────────────────────────────────────────────────┐
│  LINK GRID (main links)                              │
│  ─────────────────────                               │
│  "Explore more" sub-heading                          │
│  LINK GRID (extra links)                             │
│  NO promo panel                                      │
└──────────────────────────────────────────────────────┘
```

### Institutional Layout
```
┌──────────────────────────────────────────────────────┐
│  LINK GRID (main links)     │  SIDE PANEL            │
│                              │  "Log in" heading      │
│                              │  [Transactive link]    │
│                              │  "Explore more"        │
│                              │  [Status, Help, Guide] │
└──────────────────────────────────────────────────────┘
```

---

## 6. BUILD SEQUENCE

Follow this exact order. Complete and verify each step before proceeding.

### Step 1: Data file
- Create `nav-data.json` with the full structure from Section 3.
- Populate ALL links from the migration brief. Verify link count matches.
- **Verify:** JSON is valid. Every link has label, href. Subtitles present where specified.

### Step 2: Static desktop header bar
- Render logo (linked), four tab labels (as buttons, not links), utility nav links, login button.
- No flyouts, no dropdowns, no interactivity.
- **Verify:** All 4 tab labels render. Logo links to `/personal/`. Utility nav links are correct.

### Step 3: Desktop flyout — Tab 1 only (Personal)
- Implement the `TAB_OPEN:personal` state.
- Render the link grid with labels and subtitles.
- Render the promo panel with image, headline, body, CTA, legal text.
- Implement open/close: hover with delay, click, outside click, Escape key.
- **Verify:** All 13 Personal links render with correct subtitles and hrefs. Promo panel displays correctly. Panel closes on outside click and Escape.

### Step 4: Replicate flyout for Tabs 2-4
- Apply the same pattern but with tab-specific layout variations (see Section 5).
- Business: main links + "Explore more" sub-section, no promo.
- Institutional: main links + side panel with login and explore links.
- Learn: same layout as Personal with its own promo content.
- Implement mutual exclusivity: opening one tab closes others.
- **Verify:** Each tab opens its own panel. Only one panel open at a time. All links render correctly per tab.

### Step 5: Login dropdown
- Independent from flyout panels.
- Opens on click of "Log in" button.
- Closes any open flyout when opened.
- Contains 5 links (4 login destinations + 1 registration link).
- **Verify:** Login dropdown opens/closes independently. Closes flyouts when opened. All 5 links correct.

### Step 6: Alert banner
- Render the scam/security alert banner above the header.
- Implement dismiss behaviour (hide for session).
- **Verify:** Banner displays with correct copy and link. Dismiss removes it. Does not reappear on scroll.

### Step 7: Mobile navigation
- Build the mobile drawer as a completely separate render path (show/hide based on viewport, or render conditionally).
- Hamburger toggle opens a full-screen overlay.
- Accordion sections for each tab — one open at a time.
- Include the "About us" section (mobile-only, from `mobileExtraSection` in data).
- Include login links and utility nav within the drawer.
- Lock body scroll when drawer is open.
- **Verify:** Hamburger toggles drawer. Accordion sections expand/collapse. Only one section open at a time. All links present including mobile-only About Us section. Body scroll locked.

### Step 8: Responsive breakpoint integration
- Desktop mega menu visible at ≥1024px.
- Mobile drawer visible at <1024px.
- Confirm there is no state where both are visible or neither is visible.
- **Verify:** Resize browser across breakpoints. Clean transition between desktop and mobile. No layout breakage at 768px, 1024px boundaries.

### Step 9: Accessibility pass
- Add the following to the desktop mega menu:
  - `role="navigation"` on the `<nav>` container with `aria-label="Main navigation"`.
  - `aria-expanded="true|false"` on each tab button reflecting flyout state.
  - `aria-haspopup="true"` on tab buttons and login button.
  - `aria-controls="{panelId}"` linking each tab button to its flyout panel.
  - `role="menu"` on flyout panels; `role="menuitem"` on links within.
  - Keyboard navigation: Tab/Shift+Tab moves between top-level items. Arrow keys navigate within an open flyout. Escape closes the flyout and returns focus to the triggering tab button.
  - Focus trap within open flyout (Tab from last item returns to first item in the panel).
- Add skip links before the nav: "Skip to log on" (`#skip_logon`) and "Skip to main content" (`#main_skip`).
- Add the VoiceOver advisory text (visually hidden): "VoiceOver users please use the tab key when navigating expanded menus".
- Mobile drawer: `aria-hidden="true"` when closed. Focus trap when open. Close button has `aria-label="Close menu"`.
- **Verify:** Navigate entire menu with keyboard only — no mouse. Test with a screen reader (VoiceOver or NVDA). All states announced correctly. Focus never gets lost.

### Step 10: Visual polish and animation
- Flyout panels should appear with a subtle fade/slide (150-200ms ease).
- Mobile drawer should slide in from left or top (200-300ms ease).
- Accordion expand/collapse should animate height (150ms ease).
- Hover states on all links.
- Active/current tab indicator for the "Personal" tab (since this is the Personal homepage).
- **Verify:** Animations are smooth, not janky. `prefers-reduced-motion` media query disables animations for users who request it.

---

## 7. COMMON MISTAKES TO AVOID

These are the specific failure modes AI tends to hit with this component. Check for them actively.

| Mistake | How to prevent |
|---|---|
| Hardcoding link labels/URLs in markup | Always map over `nav-data.json`. If you see a string literal URL in JSX/HTML, it's wrong. |
| Merging flyout panels into one container | Each tab gets its own panel element with a unique ID. Do not render all links in a single panel and toggle visibility of groups. |
| Forgetting the promo panel on Personal and Learn | Only Business and Institutional omit the promo. Check the data for `promo !== null`. |
| Making the mobile menu a CSS-restyled desktop menu | These are separate components. The mobile accordion and desktop flyout share data but not markup. |
| Nesting `<a>` inside `<button>` or vice versa | Tab triggers are `<button>` elements. Links inside flyout panels are `<a>` elements. Never nest one inside the other. |
| Losing the "Explore more" sub-section in Business tab | Business has two link groups: main links and `extraLinks` with its own heading. Both must render. |
| Losing the Institutional side panel | Institutional has a unique `sidePanel` with a login link and explore links. It's not a promo — don't render it as one. |
| Missing the mobile-only "About us" section | This section does not appear in the desktop nav. It comes from `mobileExtraSection` in the data. |
| No outside-click close behaviour | Add a click listener on the document/overlay that closes any open panel when clicking outside. |
| No Escape key handling | Add a `keydown` listener for Escape that returns to `CLOSED` state and restores focus. |
| Forgetting to lock body scroll on mobile drawer open | Apply `overflow: hidden` to `<body>` when drawer is open. Remove it on close. |
| Animation on `prefers-reduced-motion` | Wrap all transitions in a `prefers-reduced-motion: no-preference` check. |

---

## 8. TESTING CHECKLIST

Run through this after each build step:

- [ ] All links in `nav-data.json` render (count them: ~80+ across all tabs)
- [ ] Every link `href` matches the migration brief exactly
- [ ] Subtitles render where specified, absent where not
- [ ] Only one flyout/dropdown open at a time on desktop
- [ ] Outside click closes open panels
- [ ] Escape key closes open panels
- [ ] Promo panels render on Personal and Learn tabs only
- [ ] Business "Explore more" sub-section renders
- [ ] Institutional side panel renders with login and explore links
- [ ] Login dropdown is independent of tab flyouts
- [ ] Mobile hamburger toggles drawer
- [ ] Mobile accordion — only one section open at a time
- [ ] Mobile "About us" section present
- [ ] Body scroll locked when mobile drawer is open
- [ ] Skip links present and functional
- [ ] Full keyboard navigation works (no focus traps, no lost focus)
- [ ] `aria-expanded` toggles correctly on all interactive elements
- [ ] Screen reader announces menu state changes
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No layout breakage at 375px, 768px, 1024px, 1440px
- [ ] `pid=` tracking parameters preserved on all CTAs that have them
