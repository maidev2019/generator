import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon.jsx';
import GeneratorCard from './components/GeneratorCard.jsx';
import { strings } from './i18n.js';
import { DEFAULT_SETTINGS, FEDERAL_STATES, IBAN_COUNTRIES, VAT_COUNTRIES } from './data/options.js';
import { generateSample, regenerateField } from './lib/generator.js';
import { displayIban } from './lib/iban.js';
import { toCsv, downloadData } from './lib/export.js';

const SOURCE_URL = 'https://github.com/maidev2019/generator';
const formatDate = () => new Date().toISOString().slice(0, 10);

function currentPreference(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function Sidebar({ t, active, setActive, open, setOpen }) {
  const nav = [
    { id: 'overview', icon: 'grid', label: t.overview },
    { heading: t.generators },
    { id: 'vat', icon: 'wallet', label: t.vat },
    { id: 'tax-id', icon: 'fingerprint', label: t.taxId },
    { id: 'tax-number', icon: 'building', label: t.taxNumber },
    { id: 'iban', icon: 'globe', label: t.iban },
    { id: 'sha', icon: 'hash', label: t.sha },
    { heading: t.tools },
    { id: 'batch', icon: 'layers', label: t.batch },
  ];
  return <>
    {open && <button className="mobile-overlay" aria-label={t.navClose} onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand-row"><div className="brand-mark"><span>G</span><span className="brand-star">✦</span></div><div className="brand-name"><strong>generator<span>.</span></strong><small>STUDIO</small></div><button className="mobile-close icon-button" aria-label={t.navClose} onClick={() => setOpen(false)}><Icon name="close" /></button></div>
      <div className="sidebar-content"><div className="side-label">{t.workspace}</div><nav aria-label="Main navigation">{nav.map((item, index) => item.heading
        ? <div key={index} className="side-section">{item.heading}</div>
        : <a key={item.id} href={`#${item.id}`} className={`nav-link ${active === item.id ? 'active' : ''}`} onClick={() => { setActive(item.id); setOpen(false); }}><Icon name={item.icon} size={18} /><span>{item.label}</span>{active === item.id && <span className="nav-dot" />}</a>
      )}</nav><div className="side-section project-section">PROJECT</div><a className="nav-link" href={SOURCE_URL} target="_blank" rel="noreferrer"><Icon name="github" size={18}/><span>{t.project}</span><Icon name="arrow" size={14}/></a></div>
      <div className="sidebar-bottom"><div className="privacy-illustration"><Icon name="shield" size={22}/><span className="privacy-glow"/></div><div><strong>{t.local}</strong><p>{t.localBlurb}</p></div></div>
      <div className="sidebar-version">GENERATOR STUDIO <span>v2.1</span></div>
    </aside>
  </>;
}

function CountrySelect({ label, value, options, onChange, lang, disabled = false }) {
  return <label className="field-select"><span className="field-label">{label}</span><div className="select-wrap"><select value={value} onChange={event => onChange(event.target.value)} disabled={disabled}>{options.map(item => <option value={item.code} key={item.code}>{item.flag ? `${item.flag}  ` : ''}{item[lang]}</option>)}</select><Icon name="chevronDown" size={16}/></div></label>;
}

function App() {
  const [lang, setLang] = useState(() => currentPreference('generator-language', 'en') === 'de' ? 'de' : 'en');
  const [theme, setTheme] = useState(() => currentPreference('generator-theme', 'light') === 'dark' ? 'dark' : 'light');
  const [active, setActive] = useState('overview');
  const [navOpen, setNavOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [data, setData] = useState(null);
  const [working, setWorking] = useState('all');
  const [batchCount, setBatchCount] = useState(10);
  const [batchData, setBatchData] = useState([]);
  const [batchBusy, setBatchBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState('');
  const requestRef = useRef(0);
  const t = strings[lang];

  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('generator-theme', theme); } catch {} }, [theme]);
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('generator-language', lang); } catch {} }, [lang]);
  useEffect(() => {
    let disposed = false;
    generateSample(DEFAULT_SETTINGS).then(value => { if (!disposed) { setData(value); setWorking(''); } }).catch(error => { if (!disposed) { setToast(error.message); setWorking(''); } });
    return () => { disposed = true; };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3700);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(''), 1900);
    return () => clearTimeout(timer);
  }, [copied]);

  const regenerate = useCallback(async (kind = 'all', patch = {}) => {
    const nextSettings = { ...settings, ...patch };
    if (Object.keys(patch).length) { setSettings(nextSettings); setBatchData([]); }
    const request = ++requestRef.current;
    setWorking(kind);
    try {
      const next = await regenerateField(kind, nextSettings, data);
      if (request === requestRef.current) setData(next);
    } catch (error) {
      if (request === requestRef.current) setToast(`${t.error}: ${error.message}`);
    } finally {
      if (request === requestRef.current) setWorking('');
    }
  }, [settings, data, t.error]);

  const copy = async (value, key) => {
    if (!value) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(String(value));
      else {
        const textarea = document.createElement('textarea');
        textarea.value = String(value);
        textarea.style.position = 'fixed'; textarea.style.left = '-9999px';
        document.body.appendChild(textarea); textarea.select();
        try { if (!document.execCommand('copy')) throw new Error('Copy unavailable'); }
        finally { textarea.remove(); }
      }
      setCopied(key); setToast(t.copied);
    } catch { setToast(t.copyFailed); }
  };

  const exportRows = (rows, kind) => {
    if (!rows?.length) return;
    const stamp = formatDate();
    if (kind === 'csv') downloadData(`generator-studio-${stamp}.csv`, '\uFEFF' + toCsv(rows), 'text/csv;charset=utf-8');
    else downloadData(`generator-studio-${stamp}.json`, JSON.stringify(rows, null, 2), 'application/json;charset=utf-8');
    setToast(t.downloaded);
  };

  const handleBatch = async () => {
    setBatchBusy(true);
    setBatchData([]);
    try {
      const rows = [];
      for (let i = 0; i < batchCount; i++) rows.push(await generateSample(settings));
      setBatchData(rows);
      setToast(`${rows.length} ${t.batchDone}`);
    } catch (error) { setToast(`${t.error}: ${error.message}`); }
    finally { setBatchBusy(false); }
  };

  const optionsState = { lang };
  const busy = Boolean(working);
  const copyParam = id => ({ copyLabel: t.copy, copying: copied === id, refreshLabel: t.refresh, busy });
  return <div className="app-shell">
    <Sidebar t={t} active={active} setActive={setActive} open={navOpen} setOpen={setNavOpen}/>
    <main id="overview" className="main-view">
      <div className="topbar"><div className="topbar-left"><button className="top-mobile-menu icon-button" onClick={() => setNavOpen(true)} aria-label={t.navOpen}><Icon name="menu" size={22}/></button><span className="breadcrumbs">{t.breadcrumb}</span></div><div className="topbar-actions"><span className="online-chip"><span className="online-circle"/>{t.online}</span><button className="header-tool lang-button" title={t.language} onClick={() => setLang(lang === 'en' ? 'de' : 'en')}><Icon name="globe" size={17}/><span>{lang.toUpperCase()}</span></button><button className="header-tool theme-button" title={t.dark} aria-label={t.dark} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={18}/></button></div></div>
      <div className="page-content">
        <section className="workspace-toolbar" aria-labelledby="workspace-title">
          <div className="workspace-intro">
            <div className="workspace-kicker"><Icon name="sparkles" size={15}/><span>GENERATOR STUDIO</span><span className="workspace-kicker-divider"/><span className="workspace-test-tag"><Icon name="shield" size={13}/>{t.badge}</span></div>
            <h1 id="workspace-title">{t.sectionTitle}</h1>
            <p>{t.sectionSubtitle}</p>
          </div>
          <div className="workspace-actions">
            <button className="primary-btn" disabled={busy} onClick={() => regenerate('all')}><Icon name="sparkles" size={17}/>{busy ? t.generating : t.generateAll}</button>
            <button className="workspace-copy-btn" disabled={!data} onClick={() => copy(JSON.stringify(data, null, 2), 'all')}><Icon name={copied === 'all' ? 'check' : 'copy'} size={16}/>{t.copyAll}</button>
          </div>
        </section>

        <div className="generator-grid">
          <GeneratorCard id="vat" order="01" icon="wallet" variant="indigo" title={t.vat} subtitle={t.vatSubtitle} value={data?.vatId} note={settings.vatCountry === 'DE' ? t.checksum : t.formatOnly} onCopy={() => copy(data?.vatId, 'vat')} onRegenerate={() => regenerate('vat')} {...copyParam('vat')}>
            <CountrySelect label={t.country} value={settings.vatCountry} options={VAT_COUNTRIES} onChange={value => regenerate('vat', {vatCountry:value})} disabled={busy} {...optionsState}/>
          </GeneratorCard>
          <GeneratorCard id="tax-id" order="02" icon="fingerprint" variant="purple" title={t.taxId} subtitle={t.taxIdSubtitle} value={data?.taxId} note={t.checksum} onCopy={() => copy(data?.taxId, 'taxId')} onRegenerate={() => regenerate('taxId')} {...copyParam('taxId')}>
            <div className="field-spacer"/><div className="field-info"><Icon name="shield" size={16}/><span>DE · 11 digits · MOD 11,10</span></div>
          </GeneratorCard>
          <GeneratorCard id="tax-number" order="03" icon="building" variant="blue" title={t.taxNumber} subtitle={t.taxNumberSubtitle} value={data?.taxNumber} note={t.generated} onCopy={() => copy(data?.taxNumber, 'taxNumber')} onRegenerate={() => regenerate('taxNumber')} {...copyParam('taxNumber')}>
            <CountrySelect label={t.state} value={settings.state} options={FEDERAL_STATES} onChange={value => regenerate('taxNumber', {state:value})} disabled={busy} {...optionsState}/>
            <div className="office-line"><span>{t.taxOffice}</span><strong title={data?.taxOffice || ''}>{data?.taxOffice || '—'}</strong><button type="button" className="office-copy" title={t.copy} aria-label={t.copy} onClick={() => copy(data?.taxOffice, 'taxOffice')} disabled={!data?.taxOffice}><Icon name={copied === 'taxOffice' ? 'check' : 'copy'} size={14}/></button></div>
          </GeneratorCard>
          <GeneratorCard id="iban" order="04" icon="globe" variant="green" title={t.iban} subtitle={t.ibanSubtitle} value={data?.iban ? displayIban(data.iban) : ''} valueClass="iban-value" note={t.checksum} onCopy={() => copy(data?.iban, 'iban')} onRegenerate={() => regenerate('iban')} {...copyParam('iban')}>
            <CountrySelect label={t.country} value={settings.ibanCountry} options={IBAN_COUNTRIES} onChange={value => regenerate('iban', {ibanCountry:value})} disabled={busy} {...optionsState}/>
          </GeneratorCard>
          <GeneratorCard id="sha" order="05" icon="hash" variant="orange" title={t.sha} subtitle={t.shaSubtitle} value={data?.ibanSha256} valueClass="hash-value" note={t.linked} onCopy={() => copy(data?.ibanSha256, 'sha')} {...copyParam('sha')} className="hash-card">
            <div className="hash-explainer"><Icon name="info" size={16}/>{t.longHash}</div>
          </GeneratorCard>
        </div>

        <section className="batch-panel" id="batch"><div className="batch-content"><div className="batch-title-row"><div className="batch-icon"><Icon name="layers" size={22}/></div><div><span className="small-overline">02 / BULK EXPORT</span><h2>{t.batchTitle}</h2></div></div><p>{t.batchDescription}</p><div className="batch-controls"><label className="field-select batch-select"><span className="field-label">{t.rows}</span><div className="select-wrap"><select value={batchCount} onChange={e => { setBatchCount(Number(e.target.value)); setBatchData([]); }}>{[5,10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}</select><Icon name="chevronDown" size={15}/></div></label><button className="primary-btn" disabled={batchBusy || busy} onClick={handleBatch}><Icon name="sparkles" size={16}/>{batchBusy ? t.generating : t.generateBatch}</button></div></div><div className="batch-exports"><div className="export-icon"><Icon name="file" size={25}/></div><strong>{batchData.length ? `${batchData.length} ${t.batchReady}` : t.noBatch}</strong><div className="export-buttons"><button className="outline-btn" onClick={() => exportRows(batchData, 'csv')} disabled={!batchData.length}><Icon name="download" size={16}/>{t.downloadCsv}</button><button className="outline-btn" onClick={() => exportRows(batchData, 'json')} disabled={!batchData.length}><Icon name="download" size={16}/>{t.downloadJson}</button></div></div></section>

        <div className="notice"><div className="notice-icon"><Icon name="info" size={20}/></div><div><strong>{t.important}</strong><p>{t.importantBody}</p></div></div>
        <footer className="page-footer"><span>© 2026 {t.footer}</span><span>{t.footerNote}</span></footer>
      </div>
    </main>
    {toast && <div className="toast" role="status"><Icon name={toast.includes(t.error) || toast.includes('failed') ? 'alert' : 'check'} size={18}/><span>{toast}</span><button onClick={() => setToast('')} aria-label={t.navClose}><Icon name="close" size={15}/></button></div>}
  </div>;
}

export default App;
