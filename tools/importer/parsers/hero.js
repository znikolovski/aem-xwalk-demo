/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero
 * Base: hero (Block Collection)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19
 *
 * Source DOM structure (from captured HTML):
 * .hero-banner-module
 *   > .banner-image > img (background image with data-image-desktop-src)
 *   > .banner-content-panel > .banner-content
 *     > h1.sr-only (hidden heading)
 *     > h2 (visible heading)
 *     > div > p (description paragraph)
 *     > .cta > p > a.button_secondary (CTA link)
 *
 * Target EDS block structure:
 * | Hero |
 * |------|
 * | ![bg image](src) |
 * | h2 heading + p description + CTA link |
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImg = element.querySelector('.banner-image img, img[data-image-desktop-src]');

  // Extract heading (h2 visible, h1 is sr-only)
  const heading = element.querySelector('.banner-content h2, .banner-content h1:not(.sr-only), h2');

  // Extract description paragraph
  const description = element.querySelector('.banner-content div > p, .banner-content p');

  // Extract CTA link
  const ctaLink = element.querySelector('.cta a, .banner-content a.button_primary, .banner-content a.button_secondary');

  const cells = [];

  // Row 1: Background image
  if (bgImg) {
    const img = document.createElement('img');
    img.src = bgImg.getAttribute('src') || bgImg.getAttribute('data-image-desktop-src');
    img.alt = bgImg.getAttribute('alt') || '';
    cells.push([img]);
  }

  // Row 2: Content (heading + description + CTA) in a single cell
  const contentWrapper = document.createElement('div');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentWrapper.append(h2);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentWrapper.append(p);
  }
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.getAttribute('href');
    a.textContent = ctaLink.textContent.trim();
    p.append(a);
    contentWrapper.append(p);
  }
  if (contentWrapper.children.length > 0) {
    cells.push([contentWrapper]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
