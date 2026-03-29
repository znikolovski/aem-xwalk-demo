export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'anchor-tile-nav-tile';

    const cells = [...row.children];
    if (cells.length >= 2) {
      // Cell 1: icon image
      const iconCell = cells[0];
      const icon = iconCell.querySelector('picture, img');
      if (icon) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'anchor-tile-nav-icon';
        iconWrap.append(icon.closest('picture') || icon);
        li.append(iconWrap);
      }

      // Cell 2: heading link + sub-links
      const contentCell = cells[1];
      const heading = contentCell.querySelector('h3, h2, h4');
      if (heading) {
        const headingWrap = document.createElement('div');
        headingWrap.className = 'anchor-tile-nav-heading';
        headingWrap.append(heading);
        li.append(headingWrap);
      } else {
        // Variant B: simple link without heading tag (product page section-nav)
        const link = contentCell.querySelector('a');
        if (link) {
          const headingWrap = document.createElement('div');
          headingWrap.className = 'anchor-tile-nav-heading';
          headingWrap.append(link);
          li.append(headingWrap);
          li.classList.add('anchor-tile-nav-compact');
        }
      }

      const subLinks = contentCell.querySelector('ul');
      if (subLinks) {
        subLinks.className = 'anchor-tile-nav-links';
        li.append(subLinks);
      }
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
