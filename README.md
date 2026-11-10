# Generator Studio · Version 2.0

A redesigned React application for generating **synthetic test data**: German tax IDs (`Steuer-ID`), state-specific tax numbers (`Steuernummer`), VAT IDs (`USt-IdNr.`), European IBANs, and the SHA-256 hash of the currently generated IBAN.

Built from the original [`maidev2019/generator`](https://github.com/maidev2019/generator) project. The original generator files are kept in `legacy/` for reference and rollback.

## New in v2

- Modern, responsive UI with sidebar and generator cards
- English / German switch, light / dark mode
- Copy individual values or the entire JSON dataset
- Country and state selectors with automatic regeneration
- Linked SHA-256 hash: recalculated whenever IBAN changes
- Batch generator (5, 10, 25, 50 or 100 records) with CSV/JSON export
- CSV includes a BOM and quotes every field; semicolon delimiter for Excel in Germany
- Separate data, algorithms, components and UI files
- Tests for Tax ID, IBAN and VAT formats; SHA-256 and CSV
- GitHub Actions deployment to GitHub Pages

## Requirements

Node.js **20.19+ or 22.12+** and npm. The app uses React 18 and Vite 6.

```bash
npm install
npm run dev
```

Visit the address shown in the terminal (normally http://localhost:5173/generator/).

To build the production bundle:

```bash
npm test
npm run build
npm run preview
```

The build is written to `dist/`.

## Publish to GitHub Pages

1. Unzip the project and copy its **contents**, including the hidden `.github` directory, into the repository [`maidev2019/generator`](https://github.com/maidev2019/generator). Replace the old `src`, `public`, `package.json`, and `index.html` files. The old Create React App files are no longer required.
2. Commit and push to `master` (or `main`).
3. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
4. The workflow `.github/workflows/deploy.yml` installs dependencies, tests, builds and publishes the `dist/` directory.
5. When the workflow completes, the app should be available at <https://maidev2019.github.io/generator/>.

For a different repository name, change the `base` path in `vite.config.js` to match its GitHub Pages subdirectory.

**Note:** The supplied 2022 `package-lock.json` was intentionally removed, because the dependency tree has been modernized. Running `npm install` creates an updated lock file. Commit the new lock file to your repository for reproducible builds.

## Files and code organization

```text
src/
  App.jsx                 Dashboard and UI state
  styles.css              All responsive styles
  i18n.js                 German/English strings
  components/
    GeneratorCard.jsx     Reusable card
    Icon.jsx              Local SVG icon set
  data/
    options.js            Country and state options
    taxOffices.js         Original 2022 tax-office mapping
  lib/
    random.js             Browser random-number helpers
    taxId.js              German Tax ID checksum + generator
    taxNumber.js          State-specific tax numbers using avris-generator
    vatId.js              VAT ID formats (+ German checksum)
    iban.js               IBAN generation / mod-97 validator
    hash.js               SHA-256 with Web Crypto
    generator.js          Dataset / field regeneration
    export.js             CSV / JSON download
```

## Technical notes and limitations

**These values are for testing only.** Even a structurally valid value may coincide with a real identifier. Never use generated values for payment instructions, tax filings or real identity verification. The app checks only supported checksums and patterns; it does not ask any government, bank, or tax registry whether an identifier was issued.

- **Tax ID:** German 11-digit IdNr with valid checksum and digit-frequency constraints. The algorithm has been corrected from the original version.
- **Tax number:** The state-specific number generator from the original project remains powered by [`avris-generator`](https://www.npmjs.com/package/avris-generator), with matching tax-office prefixes restricted to the list retained from 2022. **Office names may be outdated.** If the matching step fails, an explicit error is shown.
- **VAT ID:** German VAT IDs use the official MOD 11,10 checksum. Other supported countries generate *format-shaped examples only*; their national checksums, registration, and VIES validity are not guaranteed.
- **IBAN:** Nine countries, with country-specific length and MOD 97 check digits. Some countries may have additional national bank/account check-digit requirements that the tool does not implement. As in the original app, a few fixed bank prefixes are used; these do not guarantee live accounts.
- **SHA-256:** Hashes the exact **unformatted**, uppercase IBAN using the browser Web Crypto API. This requires HTTPS (GitHub Pages) or localhost. It is **not** a password hash or encryption.
- **Privacy:** Generated data never leaves the browser through the app's generation/export features. The app has no remote fonts or external data-service calls. A network connection is needed only to install npm dependencies or deploy updates.
- **Batching:** Output is freshly generated per row. It is synthetic and not a database of real records.

## Automated verification

```bash
npm test
```

The tests for standalone algorithms run with Node.js without needing to install the React dependencies. Full build verification still requires `npm install` and access to the package registry.

## Sources for specifications

- ELSTER / BZSt, Prüfung der Steuer- und Steueridentifikationsnummer (15 April 2026): <https://download.elster.de/download/schnittstellen/Pruefung_der_Steuer_und_Steueridentifikatsnummer.pdf>
- SWIFT, IBAN Registry: <https://www.swift.com/standards/standards-resources>
- German VAT ID checksum, § 9 ZMDV Annex 3: <https://www.haufe.de/id/norm/datentraeger-verordnung-ueber-die-abgabe-zusammenfassender-anlage-3-zu-9-HI1378226.html>

## License

Original `avris-generator` remains a separately licensed third-party library. Keep its license notices. This redesign retains original project files in `legacy/` for transparency.
