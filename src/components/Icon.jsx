import React from 'react';

const strokes = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  sparkles: <><path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Z"/><path d="m19 17 .7 1.3L21 19l-1.3.7L19 21l-.7-1.3L17 19l1.3-.7L19 17ZM4 3l.5 1.5L6 5l-1.5.5L4 7l-.5-1.5L2 5l1.5-.5L4 3Z"/></>,
  wallet: <><rect x="3" y="6" width="18" height="15" rx="3"/><path d="M17 13h4M3 10V6a3 3 0 0 1 3-3h11"/><circle cx="17" cy="13.5" r=".5"/></>,
  hash: <><path d="M5 9h14M4 15h14M11 3 7 21M17 3l-4 18"/></>,
  building: <><rect x="4" y="10" width="16" height="11" rx="1"/><path d="m2 10 10-7 10 7M9 21v-7h6v7M8 10h.01M16 10h.01"/></>,
  fingerprint: <><path d="M6 10a6 6 0 0 1 12 0M4 13v-3a8 8 0 0 1 16 0v2M12 8a3 3 0 0 1 3 3c0 4-.5 7-2 10M9 11v4c0 2-.5 4-1.5 5M18 14c-.3 2.5-1.3 5.3-2.5 7M6 16c0 1.2-.2 2.1-.5 3"/></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.7 9A7 7 0 0 1 19 12l1 0M4 12a7 7 0 0 0 13.3 3"/></>,
  download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="M12 22c6-3 8-7 8-13V5l-8-3-8 3v4c0 6 2 10 8 13Z"/><path d="m9 12 2 2 4-4"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  close: <path d="M5 5 19 19M19 5 5 19"/>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
  file: <><path d="M6 2h8l5 5v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h5M8 13h8M8 17h8"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  activity: <path d="M3 12h4l3-7 4 14 3-7h4"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M12 15h4"/></>,
  github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-3.3a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6A4.7 4.7 0 0 0 18.4 7a4.2 4.2 0 0 0-.1-3.1S16.3 4 14.9 5.5a12 12 0 0 0-5.8 0C7.7 4 5.7 3.9 5.7 3.9A4.2 4.2 0 0 0 5.6 7a4.7 4.7 0 0 0-1.3 3.4c0 4.7 2.8 5.7 5.5 6A3 3 0 0 0 9 18.7V22"/></>,
  alert: <><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/></>,
};

export default function Icon({ name, size = 18, className = '', strokeWidth = 1.85 }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{strokes[name] || strokes.grid}</svg>;
}
