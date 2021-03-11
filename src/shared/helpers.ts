export function transformPixelToUnit(pixel: number, unit: string): string {
  const DPI_TO_PIXEL = {
    72: 28.35,
    100: 39,
    150: 59,
    300: 118,
  };
  const INCH_IN_CM = 2.54;

  let result = pixel;
  const unitWithoutSpaces = unit.replace(/\s/g, '');

  if (isNaN(pixel)) {
    pixel = parseInt(pixel.toString(), 10);
  }

  // cm
  if (unitWithoutSpaces === 'cm') {
    result = pixel / DPI_TO_PIXEL[72];
  }

  // mm
  if (unitWithoutSpaces === 'mm') {
    result = (pixel / DPI_TO_PIXEL[72]) * 100;
  }

  // dp
  if (unitWithoutSpaces === 'dp' || unitWithoutSpaces === 'dip') {
    result = pixel / (DPI_TO_PIXEL[72] / 160);
  }

  // pt
  if (unitWithoutSpaces === 'pt') {
    result = (3 / 4) * pixel;
  }

  // inch
  if (
    unitWithoutSpaces === 'inch' ||
    unitWithoutSpaces === 'in' ||
    unitWithoutSpaces === '"'
  ) {
    result = pixel / DPI_TO_PIXEL[72] / INCH_IN_CM;
  }

  return Math.floor(result) + unit;
}
