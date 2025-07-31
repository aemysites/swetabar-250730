/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Carousel (carousel1)'];

  // Get the carousel content containing slides
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Collect all items (slides)
  const slideElems = Array.from(carouselContent.children).filter(
    (child) => child.classList.contains('cmp-carousel__item')
  );

  // Build rows for each slide
  const rows = slideElems.map((slide) => {
    // Each slide contains a teaser block
    const teaser = slide.querySelector('.cmp-teaser');
    let imgCell = null;
    let textCell = null;

    // Image cell: Find the first <img> in the teaser (inside .cmp-teaser__image)
    const teaserImage = teaser && teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imgCell = teaserImage;
    }

    // Text cell
    const textParts = [];

    // Title: Typically h2.cmp-teaser__title
    const title = teaser && teaser.querySelector('.cmp-teaser__title');
    if (title) {
      textParts.push(title);
    }

    // Description: .cmp-teaser__description, can contain a <p> or just text
    const desc = teaser && teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // If it has children like <p>, push children, else push itself
      if (desc.children.length > 0) {
        Array.from(desc.children).forEach((child) => textParts.push(child));
      } else {
        textParts.push(desc);
      }
    }

    // CTA: The CTA link, if present
    const cta = teaser && teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textParts.push(cta);
    }

    // Only use textCell if any text parts present
    if (textParts.length > 0) {
      textCell = textParts;
    }

    // Always two columns per row
    return [imgCell, textCell];
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
