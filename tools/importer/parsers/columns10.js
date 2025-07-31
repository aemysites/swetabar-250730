/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the innermost grid with columns for the footer content
  const mainGrid = element.querySelector('.cmp-layout-container--fixed .aem-Grid');
  if (!mainGrid) return;

  // 2. Extract the three main columns (logo, navigation, follow/social)
  // Column 1: Logo
  const logoCol = mainGrid.querySelector('.image');

  // Column 2: Navigation
  const navCol = mainGrid.querySelector('.navigation');

  // Column 3: Follow title and social links (may be in separate siblings)
  const followTitle = mainGrid.querySelector('.title');
  const socialBlock = mainGrid.querySelector('.buildingblock');
  const col3Content = [];
  if (followTitle) col3Content.push(followTitle);
  if (socialBlock) col3Content.push(socialBlock);

  // 3. Compose columns row (use empty string as fallback for missing columns)
  const columnsRow = [
    logoCol || '',
    navCol || '',
    col3Content.length ? col3Content : '',
  ];

  // 4. Get the copyright/about text for the final row
  const copyrightText = element.querySelector('.text');

  // 5. Build the table cells array
  const headerRow = ['Columns (columns10)'];
  const cells = [
    headerRow,
    columnsRow,
    [copyrightText || ''],
  ];

  // 6. Replace the original element with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
