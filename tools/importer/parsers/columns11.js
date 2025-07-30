/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing all footer content
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Collect relevant sections in DOM order
  // (logo, navigation, follow title, socials, copyright text)
  const content = [];

  // Logo ('.cmp-image')
  const logo = grid.querySelector('.cmp-image');
  if (logo) content.push(logo);

  // Navigation ('.cmp-navigation')
  const nav = grid.querySelector('.cmp-navigation');
  if (nav) content.push(nav);

  // Follow Us title ('.cmp-title')
  const followTitle = grid.querySelector('.cmp-title');
  if (followTitle) content.push(followTitle);

  // Social buttons ('.cmp-buildingblock--btn-list' > '.xf-master-building-block')
  const btnList = grid.querySelector('.cmp-buildingblock--btn-list');
  if (btnList) {
    const socialBtns = btnList.querySelector('.xf-master-building-block');
    if (socialBtns) content.push(socialBtns);
  }

  // Copyright/info text ('.cmp-text')
  const copyright = grid.querySelector('.cmp-text');
  if (copyright) content.push(copyright);

  // Build the table with a single header cell and a single content cell
  const cells = [
    ['Columns (columns11)'],
    [content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
