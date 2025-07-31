/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare table rows: Header first (block name only)
  const rows = [['Accordion']];

  // Get all accordion items (each is a two-column row)
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: prefer using the span.cmp-accordion__title element
    let titleSpan = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleCell = titleSpan || '';

    // Content cell: the .cmp-accordion__panel content
    let panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // If the panel contains only one container, use it; otherwise, use all element children
      const innerElements = Array.from(panel.children);
      if (innerElements.length === 1) {
        contentCell = innerElements[0];
      } else if (innerElements.length > 1) {
        contentCell = innerElements;
      } else {
        // fallback: if only text
        contentCell = panel.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
