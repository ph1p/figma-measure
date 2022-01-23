import { GROUP_NAME_ATTACHED } from '../shared/constants';

export const isPartOfAttachedGroup = (node: SceneNode) => {
  if (!node) {
    return false;
  }

  const parent = node.parent;
  if (!parent || parent.type === 'PAGE' || parent.type === 'DOCUMENT') {
    return false;
  } else if (parent.name === GROUP_NAME_ATTACHED && parent.type === 'GROUP') {
    return true;
  } else {
    return isPartOfAttachedGroup(parent as SceneNode);
  }
};
export const getClosestAttachedGroup = (node: SceneNode) => {
  const parent = getNearestParentNode(node);

  const foundGroup = parent.findChild(
    (n) => n.type === 'GROUP' && n.name === GROUP_NAME_ATTACHED
  );

  if (foundGroup) {
    return foundGroup;
  }

  return null;
};

export const appendElementsToGroup = (
  node,
  nodes: SceneNode[],
  name = GROUP_NAME_ATTACHED
) => {
  if (nodes.length > 0) {
    const parent = getNearestParentNode(node);
    let children = [];

    const foundGroup = parent.findChild(
      (n) => n.type === 'GROUP' && n.name === GROUP_NAME_ATTACHED
    );

    if (foundGroup) {
      children = foundGroup.children;
    }

    const detachedGroup = figma.group([...nodes, ...children], parent);
    detachedGroup.name = name;
    detachedGroup.expanded = false;
  }
};

export const getNearestParentNode = (node: SceneNode) => {
  const parent = node.parent;

  if (
    (parent.type === 'FRAME' ||
      parent.type === 'PAGE' ||
      (parent.type !== 'INSTANCE' && Boolean(parent.children))) &&
    !isPartOfInstance(node)
  ) {
    return parent;
  } else {
    return getNearestParentNode(parent as SceneNode);
  }
};

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

export function getColor(color: string) {
  if (color) {
    const { r, g, b } = hexToRgb(color);
    return solidColor(r, g, b);
  } else {
    return solidColor();
  }
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

// thanks to https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/master/src/helpers/isPartOfInstance.ts
export default function isPartOfInstance(node: SceneNode): boolean {
  const parent = node.parent;
  if (parent.type === 'INSTANCE') {
    return true;
  } else if (parent.type === 'PAGE') {
    return false;
  } else {
    return isPartOfInstance(parent as SceneNode);
  }
}

export const getFontNameData = async (
  textNode: TextNode
): Promise<(FontName & { style: []; fontSize: number[] })[]> => {
  const fontNameData = [];

  const loadFontAndPush = async (font: FontName) => {
    if (
      fontNameData.some(
        (f) => f.family === font.family && !f.style.includes(font.style)
      )
    ) {
      fontNameData.find((f) => f.family === font.family).style.push(font.style);
    } else {
      if (!fontNameData.some((f) => f.family === font.family)) {
        fontNameData.push({
          ...font,
          style: [font.style],
          fontSize: getFontSizeData(textNode, font.family),
        });
      }
    }
  };

  if (textNode.fontName === figma.mixed) {
    const len = textNode.characters.length;
    for (let i = 0; i < len; i++) {
      const font = textNode.getRangeFontName(i, i + 1) as FontName;

      await loadFontAndPush(font);
    }
  } else {
    await loadFontAndPush(textNode.fontName);
  }

  return fontNameData;
};

type FontFill = Paint & {
  styleId?: string | null;
  name?: string | null;
};

export const getFillsByFillStyleId = (
  fillStyleId: string | typeof figma.mixed
) => {
  const fills: FontFill[] = [];

  if (fillStyleId && fillStyleId !== figma.mixed) {
    const style = figma.getStyleById(fillStyleId) as PaintStyle;

    if (style && style.type === 'PAINT') {
      for (const paint of style.paints as FontFill[]) {
        if (!fills.find((f) => f.styleId === style.id)) {
          fills.push({
            ...paint,
            name: style.name || null,
            styleId: style.id || null,
          });
        }
      }
    }
  }

  return fills;
};

export const getFontFillsAndStyles = (textNode: TextNode) => {
  const fills: FontFill[] = [];
  const styles = [];

  const len = textNode.characters.length;
  for (let i = 0; i < len; i++) {
    const textStyleId = textNode.getRangeTextStyleId(i, i + 1);
    const fillStyleId = textNode.getRangeFillStyleId(i, i + 1);
    const fill = textNode.getRangeFills(i, i + 1);

    const fillStyles = getFillsByFillStyleId(fillStyleId);

    for (const fillStyle of fillStyles) {
      if (!fills.find((f) => f.styleId === fillStyle.styleId)) {
        fills.push(fillStyle);
      }
    }

    if (!fillStyleId && fill !== figma.mixed && fill.length === 1) {
      if (!fills.find((f) => JSON.stringify(f) === JSON.stringify(fill[0]))) {
        fills.push(fill[0]);
      }
    }

    if (
      textStyleId &&
      textStyleId !== figma.mixed &&
      !styles.some((s) => s.id === textStyleId)
    ) {
      const textStyle = figma.getStyleById(textStyleId) as TextStyle;

      if (textStyle.type === 'TEXT') {
        const { id, name, fontName, fontSize, lineHeight, letterSpacing } =
          textStyle;

        styles.push({
          id,
          name,
          fontName,
          fontSize,
          lineHeight,
          letterSpacing,
        });
      }
    }
  }

  return {
    fills,
    styles,
  };
};
export const getFontSizeData = (textNode: TextNode, fontName: string) => {
  const fonts = {};

  const len = textNode.characters.length;
  for (let i = 0; i < len; i++) {
    const font = (textNode.getRangeFontName(i, i + 1) as FontName).family;
    const fontSize = textNode.getRangeFontSize(i, i + 1) as number;

    if (fonts[font]) {
      fonts[font] = Array.from(new Set(fonts[font].concat(fontSize)));
    } else {
      fonts[font] = [fontSize];
    }
  }

  return fontName ? fonts[fontName] : fonts;
};
