import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTaxId, isValidTaxId, computeCheckDigit } from '../src/lib/taxId.js';
import { generateIban, isValidIban, mod97 } from '../src/lib/iban.js';
import { IBAN_COUNTRIES, VAT_COUNTRIES } from '../src/data/options.js';
import { generateVatId, germanVatCheckDigit } from '../src/lib/vatId.js';
import { sha256 } from '../src/lib/hash.js';
import { toCsv } from '../src/lib/export.js';

// Note: tax-number generation is provided by avris-generator and needs npm install.
test('German Tax ID: checksum, digit frequency, length, no leading zero', () => {
  for (let i = 0; i < 1000; i++) {
    const id = generateTaxId();
    assert.equal(id.length, 11);
    assert.ok(isValidTaxId(id), id);
    assert.equal(id.slice(-1), computeCheckDigit(id.slice(0, 10)));
  }
  assert.ok(!isValidTaxId('00000000000'));
});

test('IBANs: nine supported country lengths and mod97 checksum', () => {
  for (const country of IBAN_COUNTRIES) {
    for (let i = 0; i < 40; i++) {
      const iban = generateIban(country.code);
      assert.equal(iban.length, country.length, iban);
      assert.ok(isValidIban(iban), iban);
      assert.equal(mod97(iban.slice(4) + iban.slice(0, 4)), 1);
    }
  }
  assert.equal(isValidIban('DE00123456789012345678'), false);
});

test('VAT IDs: country-specific shape; German checksum', () => {
  const patterns = {
    DE: /^DE\d{9}$/, HR: /^HR\d{11}$/, DK: /^DK\d{8}$/,
    FR: /^FR\d{11}$/, IE: /^IE\d{7}[A-Z]{2}$/, IT: /^IT\d{11}$/,
    LU: /^LU\d{8}$/, NL: /^NL\d{9}B\d{2}$/,
  };
  for (const country of VAT_COUNTRIES) {
    const vatId = generateVatId(country.code);
    assert.match(vatId, patterns[country.code], vatId);
    if (country.code === 'DE') assert.equal(vatId.slice(-1), germanVatCheckDigit(vatId.slice(2, 10)));
  }
});

test('SHA-256 is real SHA-256 of the exact unformatted IBAN', async () => {
  assert.equal(await sha256('DE89370400440532013000'), 'faf7e1c0107370ff6f5d03205da7d8ae41ba8e22b31e94b986a65210075d9a1d');
});

test('CSV does not lose leading zeroes; quotes special characters', () => {
  const csv = toCsv([{ vatId: 'DE000000001', iban: 'DE00123456789012345678', taxOffice: 'Office "West"; East' }]);
  assert.match(csv, /"DE000000001"/);
  assert.match(csv, /"Office ""West""; East"/);
});
