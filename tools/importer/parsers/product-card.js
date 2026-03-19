/* eslint-disable */
/* global WebImporter */

/**
 * Parser: product-card
 * Base: product-card (CBA custom)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19
 *
 * Source DOM structure (from captured HTML):
 * .card-module-alt
 *   > .card-combo
 *     > .header-section > h2 (section heading - extracted separately as default content)
 *     > .card-section[role="list"]
 *       > .carditem[role="listitem"] (×2 large promo cards)
 *         > .card.promotion
 *           > .img-container > img (large image 780×416)
 *           > .card-container
 *             > .card-header > h3 > p (heading)
 *             > .card-content > p (description)
 *             > .card-cta > a.button_tertiary ("Read more" link)
 *       > .carditem[role="listitem"] (×3 mini cards, contains .minicard)
 *         > .minicard
 *           > .card.mini > a (fully clickable link wrapping entire card)
 *             > .img-container > img (small thumbnail :ARTTHUMB)
 *             > .card-container > .card-header (title text, no heading tag)
 *
 * Target EDS block structure:
 * | Product Card |
 * |-------------|
 * | image | h3 heading + description + CTA link |  (large cards)
 * | thumbnail | title link |  (mini cards)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Process large promo cards (have .card.promotion)
  const largeCards = element.querySelectorAll('.card-section > .carditem > .card.promotion');

  largeCards.forEach((card) => {
    const img = card.querySelector('.img-container img');
    const heading = card.querySelector('.card-header h3');
    const description = card.querySelector('.card-content p');
    const ctaLink = card.querySelector('.card-cta a');

    // Cell 1: Image
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.getAttribute('src') || img.getAttribute('data-src');
      newImg.alt = img.getAttribute('alt') || '';
      imageCell.append(newImg);
    }

    // Cell 2: Content
    const contentCell = document.createElement('div');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.append(h3);
    }
    if (description) {
      const text = description.textContent.trim();
      if (text && text !== '\u00a0') {
        const p = document.createElement('p');
        p.textContent = text;
        contentCell.append(p);
      }
    }
    if (ctaLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href');
      a.textContent = ctaLink.textContent.trim();
      p.append(a);
      contentCell.append(p);
    }

    cells.push([imageCell, contentCell]);
  });

  // Process mini cards (have .minicard > .card.mini)
  const miniCards = element.querySelectorAll('.minicard');

  miniCards.forEach((mini) => {
    const link = mini.querySelector('.card.mini > a');
    const img = mini.querySelector('.img-container img');
    const titleEl = mini.querySelector('.card-header');

    // Cell 1: Thumbnail
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.getAttribute('src') || img.getAttribute('data-src');
      newImg.alt = img.getAttribute('alt') || '';
      imageCell.append(newImg);
    }

    // Cell 2: Title as link
    const contentCell = document.createElement('div');
    if (link && titleEl) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = titleEl.textContent.trim();
      contentCell.append(a);
    } else if (titleEl) {
      contentCell.textContent = titleEl.textContent.trim();
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'product-card', cells });
  element.replaceWith(block);
}
