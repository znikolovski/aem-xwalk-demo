/* eslint-disable */
/* global WebImporter */

/**
 * Parser: article-cards
 * Base: article-cards (CBA custom)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19
 *
 * Source DOM structure (from captured HTML):
 * .column-control .four-column
 *   > .col-sm-12.col-md-6.col-lg (×4 card columns)
 *     > .content-module
 *       > .item
 *         > .image-section > img (thumbnail 375×200)
 *         > .item-inner
 *           > div > h3 > b (heading, sometimes without b)
 *           > div > p (description)
 *           > p > a.button_tertiary ("Read more" link)
 *
 * Target EDS block structure:
 * | Article Cards |
 * |---------------|
 * | image | h3 heading + description + Read more link |
 * | image | h3 heading + description + Read more link |
 * | ... (one row per card) |
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all card columns
  const cardCols = element.querySelectorAll('.col-sm-12.col-md-6.col-lg, [class*="col-lg"]');

  cardCols.forEach((col) => {
    const item = col.querySelector('.item');
    if (!item) return;

    // Extract thumbnail image
    const img = item.querySelector('.image-section img, img');

    // Extract heading (h3, may be wrapped in b)
    const heading = item.querySelector('.item-inner h3');

    // Extract description paragraph (first p inside item-inner div, not the CTA p)
    const descDiv = item.querySelector('.item-inner > div');
    const descP = descDiv ? descDiv.querySelector('p') : null;

    // Extract Read more link
    const readMore = item.querySelector('a.button_tertiary, .item-inner > p > a');

    // Cell 1: Image
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.getAttribute('src') || img.getAttribute('data-src');
      newImg.alt = img.getAttribute('alt') || '';
      imageCell.append(newImg);
    }

    // Cell 2: Content (heading + description + link)
    const contentCell = document.createElement('div');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.append(h3);
    }
    if (descP) {
      const p = document.createElement('p');
      p.textContent = descP.textContent.trim();
      contentCell.append(p);
    }
    if (readMore) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = readMore.getAttribute('href');
      a.textContent = readMore.textContent.trim();
      p.append(a);
      contentCell.append(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-cards', cells });
  element.replaceWith(block);
}
