/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: CommBank cleanup.
 * Removes non-authorable content and CBA-specific wrappers.
 * Selectors from captured DOM of www.commbank.com.au.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove CommBank header/navigation and skip links
    // CommBank uses div.commbank-header instead of <header> tag
    WebImporter.DOMUtils.remove(element, [
      '.skip-links-module',
      '.commbank-header',
      '.commbank-footer',
      '.page-lockout',
    ]);

    // Remove cookie/consent overlays (from captured DOM: .gdpr-banner, #onetrust)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.gdpr-banner',
      '[class*="cookie"]',
    ]);

    // Remove AEM Target mbox wrappers but keep inner content
    // From captured DOM: <div class="mboxDefault">
    element.querySelectorAll('.mboxDefault').forEach((mbox) => {
      const parent = mbox.parentElement;
      while (mbox.firstChild) {
        parent.insertBefore(mbox.firstChild, mbox);
      }
      mbox.remove();
    });

    // Unwrap experience fragment containers (keep inner content for parsers)
    // From captured DOM: <div class="experiencefragment"><div class="cmp-experiencefragment ...">
    element.querySelectorAll('.experiencefragment').forEach((xf) => {
      const parent = xf.parentElement;
      if (parent) {
        while (xf.firstChild) {
          parent.insertBefore(xf.firstChild, xf);
        }
        xf.remove();
      }
    });

    // Remove ContextHub elements (from captured DOM: #contexthub, .cq-analytics-*)
    WebImporter.DOMUtils.remove(element, [
      '#ContextHub',
      '#contexthub',
      '[class*="cq-analytics"]',
      '[id*="contexthub"]',
    ]);

    // Strip ?ei= parameters from all links (CBA migration rule)
    element.querySelectorAll('a[href*="?ei="]').forEach((a) => {
      const url = new URL(a.href, 'https://www.commbank.com.au');
      const ei = url.searchParams.get('ei');
      if (ei) {
        a.setAttribute('data-analytics-event', ei);
        url.searchParams.delete('ei');
        a.href = url.pathname + url.search + url.hash;
      }
    });

    // Normalise Scene7 image URLs - strip crop params
    // From captured DOM: src contains $W780_H416$, $W375_H200$, :ARTTHUMB, .transform/
    element.querySelectorAll('img[src*="assets.commbank.com.au"]').forEach((img) => {
      let src = img.getAttribute('src');
      // Strip Scene7 crop presets like $W780_H416$, $W728_H432$, :ARTTHUMB
      src = src.replace(/\?\$[^$]+\$.*$/, '');
      src = src.replace(/:[A-Z]+$/, '');
      src = src.replace(/\.transform\/[^/]+\/image\.\w+$/, '');
      img.setAttribute('src', src);
    });

    // Also normalise data-src attributes
    element.querySelectorAll('img[data-src*="assets.commbank.com.au"]').forEach((img) => {
      let src = img.getAttribute('data-src');
      src = src.replace(/\?\$[^$]+\$.*$/, '');
      src = src.replace(/:[A-Z]+$/, '');
      src = src.replace(/\.transform\/[^/]+\/image\.\w+$/, '');
      img.setAttribute('data-src', src);
    });

    // Remove mobile accordion button duplicates (from captured DOM: .common-mobile-accordion-button)
    WebImporter.DOMUtils.remove(element, ['.common-mobile-accordion-button']);

    // Remove mobile CTAs that duplicate desktop links (from captured DOM: .mobile-cta)
    WebImporter.DOMUtils.remove(element, ['.mobile-cta']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable chrome (header, footer, nav, breadcrumbs)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.breadcrumb',
      '[class*="breadcrumb"]',
    ]);

    // Remove CBA-specific non-authorable elements (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'iframe',
      'script',
    ]);

    // Remove data-tracker attributes (CBA analytics - replaced by data-analytics-event)
    element.querySelectorAll('[data-tracker-type]').forEach((el) => {
      el.removeAttribute('data-tracker-type');
      el.removeAttribute('data-tracker-locationid');
      el.removeAttribute('data-tracker_ei');
      el.removeAttribute('data-tracker-id');
      el.removeAttribute('data-fl-countingmethod');
      el.removeAttribute('data-fl-event');
      el.removeAttribute('dtmtracker');
    });

    // Remove arrow icon spans (from captured DOM: .hc1-icon-arrow-right, .icon-right-arrow)
    WebImporter.DOMUtils.remove(element, [
      '.hc1-icon-arrow-right',
      '.icon-right-arrow',
      '[class*="right-hc-icon"]',
    ]);

    // Remove inline styles that won't apply in EDS
    element.querySelectorAll('[style]').forEach((el) => {
      el.removeAttribute('style');
    });
  }
}
