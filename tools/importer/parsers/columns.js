/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Handles 2-column (eightfour) and 3/4-column (three-columns, four-columns) layouts.
 * Note: Columns blocks do NOT require field hints (per hinting.md exception).
 *
 * Variants handled:
 * - Your Money Matters: 3-col (heading | links | image) via container__item children
 * - Cost of Living / Need Help: 2-col eightfour (image | badge+heading+links+CTA) via main/aside
 * - ANZ Plus: 3-col (badge+heading | content+bullets | device image) via container__item children
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find column containers - main/aside pattern for 2-col layouts
  const mainCol = element.querySelector('.container__items.container__main');
  const asideCol = element.querySelector('.container__items.container__aside');

  if (mainCol && asideCol) {
    // 2-column layout (eightfour): main and aside are separate column zones
    const leftCell = extractColumnContent(mainCol, document);
    const rightCell = extractColumnContent(asideCol, document);
    cells.push([leftCell, rightCell]);
  } else if (mainCol) {
    // Multi-column layout: columns are container__item children within container__main
    const colItems = mainCol.querySelectorAll(':scope .container__item.container__main__element');
    if (colItems.length > 1) {
      const row = [];
      colItems.forEach((col) => {
        row.push(extractColumnContent(col, document));
      });
      cells.push(row);
    } else {
      // Single item fallback
      cells.push([extractColumnContent(mainCol, document)]);
    }
  } else {
    // Final fallback: extract from element directly
    cells.push([extractColumnContent(element, document)]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}

/**
 * Extract meaningful content from a column container.
 * Preserves headings, paragraphs, images, links, badges, lists, and CTAs.
 */
function extractColumnContent(container, document) {
  const frag = document.createDocumentFragment();

  // Extract images (from textimage.parbase or direct img tags)
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    const src = img.src || img.getAttribute('src') || '';
    // Skip tiny tracking pixels and empty sources
    if (!src || src.includes('spacer') || src.includes('1x1')) return;
    const pic = document.createElement('picture');
    const newImg = document.createElement('img');
    newImg.src = src;
    newImg.alt = img.alt || img.getAttribute('alt') || '';
    pic.appendChild(newImg);
    frag.appendChild(pic);
  });

  // Extract text content blocks
  const textBlocks = container.querySelectorAll('.text.parbase, .text');
  textBlocks.forEach((textBlock) => {
    // Process headings
    const headings = textBlock.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((h) => {
      const newH = document.createElement(h.tagName.toLowerCase());
      newH.textContent = h.textContent.trim();
      if (newH.textContent) frag.appendChild(newH);
    });

    // Process paragraphs (including badges, links, CTAs)
    const paras = textBlock.querySelectorAll('p');
    paras.forEach((p) => {
      const text = p.textContent.trim();
      if (!text || text === '\u00a0') return;

      const newP = document.createElement('p');

      // Check for badge/pill text
      const badge = p.querySelector('.pill--text--dark, .pill--text');
      if (badge) {
        const strong = document.createElement('strong');
        strong.textContent = badge.textContent.trim();
        newP.appendChild(strong);
        frag.appendChild(newP);
        return;
      }

      // Check for CTA button
      const btn = p.querySelector('a.btn, a.btn--blue, a.btn--transparent');
      if (btn) {
        const a = document.createElement('a');
        a.href = btn.href || btn.getAttribute('href') || '';
        a.textContent = btn.textContent.trim();
        newP.appendChild(a);
        frag.appendChild(newP);
        return;
      }

      // Check for links in paragraph
      const links = p.querySelectorAll('a');
      if (links.length > 0) {
        // If the paragraph has significant text beyond the link, preserve full content
        const linkText = Array.from(links).map((l) => l.textContent.trim()).join('');
        const fullText = text.replace(/\s+/g, ' ');
        const isLinkOnly = fullText === linkText.replace(/\s+/g, ' ');

        if (isLinkOnly) {
          // Paragraph is just a link - extract cleanly
          const link = links[0];
          const a = document.createElement('a');
          a.href = link.href || link.getAttribute('href') || '';
          a.textContent = link.textContent.trim();
          newP.appendChild(a);
        } else {
          // Paragraph has mixed content (text + links) - preserve inline structure
          newP.innerHTML = p.innerHTML;
        }
        frag.appendChild(newP);
        return;
      }

      // Plain text paragraph
      newP.textContent = text;
      frag.appendChild(newP);
    });

    // Process unordered lists (e.g., ANZ Plus feature bullets)
    const lists = textBlock.querySelectorAll('ul');
    lists.forEach((ul) => {
      const newUl = document.createElement('ul');
      const items = ul.querySelectorAll('li');
      items.forEach((li) => {
        const text = li.textContent.trim();
        if (text) {
          const newLi = document.createElement('li');
          newLi.textContent = text;
          newUl.appendChild(newLi);
        }
      });
      if (newUl.hasChildNodes()) frag.appendChild(newUl);
    });
  });

  // If nothing was extracted, try getting text directly
  if (!frag.hasChildNodes()) {
    const text = container.textContent.trim();
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      frag.appendChild(p);
    }
  }

  return frag;
}
