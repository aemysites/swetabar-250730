/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const cells = [headerRow];

  // Locate the image list
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // For each card item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // First cell: image (use the <img> element directly)
    let img = li.querySelector('.cmp-image-list__item-image img');
    let imageCell = img ? img : '';

    // Second cell: text (title in strong, description)
    const textCellContent = [];

    // Title
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCellContent.push(strong);
      // Only add <br> if there is also a description
      const desc = li.querySelector('.cmp-image-list__item-description');
      if (desc && desc.textContent.trim()) {
        textCellContent.push(document.createElement('br'));
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      // Use the element from the DOM
      textCellContent.push(descSpan);
    }

    cells.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
