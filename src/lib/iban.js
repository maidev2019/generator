import { digits, letters, pick } from './random.js';
import { IBAN_COUNTRIES } from '../data/options.js';

// IBAN's ISO 13616 MOD 97-10 check. Returns the remainder without large integers.
export function mod97(input) {
  let remainder = 0;
  for (const c of input.toUpperCase()) {
    let value;
    if (/\d/.test(c)) value = c;
    else if (/[A-Z]/.test(c)) value = String(c.charCodeAt(0) - 55);
    else throw new Error('Invalid IBAN character');
    for (const digit of value) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder;
}

function italianCin(bbanWithoutCin) {
  const oddValues = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21];
  let total = 0;
  for (let i = 0; i < bbanWithoutCin.length; i++) {
    const n = Number(bbanWithoutCin[i]);
    total += i % 2 === 0 ? oddValues[n] : n;
  }
  return String.fromCharCode(65 + (total % 26));
}

function makeBban(country) {
  switch (country) {
    case 'DE': return '50010517' + digits(10);
    case 'CH': return '89144' + digits(12);
    case 'DK': return '5051' + digits(10);
    case 'GR': return pick(['010', '011', '014', '017']) + digits(20);
    case 'HR': return pick(['2340009', '2500009', '2402006', '2360000', '2484008']) + digits(10);
    case 'IE': return 'BOFI900017' + digits(8);
    case 'IT': {
      const rest = '0300203280' + digits(12);
      return italianCin(rest) + rest;
    }
    case 'LU': return '010' + digits(13);
    case 'TR': return '000620' + digits(16);
    default: throw new Error('Unsupported IBAN country');
  }
}

export function isValidIban(value) {
  const iban = String(value || '').replace(/\s/g, '').toUpperCase();
  const country = IBAN_COUNTRIES.find(c => c.code === iban.slice(0, 2));
  if (!country || iban.length !== country.length || !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;
  return mod97(iban.slice(4) + iban.slice(0, 4)) === 1;
}

export function generateIban(country = 'DE') {
  const bban = makeBban(country);
  const check = String(98 - mod97(bban + country + '00')).padStart(2, '0');
  const iban = country + check + bban;
  if (!isValidIban(iban)) throw new Error('IBAN checksum failed');
  return iban;
}

export function displayIban(value) {
  return (value || '').replace(/(.{4})/g, '$1 ').trim();
}
