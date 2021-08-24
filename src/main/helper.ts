export const solidColor = (r = 255, g = 0, b = 0): Paint => ({
  type: 'SOLID',
  color: {
    r: r / 255,
    g: g / 255,
    b: b / 255,
  },
});

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export function rgbaToHex(data) {
  const rgba = data.replace(/rgba?\(|\s+|\)/g, '').split(',');
  return `#${(
    (1 << 24) +
    (parseInt(rgba[0]) << 16) +
    (parseInt(rgba[1]) << 8) +
    parseInt(rgba[2])
  )
    .toString(16)
    .slice(1)}`;
}

export const setTitleBold = (content) => {
  let chars = 0;
  for (const line of content.characters.split('\n')) {
    if (line && ~line.indexOf(':')) {
      const [label] = line.split(':');

      content.setRangeFontName(chars, chars + label.length + 1, {
        family: 'Inter',
        style: 'Bold',
      });
      chars += line.length + 1;
    }
  }
};

export const colorString = (color, opacity) => {
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(
    color.g * 255
  )}, ${Math.round(color.b * 255)}, ${opacity})`;
};

export const createTooltipTextNode = ({ fontColor, fontSize }) => {
  const text = figma.createText();

  text.fontName = {
    family: 'Inter',
    style: 'Regular',
  };

  text.textAlignHorizontal = 'LEFT';
  const c = hexToRgb(fontColor);

  text.fills = [].concat(solidColor(c.r, c.g, c.b));
  text.fontSize = fontSize;

  return text;
};
