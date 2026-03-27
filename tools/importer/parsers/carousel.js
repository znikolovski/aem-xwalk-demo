/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block.
 * Extracts hero carousel slides from .hero--container.
 * Model: carousel-item (media_image, media_imageAlt [collapsed], content_text)
 * Each slide = 1 row with 2 columns: [image | text content]
 */
export default function parse(element, { document }) {
  // Find all hero slides within the carousel container
  const slides = element.querySelectorAll('.hero.textimage.parbase');
  const slideElements = slides.length > 0 ? Array.from(slides) : [element];

  const cells = [];

  slideElements.forEach((slide) => {
    // Column 1: Image with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));

    const image = slide.querySelector('.focuspoint img, .hero-frame img, img');
    if (image) {
      const pic = document.createElement('picture');
      const img = document.createElement('img');
      img.src = image.src || image.getAttribute('src') || '';
      img.alt = image.alt || image.getAttribute('alt') || '';
      pic.appendChild(img);
      imageCell.appendChild(pic);
    }

    // Column 2: Text content (heading + description + CTA) with field hint
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));

    const textContainer = slide.querySelector('.hero__default.hero__info, .hero__info');
    if (textContainer) {
      // Extract heading (h1 or h2)
      const heading = textContainer.querySelector('h1, h2, h3');
      if (heading) {
        const h = document.createElement(heading.tagName.toLowerCase());
        h.textContent = heading.textContent.trim();
        contentCell.appendChild(h);
      }

      // Extract description paragraphs from .text.parbase
      const textBlocks = textContainer.querySelectorAll('.text.parbase');
      textBlocks.forEach((textBlock) => {
        const paras = textBlock.querySelectorAll('p');
        paras.forEach((p) => {
          const text = p.textContent.trim();
          // Skip empty, nbsp-only, and CTA button paragraphs
          if (!text || text === '\u00a0') return;
          if (p.querySelector('a.btn, a.btn--white, a.btn--blue')) return;
          const newP = document.createElement('p');
          newP.textContent = text;
          contentCell.appendChild(newP);
        });
      });

      // Extract CTA buttons - preserve pid= tracking parameters
      const ctas = textContainer.querySelectorAll('a.btn, a.btn--white, a.btn--blue');
      ctas.forEach((cta) => {
        const href = cta.href || cta.getAttribute('href') || '';
        const a = document.createElement('a');
        a.href = href;
        a.textContent = cta.textContent.trim();
        const ctaP = document.createElement('p');
        ctaP.appendChild(a);
        contentCell.appendChild(ctaP);
      });
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
