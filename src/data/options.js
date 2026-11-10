export const FEDERAL_STATES = [
  { code: 'ALL', en: 'All federal states', de: 'Alle Bundesländer' },
  { code: 'BW', en: 'Baden-Württemberg', de: 'Baden-Württemberg' },
  { code: 'BY', en: 'Bavaria', de: 'Bayern' },
  { code: 'BE', en: 'Berlin', de: 'Berlin' },
  { code: 'BB', en: 'Brandenburg', de: 'Brandenburg' },
  { code: 'HB', en: 'Bremen', de: 'Bremen' },
  { code: 'HH', en: 'Hamburg', de: 'Hamburg' },
  { code: 'HE', en: 'Hesse', de: 'Hessen' },
  { code: 'MV', en: 'Mecklenburg-Vorpommern', de: 'Mecklenburg-Vorpommern' },
  { code: 'NI', en: 'Lower Saxony', de: 'Niedersachsen' },
  { code: 'NW', en: 'North Rhine-Westphalia', de: 'Nordrhein-Westfalen' },
  { code: 'RP', en: 'Rhineland-Palatinate', de: 'Rheinland-Pfalz' },
  { code: 'SL', en: 'Saarland', de: 'Saarland' },
  { code: 'SN', en: 'Saxony', de: 'Sachsen' },
  { code: 'ST', en: 'Saxony-Anhalt', de: 'Sachsen-Anhalt' },
  { code: 'SH', en: 'Schleswig-Holstein', de: 'Schleswig-Holstein' },
  { code: 'TH', en: 'Thuringia', de: 'Thüringen' },
];

export const IBAN_COUNTRIES = [
  { code: 'DE', en: 'Germany', de: 'Deutschland', length: 22, flag: '🇩🇪' },
  { code: 'CH', en: 'Switzerland', de: 'Schweiz', length: 21, flag: '🇨🇭' },
  { code: 'DK', en: 'Denmark', de: 'Dänemark', length: 18, flag: '🇩🇰' },
  { code: 'GR', en: 'Greece', de: 'Griechenland', length: 27, flag: '🇬🇷' },
  { code: 'HR', en: 'Croatia', de: 'Kroatien', length: 21, flag: '🇭🇷' },
  { code: 'IE', en: 'Ireland', de: 'Irland', length: 22, flag: '🇮🇪' },
  { code: 'IT', en: 'Italy', de: 'Italien', length: 27, flag: '🇮🇹' },
  { code: 'LU', en: 'Luxembourg', de: 'Luxemburg', length: 20, flag: '🇱🇺' },
  { code: 'TR', en: 'Turkey', de: 'Türkei', length: 26, flag: '🇹🇷' },
];

export const VAT_COUNTRIES = [
  { code: 'DE', en: 'Germany', de: 'Deutschland', flag: '🇩🇪' },
  { code: 'HR', en: 'Croatia', de: 'Kroatien', flag: '🇭🇷' },
  { code: 'DK', en: 'Denmark', de: 'Dänemark', flag: '🇩🇰' },
  { code: 'FR', en: 'France', de: 'Frankreich', flag: '🇫🇷' },
  { code: 'IE', en: 'Ireland', de: 'Irland', flag: '🇮🇪' },
  { code: 'IT', en: 'Italy', de: 'Italien', flag: '🇮🇹' },
  { code: 'LU', en: 'Luxembourg', de: 'Luxemburg', flag: '🇱🇺' },
  { code: 'NL', en: 'Netherlands', de: 'Niederlande', flag: '🇳🇱' },
];

export const DEFAULT_SETTINGS = { state: 'ALL', ibanCountry: 'DE', vatCountry: 'DE' };
