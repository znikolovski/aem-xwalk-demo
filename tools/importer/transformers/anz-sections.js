/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ANZ section breaks and section-metadata.
 * Adds <hr> section breaks and Section Metadata blocks based on template sections.
 * Runs in beforeTransform (after cleanup) so original selectors still exist.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const { document } = payload;
    const template = payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;

    // Track processed elements to handle duplicate selectors (e.g., two .container--eightfour)
    const processedElements = new Set();
    let firstSectionFound = false;

    // Process sections in document order (top to bottom)
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first unprocessed matching element
      let sectionEl = null;
      for (const sel of selectors) {
        try {
          const matches = element.querySelectorAll(sel);
          for (const match of matches) {
            if (!processedElements.has(match)) {
              sectionEl = match;
              break;
            }
          }
        } catch (e) {
          // Invalid selector, skip
        }
        if (sectionEl) break;
      }

      if (!sectionEl) continue;
      processedElements.add(sectionEl);

      // Walk up to find the direct child of element (body) that contains this section
      let topLevel = sectionEl;
      while (topLevel.parentElement && topLevel.parentElement !== element) {
        topLevel = topLevel.parentElement;
      }

      // Safety: ensure we found a direct child of element
      if (topLevel.parentElement !== element) continue;

      // Insert <hr> section break before this section (except the first found section)
      if (firstSectionFound) {
        const hr = document.createElement('hr');
        element.insertBefore(hr, topLevel);
      }
      firstSectionFound = true;

      // Insert Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Place section-metadata after the top-level element
        if (topLevel.nextSibling) {
          element.insertBefore(metaBlock, topLevel.nextSibling);
        } else {
          element.appendChild(metaBlock);
        }
      }
    }
  }
}
