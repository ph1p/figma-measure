const toFixed = (number: string | number, decimalPlaces: number) => {
  number = parseFloat(number.toString());
  return !decimalPlaces
    ? number.toFixed(decimalPlaces)
    : number.toFixed(decimalPlaces).replace(/\.?0+$/, '');
};

export function transformPixelToUnit(pixel: number, unit: string): string {
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
    pixel = parseInt(pixel.toString(), 10);
  }

  result = toFixed(pixel, 2);

  // cm
  if (unitWithoutSpaces === 'cm') {
    result = toFixed(pixel / DPI_TO_PIXEL[72], 2);
  }

  // mm
  if (unitWithoutSpaces === 'mm') {
    result = Math.floor((pixel / DPI_TO_PIXEL[72]) * 100);
  }

  // dp
  if (unitWithoutSpaces === 'dp' || unitWithoutSpaces === 'dip') {
    result = Math.floor(pixel / (DPI_TO_PIXEL[72] / 160));
  }

  // pt
  if (unitWithoutSpaces === 'pt') {
    result = toFixed((3 / 4) * pixel, 2);
  }

  // inch
  if (
    unitWithoutSpaces === 'inch' ||
    unitWithoutSpaces === 'in' ||
    unitWithoutSpaces === '"'
  ) {
    result = toFixed(pixel / DPI_TO_PIXEL[72] / INCH_IN_CM, 2);
  }

  return result + unit;
}
