/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // Defensive: locate the .image-list.list > ul.cmp-image-list (required for structure)
  const listBlock = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!listBlock) return;

  // Each card is a li.cmp-image-list__item
  const items = listBlock.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // --- IMAGE CELL (first column) ---
    let imageCell = null;
    // The image may be nested: a > div > div > img
    const img = item.querySelector('.cmp-image-list__item-image-link img');
    if (img) {
      imageCell = img;
    }
    // --- TEXT CELL (second column) ---
    const textCell = [];
    // Title: .cmp-image-list__item-title-link > span.cmp-image-list__item-title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap the existing span in <strong> for semantic heading (as in the example)
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCell.push(strong);
      }
    }
    // Description: .cmp-image-list__item-description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    rows.push([imageCell, textCell]);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
