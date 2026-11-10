import { randomInt, shuffle } from './random.js';

// German IdNr checksum: ISO 7064 MOD 11,10. See ELSTER tax ID specification.
export function computeCheckDigit(firstDigits) {
  if (!/^\d{10}$/.test(firstDigits)) throw new Error('Expected 10 digits');
  let product = 10;
  for (const char of firstDigits) {
    let sum = (Number(char) + product) % 10;
    if (sum === 0) sum = 10;
    product = (sum * 2) % 11;
  }
  const digit = 11 - product;
  return digit === 10 ? '0' : String(digit);
}

export function isValidTaxId(value) {
  if (!/^\d{11}$/.test(value) || value[0] === '0') return false;
  const body = value.slice(0, 10);
  const counts = [...new Set(body)].map(d => body.split(d).length - 1).sort((a, b) => b - a);
  const validCounts = counts.join(',') === '2,1,1,1,1,1,1,1,1' || counts.join(',') === '3,1,1,1,1,1,1,1';
  if (!validCounts || /(\d)\1\1/.test(body)) return false;
  return value.slice(-1) === computeCheckDigit(body);
}

export function generateTaxId() {
  for (let attempt = 0; attempt < 200; attempt++) {
    const values = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const useTriple = randomInt(2) === 0;
    const chosen = values[0];
    values[1] = chosen;
    if (useTriple) values[2] = chosen;
    const body = shuffle(values).join('');
    const candidate = body + computeCheckDigit(body);
    if (isValidTaxId(candidate)) return candidate;
  }
  throw new Error('Unable to generate a tax ID');
}
