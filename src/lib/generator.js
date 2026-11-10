import { generateIban } from './iban.js';
import { generateTaxId } from './taxId.js';
import { generateVatId } from './vatId.js';
import { generateTaxNumber } from './taxNumber.js';
import { sha256 } from './hash.js';

export async function generateSample(settings) {
  const taxNumber = generateTaxNumber(settings.state);
  const iban = generateIban(settings.ibanCountry);
  const ibanSha256 = await sha256(iban);
  return {
    vatId: generateVatId(settings.vatCountry),
    taxId: generateTaxId(),
    taxNumber: taxNumber.number,
    taxOffice: taxNumber.office,
    taxOfficeCode: taxNumber.officeCode,
    federalState: settings.state,
    iban,
    ibanSha256,
    ibanCountry: settings.ibanCountry,
    vatCountry: settings.vatCountry,
  };
}

export async function regenerateField(kind, settings, current) {
  if (!current || kind === 'all') return generateSample(settings);
  if (kind === 'vat') return { ...current, vatId: generateVatId(settings.vatCountry), vatCountry: settings.vatCountry };
  if (kind === 'taxId') return { ...current, taxId: generateTaxId() };
  if (kind === 'taxNumber') {
    const n = generateTaxNumber(settings.state);
    return { ...current, taxNumber: n.number, taxOffice: n.office, taxOfficeCode: n.officeCode, federalState: settings.state };
  }
  if (kind === 'iban') {
    const iban = generateIban(settings.ibanCountry);
    return { ...current, iban, ibanSha256: await sha256(iban), ibanCountry: settings.ibanCountry };
  }
  throw new Error('Unsupported field');
}
