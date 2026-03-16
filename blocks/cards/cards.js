import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// Calculator icon SVGs mapped by URL keyword
const CALCULATOR_ICONS = {
  'home-loan-repayment': '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M30.382 16.658c-.159 0-.317-.06-.437-.182L15.999 2.485 2.054 16.476c-.24.241-.632.242-.873.001a.618.618 0 0 1 .001-.873L15.563 1.174a.617.617 0 0 1 .875 0l14.382 14.43a.618.618 0 0 1-.438 1.054zM15.383 24.072a.618.618 0 0 0 1.235 0v-1.175a3.107 3.107 0 0 0 2.59-3.156c0-1.773-1.44-3.216-3.208-3.216a2.52 2.52 0 0 1-1.973-4.981c1.088 0 1.973.889 1.973 1.981a.618.618 0 0 0 1.236 0 3.107 3.107 0 0 0-2.59-3.156v-1.175a.618.618 0 0 0-1.235 0v1.175a3.107 3.107 0 0 0-2.59 3.156c0 1.773 1.44 3.216 3.208 3.216a2.52 2.52 0 0 1 1.973 4.981 2.52 2.52 0 0 1-1.973-1.981.618.618 0 0 0-1.236 0 3.107 3.107 0 0 0 2.59 3.156v1.176zM5.37 29.834h21.261a.618.618 0 0 0 .619-.617V17.115a.618.618 0 0 0-1.236 0v11.485H5.987V17.115a.618.618 0 0 0-1.234 0v12.102c0 .34.276.617.617.617zM24.762 7.257a.618.618 0 0 0 1.234 0V2.866a.618.618 0 0 0-.617-.617h-4.378a.618.618 0 0 0 0 1.234h3.761v3.774z" fill="#004165"/></svg>',
  'compare-cards': '<svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="4.5" width="22" height="16" rx="2" stroke="#004165" stroke-width="1.3"/><rect x="8.5" y="0.5" width="22" height="16" rx="2" stroke="#004165" stroke-width="1.3" fill="white"/><line x1="8.5" y1="5.5" x2="30.5" y2="5.5" stroke="#004165" stroke-width="1.3"/><rect x="11" y="9" width="6" height="4" rx="1" stroke="#004165" stroke-width="1.3"/></svg>',
  'currency-converter': '<svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="16" r="11" stroke="#004165" stroke-width="1.3"/><circle cx="21" cy="16" r="11" stroke="#004165" stroke-width="1.3" fill="white"/><text x="8" y="20" font-family="Arial" font-size="12" font-weight="bold" fill="#004165">$</text><text x="22" y="20" font-family="Arial" font-size="10" fill="#004165">C</text></svg>',
  'borrowing-power': '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="8" rx="10" ry="4" stroke="#004165" stroke-width="1.3"/><path d="M6 8v4c0 2.2 4.5 4 10 4s10-1.8 10-4V8" stroke="#004165" stroke-width="1.3"/><path d="M6 12v4c0 2.2 4.5 4 10 4s10-1.8 10-4v-4" stroke="#004165" stroke-width="1.3"/><path d="M6 16v4c0 2.2 4.5 4 10 4s10-1.8 10-4v-4" stroke="#004165" stroke-width="1.3"/><path d="M6 20v4c0 2.2 4.5 4 10 4s10-1.8 10-4v-4" stroke="#004165" stroke-width="1.3"/></svg>',
  'personal-loan': '<svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 4C13 4 11 6 11 8v2c0 1 .5 2 1.5 2.5L10 28h13l-2.5-15.5c1-.5 1.5-1.5 1.5-2.5V8c0-2-2-4-5.5-4z" stroke="#004165" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><text x="14" y="22" font-family="Arial" font-size="10" font-weight="bold" fill="#004165">$</text></svg>',
  'book-appointment': '<svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16.5" cy="10" r="5" stroke="#004165" stroke-width="1.3"/><path d="M7 28c0-5.5 4.3-9.5 9.5-9.5S26 22.5 26 28" stroke="#004165" stroke-width="1.3" stroke-linecap="round"/></svg>',
};

function getIconSvg(link) {
  if (!link) return '';
  const href = link.getAttribute('href') || '';
  const entries = Object.entries(CALCULATOR_ICONS);
  for (let i = 0; i < entries.length; i += 1) {
    const [key, svg] = entries[i];
    if (href.includes(key)) return svg;
  }
  // fallback: generic calculator icon
  return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="20" height="24" rx="2" stroke="#004165" stroke-width="1.3"/><rect x="9" y="7" width="14" height="5" rx="1" stroke="#004165" stroke-width="1.3"/><circle cx="12" cy="17" r="1.5" fill="#004165"/><circle cx="16" cy="17" r="1.5" fill="#004165"/><circle cx="20" cy="17" r="1.5" fill="#004165"/><circle cx="12" cy="22" r="1.5" fill="#004165"/><circle cx="16" cy="22" r="1.5" fill="#004165"/><circle cx="20" cy="22" r="1.5" fill="#004165"/></svg>';
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (div.children.length <= 1 && !div.querySelector('a')) {
        // Empty or comment-only image div - inject calculator icon
        div.className = 'cards-card-image';
        const bodyDiv = div.nextElementSibling || div.previousElementSibling;
        const link = bodyDiv?.querySelector('a');
        const svg = getIconSvg(link);
        if (svg) {
          div.innerHTML = svg;
        }
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
