/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (must match the block name exactly as in the example)
  const headerRow = ['Hero (hero7)'];

  // 2. Background image row (optional)
  let bgImg = null;
  const imageOuter = element.querySelector('.cmp-teaser__image');
  if (imageOuter) {
    const img = imageOuter.querySelector('img');
    if (img) {
      bgImg = img;
    }
  }

  // 3. Content row: Title, subheading, description, CTA
  // The example shows a heading, subheading, and paragraph; for this HTML:
  // - heading is in .cmp-teaser__title (h2)
  // - description is in .cmp-teaser__description (which may contain p)
  // - CTA/link is not present in this sample but code must support it
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentItems = [];
  if (contentDiv) {
    // Title (keep as heading)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentItems.push(title);
    // Description (keep all block children, e.g., paragraphs)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Push all child nodes of the description (could be multiple <p> or other blocks)
      const descNodes = Array.from(desc.childNodes).filter(node => {
        // Only append non-empty text or elements
        return (node.nodeType === 1 && node.textContent.trim() !== '') || (node.nodeType === 3 && node.textContent.trim() !== '');
      });
      contentItems.push(...descNodes);
    }
    // CTA (optional)
    const cta = contentDiv.querySelector('a');
    if (cta) contentItems.push(cta);
  }

  // Ensure at least an empty row for optional background image if no image is found
  const rows = [
    headerRow,
    [bgImg].filter(x => x),
    [contentItems.length ? contentItems : '']
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
