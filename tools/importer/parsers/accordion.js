/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block.
 * Extracts Important Information accordion with 34+ disclaimers.
 * Model: accordion-item (summary, text)
 * Preserves disclaimer anchor IDs and back-to-origin Return links.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract the main accordion heading
  const headingEl = element.querySelector('.accordion__heading .accordion__span, .accordion__heading');
  const mainHeading = headingEl ? headingEl.textContent.trim() : 'Important information';

  // Get the accordion content area
  const content = element.querySelector('.accordion__content');
  if (!content) {
    // No content found, create a minimal accordion item
    const summaryCell = document.createDocumentFragment();
    summaryCell.appendChild(document.createComment(' field:summary '));
    summaryCell.appendChild(document.createTextNode(mainHeading));
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    cells.push([summaryCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
    element.replaceWith(block);
    return;
  }

  // Extract general disclaimers (before #disclaimer div) as the first item
  const generalContent = document.createDocumentFragment();
  const childNodes = Array.from(content.children);
  const disclaimerDiv = content.querySelector('#disclaimer');

  // Collect pre-disclaimer general text
  for (const child of childNodes) {
    if (child.id === 'disclaimer') break;
    if (child.tagName === 'P' || child.tagName === 'DIV') {
      const text = child.textContent.trim();
      if (text && text !== '\u00a0') {
        const p = document.createElement('p');
        // Preserve links within disclaimer text
        const links = child.querySelectorAll('a');
        if (links.length > 0) {
          p.innerHTML = child.innerHTML;
        } else {
          p.textContent = text;
        }
        generalContent.appendChild(p);
      }
    }
  }

  // Create the main accordion item with general disclaimers
  if (generalContent.hasChildNodes()) {
    const summaryCell = document.createDocumentFragment();
    summaryCell.appendChild(document.createComment(' field:summary '));
    summaryCell.appendChild(document.createTextNode(mainHeading));

    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    textCell.appendChild(generalContent);
    cells.push([summaryCell, textCell]);
  }

  // Extract individual disclaimers from #disclaimer div
  if (disclaimerDiv) {
    const disclaimerItems = disclaimerDiv.querySelectorAll(':scope > div[id]');

    disclaimerItems.forEach((item) => {
      const disclaimerId = item.id;

      // Build summary from the disclaimer ID (clean up the JCR path)
      const summaryText = disclaimerId
        .replace(/_content_anzcomau_en_reusable_/g, '')
        .replace(/_/g, ' ')
        .replace(/^personal\s+/, '')
        .replace(/^waystobank\s+/, '')
        .replace(/disclaimers?\s*/g, '')
        .trim();

      const summaryCell = document.createDocumentFragment();
      summaryCell.appendChild(document.createComment(' field:summary '));
      summaryCell.appendChild(document.createTextNode(summaryText || disclaimerId));

      // Build text cell with disclaimer content, preserving links and Return
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:text '));

      const contentDiv = document.createElement('div');
      contentDiv.id = disclaimerId;

      // Copy paragraphs
      const paras = item.querySelectorAll('p');
      paras.forEach((p) => {
        const text = p.textContent.trim();
        if (!text || text === '\u00a0') return;
        const newP = document.createElement('p');
        // Preserve inner HTML for links
        const links = p.querySelectorAll('a');
        if (links.length > 0) {
          newP.innerHTML = p.innerHTML;
        } else {
          newP.textContent = text;
        }
        contentDiv.appendChild(newP);
      });

      // Preserve Return link with back-to-origin class
      const returnLink = item.querySelector('a.back-to-origin');
      if (returnLink) {
        const a = document.createElement('a');
        a.href = returnLink.href || '#';
        a.className = 'back-to-origin';
        a.textContent = 'Return';
        const returnP = document.createElement('p');
        returnP.appendChild(a);
        contentDiv.appendChild(returnP);
      }

      textCell.appendChild(contentDiv);
      cells.push([summaryCell, textCell]);
    });
  }

  // If no cells were created, create a single item with all content
  if (cells.length === 0) {
    const summaryCell = document.createDocumentFragment();
    summaryCell.appendChild(document.createComment(' field:summary '));
    summaryCell.appendChild(document.createTextNode(mainHeading));
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    textCell.appendChild(content);
    cells.push([summaryCell, textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
