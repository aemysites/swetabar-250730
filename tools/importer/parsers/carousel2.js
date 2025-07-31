/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row using the exact block name
  const headerRow = ['Carousel (carousel2)'];

  // Find the image element for the first column
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }
  // If not found, leave as null (edge-case safe)

  // Second column: collect all text content in a single array
  const textCell = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Optional: pretitle
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      textCell.push(pretitle);
    }
    // Optional: title (Heading)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) {
      textCell.push(title);
    }
    // Optional: description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      textCell.push(desc);
    }
    // Optional: CTA
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCell.push(cta);
    }
  }

  // Prepare the row for the table: always two columns as per example
  const slideRow = [imageEl, textCell];

  const cells = [headerRow, slideRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
