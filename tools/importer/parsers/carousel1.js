/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block inside the given element
  const carousel = element.querySelector('[class*="cmp-carousel"], [class*="carousel"]');
  if (!carousel) return;

  // Find the slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Table header matches the block name exactly as in example
  const rows = [['Carousel']];

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imageCell = null;
    // Find image in slide (img inside .cmp-teaser__image)
    const image = slide.querySelector('.cmp-teaser__image img');
    if (image) {
      imageCell = image;
    }
    // If not found, leave imageCell as null

    // --- TEXT CELL ---
    const textCellContent = [];
    // The content area
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (as heading)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title && title.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent.trim();
        textCellContent.push(h2);
      }
      // Description (could be <div> or <p> or text)
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        // If it contains block elements, preserve them
        if (desc.children.length > 0) {
          Array.from(desc.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              textCellContent.push(node);
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              // Wrap as <p>
              const p = document.createElement('p');
              p.textContent = node.textContent.trim();
              textCellContent.push(p);
            }
          });
        } else if (desc.textContent.trim()) {
          // Otherwise, wrap plain text as <p>
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textCellContent.push(p);
        }
      }
      // CTA (link)
      const cta = teaserContent.querySelector('.cmp-teaser__action-link');
      if (cta) {
        // Add spacing if description exists
        if (textCellContent.length > 0) {
          textCellContent.push(document.createElement('br'));
        }
        textCellContent.push(cta);
      }
      // Remove trailing <br> if there was no CTA after it
      if (textCellContent.length && textCellContent[textCellContent.length - 1].tagName === 'BR') {
        textCellContent.pop();
      }
    }
    // If there is no text content, set cell as empty string
    const textCell = textCellContent.length ? textCellContent : '';
    rows.push([imageCell, textCell]);
  });

  // Build and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
