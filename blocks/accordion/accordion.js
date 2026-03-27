/*
 * Accordion Block
 * Single-item accordion: first row label becomes the title,
 * all rows' body content is merged into one expandable section.
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // First row's label becomes the accordion title
  const firstLabel = rows[0].children[0];
  const summary = document.createElement('summary');
  summary.className = 'accordion-item-label';
  summary.append(...firstLabel.childNodes);

  // Combine all rows' body content into a single body
  const body = document.createElement('div');
  body.className = 'accordion-item-body';
  rows.forEach((row) => {
    const rowBody = row.children[1];
    if (rowBody) {
      body.append(...rowBody.childNodes);
    }
  });

  // Create single details element
  const details = document.createElement('details');
  moveInstrumentation(rows[0], details);
  details.className = 'accordion-item';
  details.append(summary, body);

  // Clear block and add the single accordion
  block.textContent = '';
  block.append(details);
}
