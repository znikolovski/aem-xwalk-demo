/* eslint-disable */
/* global WebImporter */

/**
 * Parser: support-cards
 * Base: support-cards (CBA custom)
 * Source: https://www.commbank.com.au/
 * Generated: 2026-03-19
 *
 * Source DOM structure (from captured HTML):
 * .helpv2-module
 *   > .helpv2-heading > h2 "We're here to help" (section heading - extracted separately as default content)
 *   > .helpv2-wrapper
 *     > .support-section > .support-links.six-pack-links
 *       > .items-head > h3 > a (icon img + "Support & FAQs" heading link)
 *       > .items-list > .support-content > ul > li > a (×8 FAQ links)
 *     > .contact-section
 *       > .contact-wrapper > .contact-content
 *         > h3 > a (icon img + "Contact us" heading link)
 *         > .links-title > p (description text)
 *       > .locate-wrapper > .locate-content
 *         > h3 > a (icon img + "Locate us" heading link)
 *         > .links-title > p (description text)
 *
 * Target EDS block structure:
 * | Support Cards |
 * |---------------|
 * | icon | heading link + link list |  (support & FAQs card)
 * | icon | heading link + description |  (contact us card)
 * | icon | heading link + description |  (locate us card)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Card 1: Support & FAQs (large support section with link list)
  const supportLinks = element.querySelector('.support-links');
  if (supportLinks) {
    const headLink = supportLinks.querySelector('.items-head h3 a');
    const icon = supportLinks.querySelector('.items-head img');
    const linkList = supportLinks.querySelector('.support-content ul');

    // Cell 1: Icon
    const iconCell = document.createElement('div');
    if (icon) {
      const newImg = document.createElement('img');
      newImg.src = icon.getAttribute('src') || icon.getAttribute('data-src');
      newImg.alt = icon.getAttribute('alt') || '';
      iconCell.append(newImg);
    }

    // Cell 2: Heading link + link list
    const contentCell = document.createElement('div');
    if (headLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = headLink.getAttribute('href');
      // Get text from the span inside the div (skip arrow icon)
      // Get text: try span first, then data-analytics-id attr, then stripped textContent
      const textSpan = headLink.querySelector('div > span:first-child');
      const analyticsId = headLink.getAttribute('data-analytics-id');
      if (textSpan && textSpan.textContent.trim()) {
        a.textContent = textSpan.textContent.trim();
      } else if (analyticsId) {
        a.textContent = analyticsId;
      } else {
        const clone = headLink.cloneNode(true);
        clone.querySelectorAll('img, [aria-hidden], .icon-right-arrow').forEach((el) => el.remove());
        a.textContent = clone.textContent.replace(/\s+/g, ' ').trim();
      }
      h3.append(a);
      contentCell.append(h3);
    }
    if (linkList) {
      const ul = document.createElement('ul');
      linkList.querySelectorAll('li a').forEach((linkEl) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = linkEl.getAttribute('href');
        // Get text without arrow icon spans
        a.textContent = linkEl.textContent.replace(/\s+/g, ' ').trim();
        li.append(a);
        ul.append(li);
      });
      contentCell.append(ul);
    }

    cells.push([iconCell, contentCell]);
  }

  // Card 2: Contact us
  const contactContent = element.querySelector('.contact-content');
  if (contactContent) {
    const headLink = contactContent.querySelector('h3 a');
    const icon = contactContent.querySelector('img');
    const desc = contactContent.querySelector('.links-title p');

    const iconCell = document.createElement('div');
    if (icon) {
      const newImg = document.createElement('img');
      newImg.src = icon.getAttribute('src') || icon.getAttribute('data-src');
      newImg.alt = icon.getAttribute('alt') || '';
      iconCell.append(newImg);
    }

    const contentCell = document.createElement('div');
    if (headLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = headLink.getAttribute('href');
      // Get text: try span first, then data-analytics-id attr, then stripped textContent
      const textSpan = headLink.querySelector('div > span:first-child');
      const analyticsId = headLink.getAttribute('data-analytics-id');
      if (textSpan && textSpan.textContent.trim()) {
        a.textContent = textSpan.textContent.trim();
      } else if (analyticsId) {
        a.textContent = analyticsId;
      } else {
        const clone = headLink.cloneNode(true);
        clone.querySelectorAll('img, [aria-hidden], .icon-right-arrow').forEach((el) => el.remove());
        a.textContent = clone.textContent.replace(/\s+/g, ' ').trim();
      }
      h3.append(a);
      contentCell.append(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.append(p);
    }

    cells.push([iconCell, contentCell]);
  }

  // Card 3: Locate us
  const locateContent = element.querySelector('.locate-content');
  if (locateContent) {
    const headLink = locateContent.querySelector('h3 a');
    const icon = locateContent.querySelector('img');
    const desc = locateContent.querySelector('.links-title p');

    const iconCell = document.createElement('div');
    if (icon) {
      const newImg = document.createElement('img');
      newImg.src = icon.getAttribute('src') || icon.getAttribute('data-src');
      newImg.alt = icon.getAttribute('alt') || '';
      iconCell.append(newImg);
    }

    const contentCell = document.createElement('div');
    if (headLink) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = headLink.getAttribute('href');
      // Get text: try span first, then data-analytics-id attr, then stripped textContent
      const textSpan = headLink.querySelector('div > span:first-child');
      const analyticsId = headLink.getAttribute('data-analytics-id');
      if (textSpan && textSpan.textContent.trim()) {
        a.textContent = textSpan.textContent.trim();
      } else if (analyticsId) {
        a.textContent = analyticsId;
      } else {
        const clone = headLink.cloneNode(true);
        clone.querySelectorAll('img, [aria-hidden], .icon-right-arrow').forEach((el) => el.remove());
        a.textContent = clone.textContent.replace(/\s+/g, ' ').trim();
      }
      h3.append(a);
      contentCell.append(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.append(p);
    }

    cells.push([iconCell, contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'support-cards', cells });
  element.replaceWith(block);
}
