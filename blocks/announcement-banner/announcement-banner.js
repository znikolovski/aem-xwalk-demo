export default function decorate(block) {
  const wrapper = block.closest('.announcement-banner-wrapper');
  if (wrapper) {
    wrapper.classList.add('full-width');
  }

  // Find the dismiss link and add close behavior
  const dismissLink = block.querySelector('a[href="#"]');
  if (dismissLink) {
    dismissLink.addEventListener('click', (e) => {
      e.preventDefault();
      const container = block.closest('.section');
      if (container) {
        container.style.display = 'none';
      }
      // Remember dismissal for this session
      try {
        sessionStorage.setItem('announcement-dismissed', 'true');
      } catch { /* ignore */ }
    });
  }

  // Check if previously dismissed
  try {
    if (sessionStorage.getItem('announcement-dismissed') === 'true') {
      const container = block.closest('.section');
      if (container) {
        container.style.display = 'none';
      }
    }
  } catch { /* ignore */ }

  // Structure: single row with text + links
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      // Single cell — contains text, CTA link, and dismiss link
      cells[0].classList.add('announcement-banner-content');
    }
  });
}
