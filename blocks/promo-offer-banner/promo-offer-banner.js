export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  if (cells.length >= 2) {
    cells[0].classList.add('promo-offer-banner-content');
    cells[1].classList.add('promo-offer-banner-image');
  }
}
