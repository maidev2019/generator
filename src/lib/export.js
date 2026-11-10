export const EXPORT_COLUMNS = [
  'vatId', 'vatCountry', 'taxId', 'taxNumber', 'taxOffice', 'taxOfficeCode',
  'federalState', 'iban', 'ibanCountry', 'ibanSha256',
];

export function toCsv(items) {
  const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [EXPORT_COLUMNS.join(';'), ...items.map(row => EXPORT_COLUMNS.map(key => quote(row[key])).join(';'))].join('\r\n');
}

export function downloadData(filename, contents, mime) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
