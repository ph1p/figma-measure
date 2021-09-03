export const toFixed = (number: string | number, decimalPlaces: number) => {
  number = parseFloat(number.toString());
  return !decimalPlaces
    ? number.toFixed(decimalPlaces)
    : number.toFixed(decimalPlaces).replace(/\.?0+$/, '');
};

export const findAndReplaceNumberPattern = (pattern: string, num: number) => {
  let somethingReplaced = false;
  const regexWithoutCalc = /\((\$)(#*)\)/g;
  const regexFull = /\(((\$)(#*)(\/|\*)(\d+\.?\d*))\)/g;

  for (const [match, , decimalPlace] of Array.from(
    pattern.matchAll(regexWithoutCalc)
  )) {
    somethingReplaced = true;
    pattern = pattern.replace(
      match,
      toFixed(num, decimalPlace ? decimalPlace.length : 0)
    );
  }

  for (const group of Array.from(pattern.matchAll(regexFull))) {
    somethingReplaced = true;
    const [match, , , _decimalPlace, operator, _modificator] = group;
    let result;

    const decimalPlace = _decimalPlace ? _decimalPlace.length : 0;
    const modificator = parseFloat(_modificator);

    if (operator === '/') {
      result = toFixed(num / modificator, decimalPlace);
    } else if (operator === '*') {
      result = toFixed(num * modificator, decimalPlace);
    }

    pattern = pattern.replace(match, result);
  }

  return somethingReplaced ? pattern : transformPixelToUnit(num, pattern);
};

export function transformPixelToUnit(
  pixel: number,
  unit: string,
  precision?: number
): string {
  if (typeof precision === 'undefined') {
    precision = 2;
  }

  const DPI_TO_PIXEL = {
    72: 28.35,
    100: 39,
    150: 59,
    300: 118,
  };
  const INCH_IN_CM = 2.54;

  let result: string | number;
  const unitWithoutSpaces = unit.replace(/\s/g, '');

  if (isNaN(pixel)) {
    pixel = parseFloat(pixel.toString());
  }

  result = toFixed(pixel, precision);

  // cm
  if (unitWithoutSpaces === 'cm') {
    result = toFixed(pixel / DPI_TO_PIXEL[72], precision);
  }

  // mm
  if (unitWithoutSpaces === 'mm') {
    result = toFixed((pixel / DPI_TO_PIXEL[72]) * 100, precision);
  }

  // dp
  if (unitWithoutSpaces === 'dp' || unitWithoutSpaces === 'dip') {
    result = toFixed(pixel / (DPI_TO_PIXEL[72] / 160), precision);
  }

  // pt
  if (unitWithoutSpaces === 'pt') {
    result = toFixed((3 / 4) * pixel, precision);
  }

  // inch
  if (
    unitWithoutSpaces === 'inch' ||
    unitWithoutSpaces === 'in' ||
    unitWithoutSpaces === '"'
  ) {
    result = toFixed(pixel / DPI_TO_PIXEL[72] / INCH_IN_CM, precision);
  }

  return result + unit;
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
