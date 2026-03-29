/* eslint-disable */
/* global WebImporter */

/**
 * Parser: announcement-banner
 * Base: announcement-banner (CBA custom)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19
 *
 * Source DOM structure (from captured HTML):
 * .toast-module > .toast-item.announcement
 *   > .toast-para > p > b (announcement text)
 *   > .toast-button-wrapper
 *     > a.toast-round-button (CTA link, e.g. "Tell me more")
 *     > span > a.toast-dismiss-button ("Dismiss")
 *
 * Target EDS block structure:
 * | Announcement Banner |
 * |---------------------|
 * | [announcement text with CTA link] |
 */
export default function parse(element, { document }) {
  // Extract announcement text from .toast-para
  const textEl = element.querySelector('.toast-para p, .toast-para');
  // Extract CTA link (e.g. "Tell me more")
  const ctaLink = element.querySelector('a.toast-round-button, .toast-button-wrapper a:not(.toast-dismiss-button)');

  const contentCell = [];
  if (textEl) {
    // Clone the text content (bold paragraph)
    const p = document.createElement('p');
    p.innerHTML = textEl.innerHTML;
    contentCell.push(p);
  }
  if (ctaLink) {
    const a = document.createElement('a');
    a.href = ctaLink.getAttribute('href');
    a.textContent = ctaLink.textContent.trim();
    contentCell.push(a);
  }

  const cells = [contentCell];
  const block = WebImporter.Blocks.createBlock(document, { name: 'announcement-banner', cells });
  element.replaceWith(block);
}
