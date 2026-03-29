export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    cells[0].classList.add('product-card-image');
    cells[1].classList.add('product-card-content');

    // Detect card type: compare (has h3 + ul), large promo (has h3, no ul), mini (no h3)
    const hasHeading = cells[1].querySelector('h3');
    const hasFeatureList = cells[1].querySelector('ul');
    if (hasHeading && hasFeatureList) {
      row.classList.add('product-card-compare');
    } else if (hasHeading) {
      row.classList.add('product-card-large');
    } else {
      row.classList.add('product-card-mini');
    }
  });
}
