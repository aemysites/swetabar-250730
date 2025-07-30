/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards5)'];

  // Find the list of card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.children).filter(li => li.matches('li.cmp-image-list__item'));

  const rows = items.map((li) => {
    // Get the image for the card (first cell)
    // Prefer the <img> tag directly
    const img = li.querySelector('img');

    // Second cell: contains title (bold/heading), description, and possibly a link
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Reference elements, not clones
    // For the title: use <strong> for semantic heading-like structure (as example uses bold)
    let titleEl;
    if (titleLink && titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.append(titleSpan.textContent);
    } else if(titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.append(titleSpan.textContent);
    }

    // Description below title (if present)
    let descEl;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.append(descSpan.textContent);
    }

    // Compose second cell (text content)
    const cellContent = [];
    if (titleEl) cellContent.push(titleEl);
    if (descEl) cellContent.push(descEl);

    return [img, cellContent];
  });

  // Compose the table and replace the block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
