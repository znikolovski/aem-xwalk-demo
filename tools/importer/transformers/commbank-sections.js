/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: CommBank sections.
 * - beforeTransform: Extracts default content (headings) from inside block containers
 *   so they survive block parsing (parsers call element.replaceWith which destroys children).
 * - afterTransform: Adds section breaks (<hr>) and section-metadata blocks from template sections.
 * Selectors from captured DOM of www.commbank.com.au.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  if (!template || !template.sections) return;

  const doc = element.ownerDocument || element;

  if (hookName === TransformHook.beforeTransform) {
    // Extract default content from inside block containers before parsers destroy them.
    // Sections with both blocks[] and defaultContent[] need extraction —
    // the defaultContent elements are inside block instance containers and would be
    // lost when parsers call element.replaceWith(block).
    template.sections.forEach((section) => {
      if (!section.defaultContent || section.defaultContent.length === 0) return;
      if (!section.blocks || section.blocks.length === 0) return;

      section.defaultContent.forEach((contentSelector) => {
        const contentEl = element.querySelector(contentSelector);
        if (!contentEl) return;

        // Find which block instance container holds this element
        for (const blockName of section.blocks) {
          const blockDef = template.blocks.find((b) => b.name === blockName);
          if (!blockDef) continue;

          for (const instanceSel of blockDef.instances) {
            const blockEl = element.querySelector(instanceSel);
            if (blockEl && blockEl.contains(contentEl)) {
              // Move the content element before the block container
              blockEl.before(contentEl);
              return;
            }
          }
        }
      });
    });
  }

  if (hookName === TransformHook.afterTransform) {
    if (template.sections.length < 2) return;

    const sections = template.sections;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first element matching any of the section selectors
      let sectionEl = null;
      for (const sel of selectors) {
        if (sel) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      }

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: [['style', section.style]],
        });
        // Insert section-metadata after the section's last content
        sectionEl.after(metaBlock);
      }

      // Add <hr> before non-first sections (section break)
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
