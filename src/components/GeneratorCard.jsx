import React from 'react';
import Icon from './Icon.jsx';

export default function GeneratorCard({ id, order, icon, variant, title, subtitle, value, valueClass = '', note, children, onCopy, onRegenerate, copying, busy, refreshLabel, copyLabel, className = '' }) {
  return (
    <section id={id} className={`generator-card ${className}`}>
      <div className="card-heading">
        <div className={`card-icon icon-${variant}`}><Icon name={icon} size={21}/></div>
        <div className="card-heading-text"><h3>{title}</h3><p>{subtitle}</p></div>
        <span className="card-order">{order}</span>
      </div>
      {children}
      <div className="value-panel">
        <div className={`value-text ${valueClass}`} title={value || ''}>{busy && !value ? <span className="skeleton"/> : (value || '—')}</div>
        <button type="button" className="icon-button copy-action" onClick={onCopy} disabled={!value} aria-label={copyLabel} title={copyLabel}>
          <Icon name={copying ? 'check' : 'copy'} size={17}/>
        </button>
      </div>
      <div className="card-foot"><span className="foot-note"><Icon name="check" size={14}/>{note}</span>{onRegenerate && <button type="button" className="text-button" onClick={onRegenerate} disabled={busy}><Icon name="refresh" size={15}/>{refreshLabel}</button>}</div>
    </section>
  );
}
