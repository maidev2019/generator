import avrisGenerator from 'avris-generator';
import { taxOfficeNameMap, taxOfficeNumberFederalStateMapping } from '../data/taxOffices.js';

const allOffices = new Set(Object.values(taxOfficeNumberFederalStateMapping).flatMap(s => [...s]));

// Keep the verified state-specific algorithm from the original project.
export function generateTaxNumber(state = 'ALL') {
  if (state !== 'ALL' && !taxOfficeNumberFederalStateMapping[state]) throw new Error('Invalid federal state');
  const allowed = state === 'ALL' ? allOffices : taxOfficeNumberFederalStateMapping[state];
  for (let attempt = 0; attempt < 1000; attempt++) {
    const number = state === 'ALL'
      ? avrisGenerator.generate('DE', 'stnr')
      : avrisGenerator.generate('DE', 'stnr', { state });
    const officeCode = String(number).slice(0, 4);
    if (allowed.has(officeCode)) {
      return {
        number,
        office: taxOfficeNameMap[officeCode] || `Office ${officeCode}`,
        officeCode,
      };
    }
  }
  throw new Error('Could not generate a tax number for this state');
}
