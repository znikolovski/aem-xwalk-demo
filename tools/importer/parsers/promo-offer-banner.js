/* eslint-disable */
/* global WebImporter */

/**
 * Parser: promo-offer-banner
 * Base: promo-offer-banner (CBA custom)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19
 *
 * Source DOM structure (from captured HTML):
 * .fifty-split-module
 *   > .content-wrapper
 *     > h2 (heading)
 *     > .item > p (description)
 *     > .item > p > a.button_primary (CTA link)
 *   > .image-wrapper > .row.image > img (promo image)
 *
 * Target EDS block structure:
 * | Promo Offer Banner |
 * |--------------------|
 * | h2 + description + CTA | image |
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('.content-wrapper h2, h2');

  // Extract description paragraphs (exclude CTA paragraph)
  const descParagraphs = element.querySelectorAll('.content-wrapper .item > p:not(:has(a.button_primary)):not(:has(a.button_secondary))');

  // Extract CTA link
  const ctaLink = element.querySelector('.content-wrapper a.button_primary, .content-wrapper a.button_secondary, .content-wrapper .item a');

  // Extract promo image
  const promoImg = element.querySelector('.image-wrapper img, .row.image img');

  // Cell 1: Content (heading + description + CTA)
  const contentCell = document.createElement('div');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.append(h2);
  }

  // Add description paragraphs (filter out empty and CTA paragraphs)
  descParagraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (text && text !== '\u00a0' && !p.querySelector('a.button_primary, a.button_secondary')) {
      const newP = document.createElement('p');
      newP.textContent = text;
      contentCell.append(newP);
    }
  });

  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.getAttribute('href');
    a.textContent = ctaLink.textContent.trim();
    p.append(a);
    contentCell.append(p);
  }

  // Cell 2: Image
  const imageCell = document.createElement('div');
  if (promoImg) {
    const img = document.createElement('img');
    img.src = promoImg.getAttribute('src') || promoImg.getAttribute('data-src');
    img.alt = promoImg.getAttribute('alt') || '';
    imageCell.append(img);
  }

  const cells = [[contentCell, imageCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'promo-offer-banner', cells });
  element.replaceWith(block);
}
