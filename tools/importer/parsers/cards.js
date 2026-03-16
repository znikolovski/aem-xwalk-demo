/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Extracts icon tile cards from .inpage-nav__links (Calculators and Tools).
 * Model: card (image, text)
 * Each card = 1 row with 2 columns: [icon image | link text]
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('li.inpage-nav__link');
  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a');
    if (!link) return;

    // Column 1: Icon image with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));

    const icon = item.querySelector('.inpage-nav__svg-icon img, .inpage-nav__link-icon img');
    if (icon) {
      const pic = document.createElement('picture');
      const img = document.createElement('img');
      img.src = icon.src || icon.getAttribute('src') || '';
      img.alt = icon.alt || icon.getAttribute('alt') || '';
      pic.appendChild(img);
      imageCell.appendChild(pic);
    }

    // Column 2: Link text with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    const linkText = item.querySelector('.inpage-nav__link-text');
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href') || '';
    a.textContent = linkText ? linkText.textContent.trim() : link.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(a);
    textCell.appendChild(p);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
