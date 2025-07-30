/* global WebImporter */
export default function parse(element, { document }) {
  // Get the teaser content and image
  const content = element.querySelector('.cmp-teaser__content');
  const imageContainer = element.querySelector('.cmp-teaser__image');

  // Build the left cell: all content elements, in order
  const leftCell = [];
  if (content) {
    Array.from(content.children).forEach(child => {
      leftCell.push(child);
    });
  }

  // Build the right cell: the image element (reference the whole imageContainer for robustness)
  const rightCell = imageContainer || '';

  // Construct the block table as per columns2
  const cells = [
    ['Columns (columns2)'],
    [leftCell, rightCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
