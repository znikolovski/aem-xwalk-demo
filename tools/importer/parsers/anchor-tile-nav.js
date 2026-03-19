/* eslint-disable */
/* global WebImporter */

/**
 * Parser: anchor-tile-nav
 * Base: anchor-tile-nav (CBA custom)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19 (updated selector)
 *
 * Source DOM structure (from captured HTML):
 * .homepage-six-pack .six-packs-wrapper
 *   > .six-pack-links (×6 tiles)
 *     > .items-head > h3 > a (icon link with heading)
 *       > span.icon > img (pictogram icon)
 *       > div > span (heading text)
 *     > .items-list > div > ul.hyperlink-list
 *       > li > a (sub-links, typically 3 per tile)
 *
 * Target EDS block structure:
 * | Anchor Tile Nav |
 * |-----------------|
 * | ![icon](svg) | heading link + sub-links |
 * | ![icon](svg) | heading link + sub-links |
 * | ... (one row per tile) |
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all tile containers
  const tiles = element.querySelectorAll('.six-pack-links');

  tiles.forEach((tile) => {
    // Extract icon image from desktop heading link
    const icon = tile.querySelector('.items-head img');
    // Extract heading link
    const headingLink = tile.querySelector('.items-head h3 > a');
    // Extract sub-links
    const subLinks = tile.querySelectorAll('.items-list ul li a');

    // Cell 1: Icon image
    const iconCell = document.createElement('div');
    if (icon) {
      const img = document.createElement('img');
      img.src = icon.getAttribute('src');
      img.alt = icon.getAttribute('alt') || '';
      iconCell.append(img);
    }

    // Cell 2: Heading link + sub-links list
    const contentCell = document.createElement('div');
    if (headingLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = headingLink.getAttribute('href');
      // Extract heading text from nested structure: a > div > span (text)
      // Try multiple selector patterns for robustness
      let headingText = '';
      const textSpan = tile.querySelector('.items-head h3 a div span:first-child')
        || tile.querySelector('.items-head h3 a div')
        || tile.querySelector('.items-head h3 a span:not(.icon)');
      if (textSpan) {
        headingText = textSpan.textContent.trim();
      }
      // Fallback: extract all text nodes from the link, excluding icon/img content
      if (!headingText) {
        const clone = headingLink.cloneNode(true);
        // Remove icon elements
        clone.querySelectorAll('img, .icon, svg').forEach((el) => el.remove());
        headingText = clone.textContent.trim();
      }
      a.textContent = headingText;
      h3.append(a);
      contentCell.append(h3);
    }

    if (subLinks.length > 0) {
      const ul = document.createElement('ul');
      subLinks.forEach((link) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = link.textContent.trim();
        li.append(a);
        ul.append(li);
      });
      contentCell.append(ul);
    }

    cells.push([iconCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'anchor-tile-nav', cells });
  element.replaceWith(block);
}
