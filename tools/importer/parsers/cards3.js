/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row using the block name from the spec
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find list of cards (li elements)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // IMAGE COLUMN: get the visual card image
    // Use the .cmp-image-list__item-image div (which contains the <img>)
    let imageCell = li.querySelector('.cmp-image-list__item-image');
    if (!imageCell) {
      // fallback if structure changes
      const fallbackImg = li.querySelector('img');
      imageCell = fallbackImg || document.createTextNode('');
    }

    // TEXT COLUMN: title (linked, bold), description (below)
    const textCellContent = [];
    // Title, prefer link+span
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink && titleLink.getAttribute('href')) {
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.appendChild(strong);
        textCellContent.push(link);
      } else {
        textCellContent.push(strong);
      }
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim().length > 0) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(desc);
    }

    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
