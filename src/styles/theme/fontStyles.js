/**
 * [2022-11-23] re-styled typography based on new design for dotcom
 * Design url: https://www.figma.com/file/ST8WZLwRy3McZ8MUizZ8xR/%5BDSM%5D-dotcom?node-id=6%3A13&t=DUhCbYHxuh4hIho6-1
 */

const getLineHeight = (fontSize, lineHeight) => {
  if (!lineHeight) return null;
  if (!fontSize) return `${lineHeight}rem`;
  return `${lineHeight / fontSize}em`;
};

const paragraphCss = (fontWeight, fontSize, lineHeight) => {
  return `
    ${fontWeight ? `font-weight: ${fontWeight};` : ''}
    ${fontSize ? `font-size: ${fontSize}rem;` : ''}
    ${lineHeight ? `line-height: ${getLineHeight(fontSize, lineHeight)};` : ''}
  `;
};

const heading14 = paragraphCss(700, 14, 16);

export default {
  heading14
};
