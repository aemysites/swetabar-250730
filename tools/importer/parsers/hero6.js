/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name in the description
  const headerRow = ['Hero (hero6)'];

  // Extract the image (background image for the hero)
  let image = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const foundImg = imageWrapper.querySelector('img');
    if (foundImg) {
      image = foundImg;
    }
  }

  // Extract the content: heading and description
  const content = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    const heading = contentWrapper.querySelector('.cmp-teaser__title');
    if (heading) {
      content.push(heading);
    }
    const description = contentWrapper.querySelector('.cmp-teaser__description');
    if (description) {
      // Keep all children (usually <p> but could be others)
      Array.from(description.childNodes).forEach(node => {
        // Retain elements or non-empty text
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          content.push(node);
        }
      });
    }
  }

  // Build the table as described: 1 column, 3 rows (header, image, content)
  const rows = [
    headerRow,
    [image],
    [content]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
