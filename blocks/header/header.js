import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1024px)');

// --- State ---
let activeTabId = null;
let loginOpen = false;

function setState(updates) {
  if ('activeTabId' in updates) activeTabId = updates.activeTabId;
  if ('loginOpen' in updates) loginOpen = updates.loginOpen;
}

// --- Fragment Parsing Helpers ---

function parsePromoContent(elements) {
  const img = elements[0]?.querySelector('img');
  const headline = elements[1]?.querySelector('strong')?.textContent || '';
  const body = elements[2]?.textContent?.trim() || '';
  const ctaLink = elements[3]?.querySelector('a');
  const legal = elements[4]?.querySelector('em')?.textContent
    || elements[4]?.textContent?.trim() || '';

  return {
    image: img?.getAttribute('src') || '',
    imageAlt: img?.getAttribute('alt') || '',
    headline,
    body,
    ctaLabel: ctaLink?.textContent?.trim() || '',
    ctaUrl: ctaLink?.getAttribute('href') || '#',
    legal,
  };
}

function parseSidePanelContent(elements) {
  const result = { sidePanel: null, extraLinks: null };
  const sections = [];
  let currentHeading = null;
  let currentLinks = [];

  elements.forEach((el) => {
    const strong = el.querySelector(':scope > strong');
    if (strong && el.tagName === 'P') {
      if (currentHeading) {
        sections.push({ heading: currentHeading, links: [...currentLinks] });
      }
      currentHeading = strong.textContent.trim();
      currentLinks = [];
    } else if (el.tagName === 'P' && el.querySelector('a')) {
      const a = el.querySelector('a');
      currentLinks.push({ label: a.textContent.trim(), href: a.getAttribute('href') });
    } else if (el.tagName === 'UL') {
      el.querySelectorAll(':scope > li').forEach((li) => {
        const a = li.querySelector('a');
        if (a) {
          currentLinks.push({ label: a.textContent.trim(), href: a.getAttribute('href') });
        }
      });
    }
  });
  if (currentHeading) {
    sections.push({ heading: currentHeading, links: [...currentLinks] });
  }

  const loginSection = sections.find((s) => s.heading.toLowerCase() === 'log in');
  const exploreSection = sections.find((s) => s.heading.toLowerCase() === 'explore more');

  if (loginSection) {
    result.sidePanel = {
      loginLabel: loginSection.links[0]?.label || '',
      loginUrl: loginSection.links[0]?.href || '#',
      exploreLinks: exploreSection?.links || [],
    };
  } else if (exploreSection) {
    result.extraLinks = {
      heading: exploreSection.heading,
      links: exploreSection.links,
    };
  }

  return result;
}

function parseNavFragment(fragment) {
  // After loadFragment decorates, structure is:
  // <main> > div.section > div.default-content-wrapper > [div, div, div, div]
  const section = fragment.querySelector(':scope > div');
  const contentWrapper = section?.querySelector(':scope > .default-content-wrapper') || section;
  const parts = contentWrapper
    ? [...contentWrapper.querySelectorAll(':scope > div')]
    : [];

  const data = {};

  // --- Brand (Part 0) ---
  const brandPart = parts[0];
  const brandLink = brandPart?.querySelector('a');
  const brandImg = brandPart?.querySelector('img');
  data.logo = {
    href: brandLink?.getAttribute('href') || '/personal/',
    src: brandImg?.getAttribute('src') || '/icons/anz-logo.svg',
    alt: brandImg?.getAttribute('alt') || 'ANZ',
  };

  // --- Primary Nav (Part 1) ---
  const navPart = parts[1];
  const topLevelItems = navPart?.querySelectorAll(':scope > ul > li') || [];
  data.primaryNav = [...topLevelItems].map((li) => {
    const tabLink = li.querySelector(':scope > a');
    const label = tabLink?.textContent?.trim() || '';
    const id = label.toLowerCase().replace(/\s+/g, '-');
    const href = tabLink?.getAttribute('href') || '#';

    // Sub-links from first nested <ul>
    const subList = li.querySelector(':scope > ul');
    const links = [];
    if (subList) {
      subList.querySelectorAll(':scope > li').forEach((subLi) => {
        const a = subLi.querySelector('a');
        const linkLabel = a?.textContent?.trim() || '';
        // Subtitle: text node after <br>
        const br = subLi.querySelector('br');
        let subtitle = '';
        if (br && br.nextSibling) {
          subtitle = br.nextSibling.textContent?.trim() || '';
        }
        links.push({ label: linkLabel, subtitle, href: a?.getAttribute('href') || '#' });
      });
    }

    // Content after the first <ul> = promo or side panel
    let promo = null;
    let sidePanel = null;
    let extraLinks = null;
    const afterUl = [];
    if (subList) {
      let sibling = subList.nextElementSibling;
      while (sibling) {
        afterUl.push(sibling);
        sibling = sibling.nextElementSibling;
      }
    }

    if (afterUl.length > 0) {
      const firstEl = afterUl[0];
      const hasImage = firstEl.querySelector('img, picture');
      if (hasImage) {
        promo = parsePromoContent(afterUl);
      } else {
        const parsed = parseSidePanelContent(afterUl);
        ({ sidePanel, extraLinks } = parsed);
      }
    }

    return {
      id, label, href, links, promo, sidePanel, extraLinks,
    };
  });

  // --- Utility Nav (Part 2) ---
  const utilityPart = parts[2];
  data.utilityNav = [];
  if (utilityPart) {
    utilityPart.querySelectorAll('a').forEach((a) => {
      data.utilityNav.push({
        label: a.textContent.trim(),
        href: a.getAttribute('href'),
      });
    });
  }

  // --- Login (Part 3) ---
  const loginPart = parts[3];
  data.loginDropdown = { label: 'Log in', links: [] };
  if (loginPart) {
    loginPart.querySelectorAll('li a').forEach((a) => {
      data.loginDropdown.links.push({
        label: a.textContent.trim(),
        href: a.getAttribute('href'),
      });
    });
  }

  // --- "About us" as mobile-only extra section ---
  const aboutUsTab = data.primaryNav.find((t) => t.id === 'about-us');
  if (aboutUsTab) {
    data.mobileExtraSection = {
      label: aboutUsTab.label,
      href: aboutUsTab.href,
      links: aboutUsTab.links,
    };
  }

  data.alertBanner = null;
  return data;
}

// --- Alert Banner (from fragment) ---
async function loadAlertBanner() {
  if (sessionStorage.getItem('anz-alert-dismissed') === 'true') return null;
  try {
    const resp = await fetch('/content/fragments/alert-banner.plain.html');
    if (!resp.ok) return null;
    const html = await resp.text();
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const banner = document.createElement('div');
    banner.className = 'mega-alert';
    const p = temp.querySelector('p');
    if (p) banner.appendChild(p);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mega-alert-close';
    closeBtn.setAttribute('aria-label', 'Dismiss alert');
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', () => {
      banner.remove();
      sessionStorage.setItem('anz-alert-dismissed', 'true');
    });
    banner.appendChild(closeBtn);
    return banner;
  } catch (e) {
    return null;
  }
}

// --- Desktop Header Bar ---
function buildDesktopHeader(data) {
  const header = document.createElement('div');
  header.className = 'mega-desktop';

  // Logo
  const logo = document.createElement('a');
  logo.className = 'mega-logo';
  logo.href = data.logo.href;
  logo.innerHTML = `<img src="${data.logo.src}" alt="${data.logo.alt}" loading="eager">`;

  // Primary nav tabs (exclude "About us" from desktop tabs)
  const nav = document.createElement('nav');
  nav.className = 'mega-primary-nav';
  nav.setAttribute('aria-label', 'Main navigation');
  const tabList = document.createElement('ul');
  tabList.className = 'mega-tabs';
  data.primaryNav.forEach((tab) => {
    if (tab.id === 'about-us') return; // About us is mobile-only
    const li = document.createElement('li');
    li.className = 'mega-tab';
    if (tab.id === 'personal') li.classList.add('mega-tab-active');
    const btn = document.createElement('button');
    btn.className = 'mega-tab-btn';
    btn.textContent = tab.label;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-controls', `flyout-${tab.id}`);
    btn.dataset.tabId = tab.id;
    li.appendChild(btn);
    tabList.appendChild(li);
  });
  nav.appendChild(tabList);

  // Search + Login area
  const tools = document.createElement('div');
  tools.className = 'mega-tools';

  // Search
  const search = document.createElement('div');
  search.className = 'mega-search';
  search.innerHTML = `<input type="text" placeholder="Search" aria-label="Search">
    <button class="mega-search-btn" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="22" y2="22"/></svg></button>`;

  // Login button + dropdown trigger
  const loginWrap = document.createElement('div');
  loginWrap.className = 'mega-login-wrap';
  const loginBtn = document.createElement('button');
  loginBtn.className = 'mega-login-btn';
  loginBtn.setAttribute('aria-haspopup', 'true');
  loginBtn.setAttribute('aria-expanded', 'false');
  loginBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Log in';
  const loginChevron = document.createElement('button');
  loginChevron.className = 'mega-login-chevron';
  loginChevron.setAttribute('aria-label', 'More login options');
  loginChevron.setAttribute('aria-haspopup', 'true');
  loginChevron.setAttribute('aria-expanded', 'false');
  loginChevron.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>';
  loginWrap.append(loginBtn, loginChevron);

  // Login dropdown panel
  const loginPanel = document.createElement('div');
  loginPanel.className = 'mega-login-panel';
  loginPanel.setAttribute('aria-hidden', 'true');
  const loginList = document.createElement('ul');
  data.loginDropdown.links.forEach((link) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${link.href}">${link.label}</a>`;
    loginList.appendChild(li);
  });
  loginPanel.appendChild(loginList);
  loginWrap.appendChild(loginPanel);

  tools.append(search, loginWrap);
  header.append(logo, nav, tools);

  return { header };
}

// --- Utility Bar (below dark bar, with icons) ---
function buildUtilityBar(data) {
  const utilityBar = document.createElement('div');
  utilityBar.className = 'mega-utility';

  const utilityInner = document.createElement('div');
  utilityInner.className = 'mega-utility-inner';

  const icons = {
    'Find ANZ': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'Support Centre': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  };

  data.utilityNav.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.href;
    const icon = icons[item.label] || '';
    a.innerHTML = `${icon}<span>${item.label}</span>`;
    utilityInner.appendChild(a);
  });

  utilityBar.appendChild(utilityInner);
  return utilityBar;
}

// --- Flyout Panels ---
function buildFlyoutPanel(tab) {
  const panel = document.createElement('div');
  panel.className = 'mega-flyout';
  panel.id = `flyout-${tab.id}`;
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('role', 'menu');

  // Link grid
  const grid = document.createElement('div');
  grid.className = 'mega-flyout-grid';

  // "See all" link at top
  const seeAll = document.createElement('a');
  seeAll.className = 'mega-flyout-seeall';
  seeAll.href = tab.href;
  seeAll.setAttribute('role', 'menuitem');
  seeAll.innerHTML = `<span class="mega-flyout-seeall-arrow">\u203A</span> ${tab.label}`;
  grid.appendChild(seeAll);

  // Link items
  const linkList = document.createElement('div');
  linkList.className = 'mega-flyout-links';
  tab.links.forEach((link) => {
    const item = document.createElement('a');
    item.className = 'mega-flyout-link';
    item.href = link.href;
    item.setAttribute('role', 'menuitem');
    item.innerHTML = `<span class="mega-flyout-link-label">${link.label}</span>`;
    if (link.subtitle) {
      item.innerHTML += `<span class="mega-flyout-link-subtitle">${link.subtitle}</span>`;
    }
    linkList.appendChild(item);
  });
  grid.appendChild(linkList);
  panel.appendChild(grid);

  // Promo panel (Personal, Learn)
  if (tab.promo) {
    const promo = document.createElement('div');
    promo.className = 'mega-flyout-promo';
    promo.innerHTML = `<a href="${tab.promo.ctaUrl}" class="mega-flyout-promo-img-link">
        <img src="${tab.promo.image}" alt="${tab.promo.imageAlt}" loading="lazy">
      </a>
      <div class="mega-flyout-promo-content">
        <p class="mega-flyout-promo-headline">${tab.promo.headline.replace('\n', '<br>')}</p>
        <p class="mega-flyout-promo-body">${tab.promo.body}</p>
        <a href="${tab.promo.ctaUrl}" class="mega-flyout-promo-cta">${tab.promo.ctaLabel}</a>
        <p class="mega-flyout-promo-legal">${tab.promo.legal}</p>
      </div>`;
    panel.appendChild(promo);
  }

  // Side panel — Business extraLinks
  if (tab.extraLinks) {
    const side = document.createElement('div');
    side.className = 'mega-flyout-side';
    side.innerHTML = `<h3 class="mega-flyout-side-heading">${tab.extraLinks.heading}</h3>
      <ul>${tab.extraLinks.links.map((l) => `<li><a href="${l.href}" role="menuitem">${l.label}</a></li>`).join('')}</ul>`;
    panel.appendChild(side);
  }

  // Side panel — Institutional sidePanel
  if (tab.sidePanel) {
    const side = document.createElement('div');
    side.className = 'mega-flyout-side';
    side.innerHTML = `<p class="mega-flyout-side-heading">Log in</p>
      <a href="${tab.sidePanel.loginUrl}" class="mega-flyout-side-login">${tab.sidePanel.loginLabel} <span class="mega-external-icon">\u2197</span></a>
      <p class="mega-flyout-side-heading">Explore more</p>
      <ul>${tab.sidePanel.exploreLinks.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>`;
    panel.appendChild(side);
  }

  return panel;
}

// --- Mobile Navigation ---
function buildMobileNav(data) {
  const drawer = document.createElement('div');
  drawer.className = 'mega-mobile-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Navigation menu');

  // Mobile header
  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'mega-mobile-header';
  mobileHeader.innerHTML = `<a href="${data.logo.href}" class="mega-mobile-logo">
      <img src="${data.logo.src}" alt="${data.logo.alt}" loading="eager">
    </a>
    <button class="mega-mobile-close" aria-label="Close menu">\u00D7</button>`;

  // Accordion sections
  const accordion = document.createElement('div');
  accordion.className = 'mega-mobile-accordion';
  data.primaryNav.forEach((tab) => {
    // Skip About us here — it's added from mobileExtraSection
    if (tab.id === 'about-us') return;
    const section = document.createElement('div');
    section.className = 'mega-mobile-section';
    section.dataset.sectionId = tab.id;
    const trigger = document.createElement('button');
    trigger.className = 'mega-mobile-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `${tab.label} <span class="mega-mobile-chevron"></span>`;
    const content = document.createElement('div');
    content.className = 'mega-mobile-content';
    content.setAttribute('aria-hidden', 'true');
    const ul = document.createElement('ul');
    tab.links.forEach((link) => {
      ul.innerHTML += `<li><a href="${link.href}">${link.label}</a></li>`;
    });
    if (tab.extraLinks) {
      tab.extraLinks.links.forEach((link) => {
        ul.innerHTML += `<li><a href="${link.href}">${link.label}</a></li>`;
      });
    }
    content.appendChild(ul);
    section.append(trigger, content);
    accordion.appendChild(section);
  });

  // Mobile-only About us section
  if (data.mobileExtraSection) {
    const section = document.createElement('div');
    section.className = 'mega-mobile-section';
    section.dataset.sectionId = 'about-us';
    const trigger = document.createElement('button');
    trigger.className = 'mega-mobile-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `${data.mobileExtraSection.label} <span class="mega-mobile-chevron"></span>`;
    const content = document.createElement('div');
    content.className = 'mega-mobile-content';
    content.setAttribute('aria-hidden', 'true');
    const ul = document.createElement('ul');
    data.mobileExtraSection.links.forEach((link) => {
      ul.innerHTML += `<li><a href="${link.href}">${link.label}</a></li>`;
    });
    content.appendChild(ul);
    section.append(trigger, content);
    accordion.appendChild(section);
  }

  // Mobile login links
  const mobileLogin = document.createElement('div');
  mobileLogin.className = 'mega-mobile-login';
  mobileLogin.innerHTML = `<h3>Log in</h3>
    <ul>${data.loginDropdown.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>`;

  // Mobile utility nav
  const mobileUtility = document.createElement('div');
  mobileUtility.className = 'mega-mobile-utility';
  data.utilityNav.forEach((item) => {
    mobileUtility.innerHTML += `<a href="${item.href}">${item.label}</a>`;
  });

  drawer.append(mobileHeader, accordion, mobileLogin, mobileUtility);
  return drawer;
}

// --- Focus Trap (for mobile drawer) ---
function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled])',
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// --- Event Handlers ---
function closeAllPanels(block) {
  // Close flyouts
  block.querySelectorAll('.mega-flyout').forEach((p) => p.setAttribute('aria-hidden', 'true'));
  block.querySelectorAll('.mega-tab-btn').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  block.querySelectorAll('.mega-tab').forEach((t) => t.classList.remove('mega-tab-open'));
  setState({ activeTabId: null });

  // Close login
  const loginPanel = block.querySelector('.mega-login-panel');
  if (loginPanel) {
    loginPanel.setAttribute('aria-hidden', 'true');
    block.querySelector('.mega-login-chevron')?.setAttribute('aria-expanded', 'false');
  }
  setState({ loginOpen: false });
}

function openTab(block, tabId, moveFocus = false) {
  closeAllPanels(block);
  const panel = block.querySelector(`#flyout-${tabId}`);
  const btn = block.querySelector(`[data-tab-id="${tabId}"]`);
  if (panel && btn) {
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    btn.closest('.mega-tab').classList.add('mega-tab-open');
    setState({ activeTabId: tabId });
    if (moveFocus) {
      const firstLink = panel.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }
}

function toggleLogin(block) {
  if (loginOpen) {
    closeAllPanels(block);
  } else {
    closeAllPanels(block);
    const panel = block.querySelector('.mega-login-panel');
    const chevron = block.querySelector('.mega-login-chevron');
    if (panel) {
      panel.setAttribute('aria-hidden', 'false');
      chevron?.setAttribute('aria-expanded', 'true');
      setState({ loginOpen: true });
      const firstLink = panel.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }
}

function bindDesktopEvents(block, data) {
  // Tab hover (color change only) + click (toggle flyout)
  block.querySelectorAll('.mega-tab-btn').forEach((btn) => {
    const { tabId } = btn.dataset;

    // Hover: change background color only, no flyout
    btn.addEventListener('mouseenter', () => {
      btn.closest('.mega-tab').classList.add('mega-tab-hover');
    });
    btn.addEventListener('mouseleave', () => {
      btn.closest('.mega-tab').classList.remove('mega-tab-hover');
    });

    // Click: toggle flyout open/close
    btn.addEventListener('click', () => {
      if (activeTabId === tabId) {
        closeAllPanels(block);
      } else {
        openTab(block, tabId);
      }
    });

    // Keyboard: Arrow keys move between tabs, ArrowDown enters flyout
    btn.addEventListener('keydown', (e) => {
      const tabs = [...block.querySelectorAll('.mega-tab-btn')];
      const idx = tabs.indexOf(btn);
      if (e.key === 'ArrowRight' && idx < tabs.length - 1) {
        e.preventDefault();
        tabs[idx + 1].focus();
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        tabs[idx - 1].focus();
      } else if (e.key === 'ArrowDown' && activeTabId === tabId) {
        e.preventDefault();
        const panel = block.querySelector(`#flyout-${tabId}`);
        const firstLink = panel?.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
  });

  // Login buttons
  const loginBtn = block.querySelector('.mega-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      window.location.href = data.loginDropdown.links[0].href;
    });
  }
  const loginChevron = block.querySelector('.mega-login-chevron');
  if (loginChevron) {
    loginChevron.addEventListener('click', () => toggleLogin(block));
  }

  // Outside click closes panels
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      closeAllPanels(block);
    }
  });

  // Escape key closes panels and restores focus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const focusedBtn = block.querySelector(`[data-tab-id="${activeTabId}"]`);
      closeAllPanels(block);
      if (focusedBtn) focusedBtn.focus();
    }
  });
}

function bindMobileEvents(block) {
  const hamburger = block.querySelector('.mega-hamburger');
  const drawer = block.querySelector('.mega-mobile-drawer');

  // Hamburger open
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const close = drawer.querySelector('.mega-mobile-close');
      if (close) close.focus();
    });
  }

  // Close button
  const closeBtn = block.querySelector('.mega-mobile-close');
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      drawer.querySelectorAll('.mega-mobile-trigger').forEach((t) => t.setAttribute('aria-expanded', 'false'));
      drawer.querySelectorAll('.mega-mobile-content').forEach((c) => c.setAttribute('aria-hidden', 'true'));
      hamburger?.focus();
    });
    drawer.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeBtn.click();
      }
    });
  }

  // Accordion triggers
  block.querySelectorAll('.mega-mobile-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const section = trigger.closest('.mega-mobile-section');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Collapse all
      block.querySelectorAll('.mega-mobile-trigger').forEach((t) => t.setAttribute('aria-expanded', 'false'));
      block.querySelectorAll('.mega-mobile-content').forEach((c) => c.setAttribute('aria-hidden', 'true'));

      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        section.querySelector('.mega-mobile-content').setAttribute('aria-hidden', 'false');
      }
    });
  });
}

// --- Main Decorate ---
export default async function decorate(block) {
  // Load nav fragment (standard EDS pattern)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let fragment = await loadFragment(navPath);
  if (!fragment && !navMeta) {
    fragment = await loadFragment('/content/nav');
  }
  if (!fragment) return;

  // Parse fragment into data
  const data = parseNavFragment(fragment);

  block.textContent = '';

  // Alert banner (from separate fragment)
  const alertBanner = await loadAlertBanner();

  // Desktop header
  const { header: desktopHeader } = buildDesktopHeader(data);

  // Utility bar (below dark header bar, with icons)
  const utilityBar = buildUtilityBar(data);

  // Flyout panels container
  const flyoutContainer = document.createElement('div');
  flyoutContainer.className = 'mega-flyout-container';
  data.primaryNav.forEach((tab) => {
    if (tab.links.length > 0 && tab.id !== 'about-us') {
      flyoutContainer.appendChild(buildFlyoutPanel(tab));
    }
  });

  // Mobile hamburger
  const hamburger = document.createElement('button');
  hamburger.className = 'mega-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  // Mobile drawer
  const mobileDrawer = buildMobileNav(data);

  // Skip-to-content link
  const skipLink = document.createElement('a');
  skipLink.className = 'mega-skip-link';
  skipLink.href = '#main';
  skipLink.textContent = 'Skip to main content';

  // Assemble
  const navWrapper = document.createElement('div');
  navWrapper.className = 'mega-nav-wrapper';
  navWrapper.prepend(skipLink);
  if (alertBanner) navWrapper.appendChild(alertBanner);

  const headerBar = document.createElement('div');
  headerBar.className = 'mega-header-bar';

  const mobileBar = document.createElement('div');
  mobileBar.className = 'mega-mobile-bar';
  mobileBar.innerHTML = `<a href="${data.logo.href}" class="mega-mobile-logo-inline">
    <img src="${data.logo.src}" alt="${data.logo.alt}" loading="eager">
  </a>`;
  mobileBar.prepend(hamburger);

  headerBar.append(mobileBar, desktopHeader);
  // Utility bar is OUTSIDE headerBar (not inside it)
  navWrapper.append(headerBar, utilityBar, flyoutContainer, mobileDrawer);
  block.appendChild(navWrapper);

  // Ensure main element has id for skip link
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';

  // Focus trap for mobile drawer
  trapFocus(mobileDrawer);

  // Bind events
  bindDesktopEvents(block, data);
  bindMobileEvents(block);

  // Handle responsive changes
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      closeAllPanels(block);
    }
  });
}
