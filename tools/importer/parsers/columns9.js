/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner grid that contains the three columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Get the three immediate column children
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // Header row: a single cell with the block name
  const headerRow = ['Columns (columns9)'];
  // Content row: one cell per column
  const contentRow = columns;
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
