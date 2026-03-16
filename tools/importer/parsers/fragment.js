/* eslint-disable */
/* global WebImporter */

/**
 * Parser for fragment block.
 * Creates fragment references for reusable content (alert banner, court notice).
 * Model: fragment (reference)
 * Single row with 1 column: [fragment path reference]
 */
export default function parse(element, { document }) {
  // Determine fragment path based on element class
  let fragmentPath = '';

  if (element.classList.contains('butter-bar') || element.closest('.butter-bar')) {
    fragmentPath = '/content/fragments/alert-banner';
  } else if (element.classList.contains('box--pale-blue') || element.closest('.box--pale-blue')) {
    fragmentPath = '/content/fragments/court-notice';
  } else {
    // Fallback: derive path from element context
    fragmentPath = '/content/fragments/unknown-fragment';
  }

  const cells = [];

  // Build reference cell with field hint
  const refCell = document.createDocumentFragment();
  refCell.appendChild(document.createComment(' field:reference '));
  const a = document.createElement('a');
  a.href = fragmentPath;
  a.textContent = fragmentPath;
  refCell.appendChild(a);

  cells.push([refCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'fragment', cells });
  element.replaceWith(block);
}
