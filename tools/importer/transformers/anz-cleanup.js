/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ANZ site cleanup.
 * Selectors from captured DOM of https://www.anz.com.au/personal/
 * Removes non-authorable content, cleans up AEM JCR artifacts,
 * and flattens container hierarchy for proper section breaks.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent overlays and tracking elements
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#CybotCookiebotDialog',
      '.lpSS_18942001799',
      '#lpButtonDiv',
      'iframe[title="Adobe ID Syncing iFrame"]',
      'iframe[title="Intentionally blank"]',
      '.overlay',
    ]);

    // Fix relative URLs to absolute for ANZ domain
    element.querySelectorAll('a[href^="/"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        a.setAttribute('href', `https://www.anz.com.au${href}`);
      }
    });

    // Fix relative image src to absolute
    element.querySelectorAll('img[src^="/content/"]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        img.setAttribute('src', `https://www.anz.com.au${src}`);
      }
    });

    // Unwrap .invisibleMbox wrappers (Adobe Target containers)
    element.querySelectorAll('.invisibleMbox').forEach((el) => {
      while (el.firstChild) {
        el.parentNode.insertBefore(el.firstChild, el);
      }
      el.remove();
    });

    // Remove header, footer, navigation and all non-main content
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav',
      'footer',
      '.header',
      '.navigation',
      '.desktop-menu',
      '.mobile-menu',
      '.mobile',
      '.primary__nav',
      '.secondary__nav',
      '.subNav',
      '.logonbox',
      '.siteSearch',
      '.backtotop',
      '#skiplinks',
      '#skiptocontent',
    ]);

    // Remove skip links
    element.querySelectorAll('a[href="#skip_logon"], a[href="#main_skip"]').forEach((a) => {
      const parent = a.parentElement;
      a.remove();
      if (parent && parent.tagName === 'P' && !parent.textContent.trim()) {
        parent.remove();
      }
    });

    // ── Promote <main> content ──
    // Clear body and only keep main's children (removes .butter-bar, nav remnants, etc.)
    const main = element.querySelector('main');
    if (main) {
      // Collect main's children
      const mainChildren = [];
      while (main.firstChild) {
        mainChildren.push(main.removeChild(main.firstChild));
      }

      // Clear body completely
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }

      // Add back only main's children
      mainChildren.forEach((child) => element.appendChild(child));
    }

    // ── Unwrap intermediate AEM containers ──
    // These nest content sections inside wrapper divs, preventing flat section structure

    // Unwrap #main_skip (wraps hero + main-container)
    const mainSkip = element.querySelector('#main_skip');
    if (mainSkip) {
      while (mainSkip.firstChild) {
        mainSkip.parentNode.insertBefore(mainSkip.firstChild, mainSkip);
      }
      mainSkip.remove();
    }

    // Unwrap #main-container (wraps all non-hero content sections)
    const mainContainer = element.querySelector('#main-container');
    if (mainContainer) {
      while (mainContainer.firstChild) {
        mainContainer.parentNode.insertBefore(mainContainer.firstChild, mainContainer);
      }
      mainContainer.remove();
    }

    // Unwrap .at-element-marker wrappers (Adobe Target section wrappers)
    element.querySelectorAll('.at-element-marker').forEach((el) => {
      while (el.firstChild) {
        el.parentNode.insertBefore(el.firstChild, el);
      }
      el.remove();
    });

    // ── Remove AEM junk elements ──
    WebImporter.DOMUtils.remove(element, [
      '.newpar',
      '.iparys_inherited',
      '.end',
      'noscript',
    ]);

    // Remove script tags from content area
    element.querySelectorAll('script').forEach((s) => s.remove());

    // Remove "End of mobile menu" button/text (leftover from mobile nav)
    element.querySelectorAll('*').forEach((el) => {
      const text = el.textContent.trim();
      if (text === 'End of mobile menu. Close mobile menu' || text === 'End of mobile menu') {
        el.remove();
      }
    });

    // ── Remove decorative line divider images ──
    // These are .text.parbase divs containing only a line image between sections
    element.querySelectorAll('.text.parbase').forEach((tp) => {
      const imgs = tp.querySelectorAll('img');
      const hasLineImg = Array.from(imgs).some((img) => {
        const src = (img.getAttribute('src') || '').toLowerCase();
        return src.includes('line');
      });
      // If this .text.parbase only has a line image (no meaningful text), remove it
      const textContent = tp.textContent.trim().replace(/\u00a0/g, '');
      if (hasLineImg && !textContent) {
        tp.remove();
      }
    });

    // Also catch any remaining line divider images outside .text.parbase
    element.querySelectorAll('img').forEach((img) => {
      const src = (img.getAttribute('src') || '').toLowerCase();
      if (src.includes('line') && (src.includes('divider') || src.includes('/line'))) {
        if (!img.closest('.hero') && !img.closest('.textimage')) {
          const parent = img.parentElement;
          if (parent && parent.tagName === 'P' && parent.children.length === 1) {
            parent.remove();
          } else {
            img.remove();
          }
        }
      }
    });

    // Remove empty paragraphs and spacer divs
    element.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img, a, picture')) {
        p.remove();
      }
    });

    // Remove empty wrapper divs that have no content or children
    element.querySelectorAll('.columns, .text.parbase').forEach((div) => {
      if (!div.textContent.trim() && !div.querySelector('img, a, picture, table')) {
        div.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up AEM-specific tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-track-category');
      el.removeAttribute('data-track-action');
      el.removeAttribute('data-track-label');
      el.removeAttribute('onclick');
      el.removeAttribute('data-sly-test');
      el.removeAttribute('data-sly-include');
      el.removeAttribute('data-sly-unwrap');
    });

    // Clean mbox/adobe_mc tracking from non-CTA links (preserve pid= on CTAs)
    element.querySelectorAll('a[href*="mboxid="], a[href*="adobe_mc="]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href && !href.includes('pid=')) {
        try {
          const url = new URL(href, 'https://www.anz.com.au');
          url.searchParams.delete('mboxid');
          url.searchParams.delete('adobe_mc');
          a.setAttribute('href', url.toString());
        } catch (e) {
          // Keep original href if URL parsing fails
        }
      }
    });

    // Remove any remaining non-authorable elements
    WebImporter.DOMUtils.remove(element, [
      '.hero__breadcrumb',
      '.extra',
      'link',
    ]);
  }
}
