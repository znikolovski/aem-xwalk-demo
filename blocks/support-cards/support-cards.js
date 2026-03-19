export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('support-cards-card');
    const cells = [...row.children];
    if (cells.length >= 2) {
      cells[0].classList.add('support-cards-icon');
      cells[1].classList.add('support-cards-content');
    }
  });
}
