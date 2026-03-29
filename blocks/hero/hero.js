export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 0 = image, Row 1 = content
  rows[0].classList.add('hero-image');
  rows[1].classList.add('hero-content');
}
