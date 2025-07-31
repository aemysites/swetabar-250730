/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements and example
  const headerRow = ['Cards (cards3)'];
  const rows = [];

  // Find the list containing cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  lis.forEach(li => {
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Image cell: reference the existing <img> element
    let imageCell = null;
    const image = article.querySelector('.cmp-image-list__item-image img');
    if (image) imageCell = image;

    // Text cell
    // Title: Use the existing <span> element, but present as <strong> (via new element), reference text only
    // Description: Use the existing <span> element
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');

    const textCellParts = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellParts.push(strong);
    }
    if (descriptionSpan) {
      if (textCellParts.length) textCellParts.push(document.createElement('br'));
      textCellParts.push(descriptionSpan);
    }

    rows.push([imageCell, textCellParts]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
