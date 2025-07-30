/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const headerRow = ['Hero (hero4)'];

  // 2. Get background image row (2nd row)
  let imageElem = null;
  // Locate teaser image by selector
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageElem = teaserImageDiv.querySelector('img');
  }
  const imageRow = [imageElem ? imageElem : ''];

  // 3. Main content row (3rd row): Heading, description, CTA
  const content = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (content) {
    // Heading (keep correct heading level as in source)
    let heading = content.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    // Description
    let description = content.querySelector('.cmp-teaser__description');
    if (description) contentParts.push(description);
    // CTA link (optional)
    let cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }
  const contentRow = [contentParts.length > 0 ? contentParts : ''];

  // 4. Build the table
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element with the new block table
  element.replaceWith(table);
}
