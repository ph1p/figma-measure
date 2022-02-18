export const toFixed = (number: string | number, decimalPlaces: number) => {
  if (!number) {
    return '0';
  }
  number = parseFloat(number.toString());
  return !decimalPlaces
    ? number.toFixed(decimalPlaces)
    : number.toFixed(decimalPlaces).replace(/\.?0+$/, '');
};

export const overlaps = (node1, node2) => {
  if (node1.x >= node2.x2 || node2.x >= node1.x2) return false;
  if (node1.y >= node2.y2 || node2.y >= node1.y2) return false;

  return true;
};

export const findAndReplaceNumberPattern = (pattern: string, num: number) => {
  if (!pattern) {
    pattern = '($)px';
  }

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

export const transformPixelToUnit = (
  pixel: number,
  unit: string,
  precision?: number
) => {
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
};
