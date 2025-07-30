/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion container (.cmp-accordion)
  let accordionRoot = element.querySelector('.accordion .cmp-accordion');
  if (!accordionRoot) {
    accordionRoot = element.querySelector('.cmp-accordion');
  }
  if (!accordionRoot) {
    // No accordion block found, do nothing
    return;
  }

  const rows = [];
  // Table header (block name)
  rows.push(['Accordion']);

  // Find all accordion items
  const items = accordionRoot.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // --- Extract Title ---
    let titleElem = null;
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      // Use the span as the title element, but make sure to reference it, not clone
      titleElem = titleSpan;
    } else {
      // fallback: try the button
      const btn = item.querySelector('button');
      if (btn) {
        // Use button text as fallback
        titleElem = document.createElement('div');
        titleElem.textContent = btn.textContent.trim();
      } else {
        // fallback: empty
        titleElem = document.createElement('div');
        titleElem.textContent = '';
      }
    }

    // --- Extract Content ---
    let contentNodes = [];
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Look for a cmp-container or responsivegrid inside panel
      let contentContainer = panel.querySelector('.cmp-container') || panel.querySelector('.container.responsivegrid');
      if (contentContainer) {
        // Collect all block-level elements that are children (text, image, etc)
        const blockContent = [];
        contentContainer.childNodes.forEach((c) => {
          if (c.nodeType === 1 && (c.classList.contains('text') || c.classList.contains('cmp-text') || c.classList.contains('image') || c.classList.contains('cmp-image'))) {
            // If it's a .text, drill to .cmp-text if present
            let useElem = c;
            if (c.classList.contains('text') && c.querySelector('.cmp-text')) {
              useElem = c.querySelector('.cmp-text');
            }
            blockContent.push(useElem);
          }
        });
        // If nothing was found, just use all element children
        if (blockContent.length) {
          contentNodes = blockContent;
        } else {
          contentNodes = Array.from(contentContainer.children);
        }
      } else {
        // fallback: use all element children of panel
        contentNodes = Array.from(panel.children);
      }
    }
    // If only one node, don't wrap as array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      contentCell = '';
    }
    // Add the row
    rows.push([titleElem, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion block itself (not the whole page)
  let replaceTarget = accordionRoot.closest('.accordion') || accordionRoot;
  replaceTarget.replaceWith(table);
}
