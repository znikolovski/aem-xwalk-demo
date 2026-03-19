export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    cells[0].classList.add('product-card-image');
    cells[1].classList.add('product-card-content');

    // Detect mini cards: content cell has only a link (no h3)
    const hasHeading = cells[1].querySelector('h3');
    if (hasHeading) {
      row.classList.add('product-card-large');
    } else {
      row.classList.add('product-card-mini');
    }
  });
}
