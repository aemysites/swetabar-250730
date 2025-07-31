/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (exact text from example)
  const headerRow = ['Hero (hero4)'];

  // Extract: background image (whole image container div for resilience)
  const bgImageDiv = element.querySelector('.cmp-teaser__image');
  const bgImageRow = [bgImageDiv ? bgImageDiv : ''];

  // Extract: content (title, description, CTA)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentDiv) {
    // Title (likely h2 or h1)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // CTA
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Assemble table
  const cells = [
    headerRow,
    bgImageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
