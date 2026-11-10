import { digits, letters } from './random.js';

// Only the German VAT ID is checksum-verified here. Other variants are
// country-shaped synthetic samples, NOT guaranteed to pass VIES validation.
export function germanVatCheckDigit(firstEight) {
  if (!/^\d{8}$/.test(firstEight)) throw new Error('Expected 8 digits');
  let product = 10;
  for (const char of firstEight) {
    let sum = (Number(char) + product) % 10;
    if (sum === 0) sum = 10;
    product = (2 * sum) % 11;
  }
  let result = 11 - product;
  if (result === 10) result = 0;
  return String(result);
}

export function generateVatId(country = 'DE') {
  switch (country) {
    case 'DE': {
      const body = digits(8, true);
      return 'DE' + body + germanVatCheckDigit(body);
    }
    case 'HR': return 'HR' + digits(11, true);
    case 'DK': return 'DK' + digits(8, true);
    case 'FR': return 'FR' + digits(2) + digits(9, true);
    case 'IE': return 'IE' + digits(7, true) + letters(2);
    case 'IT': return 'IT' + digits(11, true);
    case 'LU': return 'LU' + digits(8, true);
    case 'NL': return 'NL' + digits(9, true) + 'B' + digits(2);
    default: throw new Error('Unsupported VAT country');
  }
}
