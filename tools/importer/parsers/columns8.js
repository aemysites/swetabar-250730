/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container (where the columns live)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct child columns (should be 3: logo, nav, search)
  const columns = Array.from(grid.children);

  // 1st column: logo
  const logoCol = columns.find(c => c.classList.contains('image'));
  let logoContent = '';
  if (logoCol) {
    const imageDiv = logoCol.querySelector('[data-cmp-is="image"]');
    logoContent = imageDiv || logoCol;
  }

  // 2nd column: navigation
  const navCol = columns.find(c => c.classList.contains('navigation'));
  let navContent = '';
  if (navCol) {
    const nav = navCol.querySelector('nav');
    navContent = nav || navCol;
  }

  // 3rd column: search
  const searchCol = columns.find(c => c.classList.contains('search'));
  let searchContent = '';
  if (searchCol) {
    const section = searchCol.querySelector('section');
    searchContent = section || searchCol;
  }

  // The header row must be a single cell exactly as in the markdown example.
  const headerRow = ['Columns (columns8)'];
  // Content row is three columns, one per section
  const contentRow = [logoContent, navContent, searchContent];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
