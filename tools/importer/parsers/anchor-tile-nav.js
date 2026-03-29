/* eslint-disable */
/* global WebImporter */

/**
 * Parser: anchor-tile-nav
 * Base: anchor-tile-nav (CBA custom)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19 (updated selector)
 *
 * Handles TWO source DOM variants:
 *
 * Variant A — Homepage (.six-packs-module / .homepage-six-pack):
 * .homepage-six-pack .six-packs-wrapper
 *   > .six-pack-links (×6 tiles)
 *     > .items-head > h3 > a (icon link with heading)
 *       > span.icon > img (pictogram icon)
 *       > div > span (heading text)
 *     > .items-list > div > ul.hyperlink-list
 *       > li > a (sub-links, typically 3 per tile)
 *
 * Variant B — Product pages (.section-navigation):
 * .section-navigation
 *   > nav.section-navigation-module > ul.hyperlink-list
 *     > li > a (×8 icon tiles)
 *       > img (pictogram icon)
 *       > span (label text)
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

  // Detect which variant: homepage six-pack or product section-navigation
  const isHomepageSixPack = element.querySelector('.six-pack-links');
  const isSectionNav = element.querySelector('.section-navigation-module, ul.hyperlink-list');

  if (isHomepageSixPack) {
    // Variant A: Homepage six-pack tiles with sub-links
    const tiles = element.querySelectorAll('.six-pack-links');

    tiles.forEach((tile) => {
      const icon = tile.querySelector('.items-head img');
      const headingLink = tile.querySelector('.items-head h3 > a');
      const subLinks = tile.querySelectorAll('.items-list ul li a');

      const iconCell = document.createElement('div');
      if (icon) {
        const img = document.createElement('img');
        img.src = icon.getAttribute('src');
        img.alt = icon.getAttribute('alt') || '';
        iconCell.append(img);
      }

      const contentCell = document.createElement('div');
      if (headingLink) {
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        a.href = headingLink.getAttribute('href');
        let headingText = '';
        const textSpan = tile.querySelector('.items-head h3 a div span:first-child')
          || tile.querySelector('.items-head h3 a div')
          || tile.querySelector('.items-head h3 a span:not(.icon)');
        if (textSpan) {
          headingText = textSpan.textContent.trim();
        }
        if (!headingText) {
          const clone = headingLink.cloneNode(true);
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
  } else if (isSectionNav) {
    // Variant B: Product page section-navigation (flat icon tiles)
    const navLinks = element.querySelectorAll('ul.hyperlink-list > li > a');

    navLinks.forEach((link) => {
      const icon = link.querySelector('img');
      const labelSpan = link.querySelector('span');

      const iconCell = document.createElement('div');
      if (icon) {
        const img = document.createElement('img');
        img.src = icon.getAttribute('src');
        img.alt = '';
        iconCell.append(img);
      }

      const contentCell = document.createElement('div');
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = labelSpan ? labelSpan.textContent.trim() : link.textContent.trim();
      contentCell.append(a);

      cells.push([iconCell, contentCell]);
    });
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'anchor-tile-nav', cells });
    element.replaceWith(block);
  }
}
