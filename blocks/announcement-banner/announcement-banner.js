export default function decorate(block) {
  const wrapper = block.closest('.announcement-banner-wrapper');
  if (wrapper) {
    wrapper.classList.add('full-width');
  }

  // Check if previously dismissed
  try {
    if (sessionStorage.getItem('announcement-dismissed') === 'true') {
      const container = block.closest('.section');
      if (container) {
        container.style.display = 'none';
      }
      return;
    }
  } catch { /* ignore */ }

  // Create dismiss link
  const row = block.querySelector(':scope > div');
  if (row) {
    const dismissCell = document.createElement('div');
    const dismissP = document.createElement('p');
    const dismissLink = document.createElement('a');
    dismissLink.href = '#';
    dismissLink.className = 'announcement-banner-dismiss';
    dismissLink.textContent = 'Dismiss';
    dismissLink.addEventListener('click', (e) => {
      e.preventDefault();
      const container = block.closest('.section');
      if (container) {
        container.style.display = 'none';
      }
      try {
        sessionStorage.setItem('announcement-dismissed', 'true');
      } catch { /* ignore */ }
    });
    dismissP.appendChild(dismissLink);
    dismissCell.appendChild(dismissP);
    row.appendChild(dismissCell);
  }

  // Structure: single row with text + links
  const rows = [...block.children];
  rows.forEach((r) => {
    const cells = [...r.children];
    if (cells.length === 1) {
      cells[0].classList.add('announcement-banner-content');
    }
  });
}
