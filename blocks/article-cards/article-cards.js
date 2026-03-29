export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('article-cards-card');
    const cells = [...row.children];
    if (cells.length >= 2) {
      cells[0].classList.add('article-cards-image');
      cells[1].classList.add('article-cards-content');
    }
  });
}
