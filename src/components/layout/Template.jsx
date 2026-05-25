// DownDer prototype — themed two ways (calm | crisp)
// Self-contained. Loaded once; instantiated twice inside the canvas.
"use client";
import { useState, useEffect, useMemo } from "react";

// ─── Theme tokens ──────────────────────────────────────────────────────────
const THEMES = {
  calm: {
    name: 'Calm warm',
    bg:        '#faf8f4',
    surface:   '#ffffff',
    surface2:  '#f3efe7',
    line:      'rgba(60,40,20,0.10)',
    line2:     'rgba(60,40,20,0.18)',
    ink:       '#231d16',
    ink2:      '#5a4d3d',
    mute:      '#8a7e6c',
    accent:    'oklch(0.68 0.11 42)',     // warm clay
    accentInk: '#ffffff',
    accentSoft:'oklch(0.94 0.04 60)',
    good:      'oklch(0.62 0.10 150)',
    radius:    14,
    radiusLg:  22,
    display:   '"Instrument Serif", "Times New Roman", Georgia, serif',
    ui:        '"Geist", ui-sans-serif, system-ui, sans-serif',
    mono:      '"Geist Mono", ui-monospace, monospace',
    displayWeight: 400,
    displayItalic: true,
    dark: {
      bg: '#1a1612', surface: '#221d17', surface2: '#2b251d',
      line: 'rgba(255,240,220,0.10)', line2: 'rgba(255,240,220,0.18)',
      ink: '#f6efe2', ink2: '#b9ad99', mute: '#8a7e6c',
      accent: 'oklch(0.78 0.12 50)', accentInk: '#1a1208',
      accentSoft: 'oklch(0.34 0.05 50)',
    },
  },
  crisp: {
    name: 'Crisp neutral',
    bg:        '#f6f7f9',
    surface:   '#ffffff',
    surface2:  '#eef0f3',
    line:      'rgba(15,23,40,0.08)',
    line2:     'rgba(15,23,40,0.16)',
    ink:       '#0e1620',
    ink2:      '#3d4654',
    mute:      '#7a8492',
    accent:    'oklch(0.60 0.13 165)',    // emerald
    accentInk: '#ffffff',
    accentSoft:'oklch(0.94 0.04 165)',
    good:      'oklch(0.60 0.13 165)',
    radius:    10,
    radiusLg:  14,
    display:   '"Geist", ui-sans-serif, system-ui, sans-serif',
    ui:        '"Geist", ui-sans-serif, system-ui, sans-serif',
    mono:      '"Geist Mono", ui-monospace, monospace',
    displayWeight: 600,
    displayItalic: false,
    dark: {
      bg: '#0d1117', surface: '#141a22', surface2: '#1c232d',
      line: 'rgba(200,220,255,0.08)', line2: 'rgba(200,220,255,0.18)',
      ink: '#e7eef7', ink2: '#9aa6b6', mute: '#6a7585',
      accent: 'oklch(0.72 0.14 165)', accentInk: '#06140d',
      accentSoft: 'oklch(0.28 0.05 165)',
    },
  },
};

function resolveTheme(themeKey, dark) {
  const base = THEMES[themeKey];
  if (!dark) return base;
  return { ...base, ...base.dark };
}

// ─── Original (non-branded) platform glyphs ────────────────────────────────
// Simple geometric monograms. NOT the real platform marks.
function PlatformGlyph({ kind, size = 14, color = 'currentColor' }) {
  const s = size, c = color;
  const wrap = (children) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>{children}</svg>
  );
  switch (kind) {
    case 'yt':
      return wrap(<>
        <rect x="2" y="6" width="20" height="12" rx="3" stroke={c} strokeWidth="1.6"/>
        <path d="M10 9.5l5 2.5-5 2.5z" fill={c}/>
      </>);
    case 'tt':
      return wrap(<>
        <path d="M9 4v10a3 3 0 11-3-3" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M9 4c.5 2.5 2.4 4.2 5 4.5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      </>);
    case 'ig':
      return wrap(<>
        <rect x="4" y="4" width="16" height="16" rx="4.5" stroke={c} strokeWidth="1.6"/>
        <circle cx="12" cy="12" r="3.5" stroke={c} strokeWidth="1.6"/>
        <circle cx="17" cy="7" r="0.9" fill={c}/>
      </>);
    case 'fb':
      return wrap(<>
        <path d="M13 21v-8h2.6l.4-3H13V8.3c0-.9.2-1.5 1.5-1.5H16V4.1A21 21 0 0013.6 4c-2.3 0-3.8 1.4-3.8 4v2H7v3h2.8v8" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
      </>);
    case 'x':
      return wrap(<>
        <path d="M5 5l14 14M19 5L5 19" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      </>);
    default: return null;
  }
}
const PLATFORMS = [
  { id: 'yt', name: 'YouTube' },
  { id: 'tt', name: 'TikTok' },
  { id: 'ig', name: 'Instagram' },
  { id: 'fb', name: 'Facebook' },
  { id: 'x',  name: 'X' },
];

// ─── Tiny inline icons (line, neutral) ─────────────────────────────────────
const I = {
  paste:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 4h6v3H9zM7 6H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  x:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  arrow:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dl:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8.5 12l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lock:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10.5V7a4 4 0 018 0v3.5" stroke="currentColor" strokeWidth="1.6"/></svg>,
  play:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M7 5v14l12-7z" fill="currentColor"/></svg>,
  mute:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 10v4h3l5 4V6L7 10H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  sound:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 10v4h3l5 4V6L7 10H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M16 9c1.5 1.5 1.5 4.5 0 6M19 7c3 3 3 7 0 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  scissors:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="6" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M20 5L8.5 15.5M20 19L8.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  convert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 8h12l-3-3m3 3l-3 3M20 16H8l3 3m-3-3l3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  qr:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="4" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="3" height="3" fill="currentColor"/><rect x="19" y="19" width="2" height="2" fill="currentColor"/></svg>,
  alert:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 10v5M12 17.5v.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  spin:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4a8 8 0 018 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ─── Striped video-thumbnail placeholder (original) ────────────────────────
function ThumbPlaceholder({ t, label = 'video preview' }) {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '16 / 9',
      borderRadius: t.radius, overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${t.surface2} 0 12px, ${t.bg} 12px 24px)`,
      border: `1px solid ${t.line}`,
    }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 54, height: 54, borderRadius: '50%',
          background: t.surface, border: `1px solid ${t.line2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.ink,
        }}>{I.play}</div>
      </div>
      <div style={{
        position: 'absolute', left: 10, bottom: 8,
        font: `10px/1 ${t.mono}`, color: t.mute, letterSpacing: '.04em',
        textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// ─── QR placeholder ────────────────────────────────────────────────────────
// Deterministic dotted square with finder marks. Not a real QR; just looks
// the part for a mockup.
function QRMark({ t, seed = 'downder', size = 110 }) {
  const N = 21;
  const cells = useMemo(() => {
    // simple deterministic PRNG from seed
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 0xffffffff; };
    const grid = Array.from({ length: N }, () => Array(N).fill(0));
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) grid[y][x] = rand() > 0.5 ? 1 : 0;
    // finder squares
    const drawFinder = (x0, y0) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const onBorder = x === 0 || y === 0 || x === 6 || y === 6;
        const onInner  = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[y0 + y][x0 + x] = (onBorder || onInner) ? 1 : 0;
      }
    };
    drawFinder(0, 0); drawFinder(N - 7, 0); drawFinder(0, N - 7);
    // quiet zone next to finders
    for (let i = 0; i < 8; i++) { grid[7][i] = 0; grid[i][7] = 0; grid[N - 8][i] = 0; grid[i][N - 8] = 0; }
    return grid;
  }, [seed]);
  const cell = size / N;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill={t.surface} />
      {cells.map((row, y) => row.map((v, x) => v ? (
        <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={t.ink} />
      ) : null))}
    </svg>
  );
}

// ─── Reusable primitives ───────────────────────────────────────────────────
function Pill({ t, children, tone = 'neutral', style }) {
  const tones = {
    neutral: { bg: t.surface2, fg: t.ink2, bd: t.line },
    good:    { bg: t.accentSoft, fg: t.good, bd: 'transparent' },
    accent:  { bg: t.accent, fg: t.accentInk, bd: 'transparent' },
    ghost:   { bg: 'transparent', fg: t.ink2, bd: t.line },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 999,
      background: tones.bg, color: tones.fg,
      border: `1px solid ${tones.bd}`,
      font: `11px/1 ${t.ui}`, letterSpacing: '.005em',
      ...style,
    }}>{children}</span>
  );
}

function Btn({ t, children, onClick, kind = 'primary', size = 'md', icon, disabled, style }) {
  const sz = size === 'sm' ? { h: 30, px: 12, fs: 12.5 } : size === 'lg' ? { h: 50, px: 22, fs: 15 } : { h: 38, px: 16, fs: 13.5 };
  const kinds = {
    primary: { bg: t.accent, fg: t.accentInk, bd: 'transparent', hover: 'brightness(0.95)' },
    ghost:   { bg: 'transparent', fg: t.ink, bd: t.line2, hover: 'brightness(0.98)' },
    soft:    { bg: t.surface2, fg: t.ink, bd: 'transparent', hover: 'brightness(0.97)' },
    danger:  { bg: 'transparent', fg: t.ink, bd: t.line2, hover: 'brightness(0.98)' },
  }[kind];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      height: sz.h, padding: `0 ${sz.px}px`,
      borderRadius: t.radius, border: `1px solid ${kinds.bd}`,
      background: kinds.bg, color: kinds.fg,
      font: `500 ${sz.fs}px/1 ${t.ui}`,
      letterSpacing: kind === 'primary' ? '.005em' : 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'filter .15s, transform .1s',
      whiteSpace: 'nowrap',
      ...style,
    }}
    onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)'; }}
    onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}>
      {icon}{children}
    </button>
  );
}

// ─── State demo stepper (bottom rail) ──────────────────────────────────────
const STATES = ['idle', 'smartpaste', 'loading', 'result', 'downloading', 'completed', 'error'];
const STATE_LABELS = {
  idle: 'Idle', smartpaste: 'Smart paste', loading: 'Fetching',
  result: 'Result', downloading: 'Downloading', completed: 'Completed', error: 'Error',
};

function StateRail({ t, state, setState }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      borderTop: `1px solid ${t.line}`, background: t.surface,
      padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 10,
      font: `11px/1 ${t.mono}`, color: t.mute,
    }}>
      <span style={{ letterSpacing: '.1em', textTransform: 'uppercase' }}>Walkthrough</span>
      <div style={{ width: 1, height: 14, background: t.line }} />
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {STATES.map((s, i) => {
          const active = state === s;
          return (
            <button key={s} onClick={() => setState(s)} style={{
              padding: '5px 10px', borderRadius: 999,
              border: `1px solid ${active ? 'transparent' : t.line}`,
              background: active ? t.ink : 'transparent',
              color: active ? t.surface : t.ink2,
              font: `inherit`, cursor: 'pointer', letterSpacing: '.02em',
            }}>{String(i + 1).padStart(2, '0')} · {STATE_LABELS[s]}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────
function Header({ t }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 36px', borderBottom: `1px solid ${t.line}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Original wordmark — letter D in a circle */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: t.ink, color: t.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          font: `600 14px/1 ${t.ui}`, letterSpacing: '-.02em',
        }}>D</div>
        <div style={{ font: `600 17px/1 ${t.ui}`, color: t.ink, letterSpacing: '-.01em' }}>
          DownDer
        </div>
      </div>
      <nav style={{ display: 'flex', gap: 22, alignItems: 'center', font: `13px/1 ${t.ui}`, color: t.ink2 }}>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>How it works</a>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Supported sites</a>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
        <Pill t={t} tone="good"><span style={{ color: t.good }}>{I.shield}</span> Zero‑logs</Pill>
      </nav>
    </header>
  );
}

// ─── Hero / input ──────────────────────────────────────────────────────────
function Hero({ t, state, setState, url, setUrl, advanced }) {
  const showSmart = state === 'smartpaste';
  const isLoading = state === 'loading';

  return (
    <section style={{ padding: '46px 36px 24px', textAlign: 'center', position: 'relative' }}>
      <div style={{
        font: `${t.displayWeight} 52px/1.05 ${t.display}`,
        fontStyle: t.displayItalic ? 'italic' : 'normal',
        color: t.ink, letterSpacing: '-.02em', marginBottom: 14,
      }}>
        Paste the link. Keep the video.
      </div>
      <div style={{
        font: `15px/1.5 ${t.ui}`, color: t.ink2, maxWidth: 540, margin: '0 auto 30px',
      }}>
        Drop any video URL and DownDer fetches the formats, qualities and audio tracks
        worth keeping. Streamed straight to your device — no servers, no scrapbook.
      </div>

      {/* Input bar */}
      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          height: 64, padding: '0 8px 0 22px',
          background: t.surface, borderRadius: t.radiusLg,
          border: `1px solid ${t.line2}`,
          boxShadow: `0 1px 0 ${t.surface} inset, 0 18px 40px -28px ${t.ink}30`,
        }}>
          <span style={{ color: t.mute, display: 'flex' }}>{I.lock}</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube, TikTok, Instagram, Facebook or X link…"
            style={{
              flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
              font: `15px/1 ${t.ui}`, color: t.ink, letterSpacing: '-.005em',
            }}
          />
          {url ? (
            <button onClick={() => setUrl('')} style={{
              width: 28, height: 28, borderRadius: 8, border: 'none',
              background: t.surface2, color: t.ink2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }} aria-label="Clear">{I.x}</button>
          ) : (
            <Btn t={t} kind="ghost" size="sm" icon={I.paste}
              onClick={() => setState('smartpaste')}>Smart paste</Btn>
          )}
          <Btn t={t} kind="primary" size="md" icon={isLoading ? null : I.arrow}
            onClick={() => { if (url) setState('loading'); }}
            disabled={!url || isLoading}
            style={{ height: 50, padding: '0 22px', borderRadius: t.radius }}>
            {isLoading ? (<><span style={{ display: 'inline-block', animation: 'dd-spin .9s linear infinite' }}>{I.spin}</span> Fetching</>) : 'Get video'}
          </Btn>
        </div>

        {/* Smart-paste suggestion */}
        {showSmart && (
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, 10px)',
            background: t.surface, border: `1px solid ${t.line2}`,
            borderRadius: t.radius, padding: '10px 12px',
            boxShadow: `0 10px 32px -18px ${t.ink}40`,
            display: 'flex', alignItems: 'center', gap: 10, zIndex: 5,
            font: `12.5px/1.2 ${t.ui}`, color: t.ink2, whiteSpace: 'nowrap',
          }}>
            <span style={{ color: t.accent, display: 'flex' }}>{I.paste}</span>
            <span>Clipboard has a <b style={{ color: t.ink }}>TikTok link</b> — use it?</span>
            <code style={{ font: `11px/1 ${t.mono}`, color: t.mute, background: t.surface2, padding: '3px 6px', borderRadius: 6 }}>
              tiktok.com/@maya.films/video/7387…
            </code>
            <Btn t={t} kind="primary" size="sm" onClick={() => {
              setUrl('https://www.tiktok.com/@maya.films/video/7387264829017');
              setState('idle');
            }}>Paste &amp; fetch</Btn>
            <button onClick={() => setState('idle')} style={{
              width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent',
              color: t.mute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{I.x}</button>
          </div>
        )}
      </div>

      {/* Platform chips */}
      <div style={{
        marginTop: 30, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{
          font: `11px/1 ${t.mono}`, color: t.mute, letterSpacing: '.1em',
          textTransform: 'uppercase', alignSelf: 'center', marginRight: 6,
        }}>Works with</span>
        {PLATFORMS.map((p) => (
          <div key={p.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 11px', borderRadius: 999,
            border: `1px solid ${t.line}`, background: t.surface,
            font: `12px/1 ${t.ui}`, color: t.ink2,
          }}>
            <span style={{ color: t.ink2, display: 'flex' }}><PlatformGlyph kind={p.id}/></span>
            {p.name}
          </div>
        ))}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '6px 11px', borderRadius: 999,
          font: `12px/1 ${t.ui}`, color: t.mute,
        }}>+ 80 more</div>
      </div>
    </section>
  );
}

// ─── Loading skeleton card ─────────────────────────────────────────────────
function LoadingCard({ t }) {
  return (
    <div style={cardStyle(t)}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        <div style={{
          aspectRatio: '16 / 9', borderRadius: t.radius,
          background: t.surface2, animation: 'dd-pulse 1.2s ease-in-out infinite',
        }}/>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: t.mute, font: `12px/1 ${t.mono}` }}>
            <span style={{ display: 'inline-block', animation: 'dd-spin .9s linear infinite' }}>{I.spin}</span>
            FETCHING METADATA · GO ROUTINES SPUN UP
          </div>
          {[78, 52, 88, 64].map((w, i) => (
            <div key={i} style={{
              height: i === 0 ? 22 : 14, width: `${w}%`,
              borderRadius: 6, background: t.surface2,
              marginBottom: 10,
              animation: `dd-pulse 1.2s ease-in-out infinite`, animationDelay: `${i * 0.1}s`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Result / quality grid ─────────────────────────────────────────────────
const VIDEO_META = {
  title: 'Slow mornings in Lisbon — a quiet roof, a hot espresso, and the 28 tram',
  uploader: 'maya.films',
  duration: '04:38',
  views: '128.4K',
  url: 'tiktok.com/@maya.films/video/7387264829017',
};

const FORMATS = [
  { id: 'mp4-1080', label: '1080p',  kind: 'MP4',  size: '184 MB', tag: 'recommended' },
  { id: 'mp4-720',  label: '720p',   kind: 'MP4',  size: '94 MB' },
  { id: 'mp4-480',  label: '480p',   kind: 'MP4',  size: '46 MB' },
  { id: 'wbm-1080', label: '1080p',  kind: 'WebM', size: '152 MB' },
  { id: 'wbm-720',  label: '720p',   kind: 'WebM', size: '78 MB' },
  { id: 'mp3-320',  label: 'Audio',  kind: 'MP3 · 320 kbps',  size: '11 MB' },
];

function cardStyle(t) {
  return {
    background: t.surface, border: `1px solid ${t.line}`,
    borderRadius: t.radiusLg, padding: 28,
    boxShadow: `0 1px 0 ${t.surface} inset, 0 22px 50px -38px ${t.ink}25`,
  };
}

function VideoPreviewCard({ t, muted, setMuted, advanced }) {
  return (
    <div style={{ position: 'relative' }}>
      <ThumbPlaceholder t={t} label={`${VIDEO_META.uploader} · preview`}/>
      {advanced && (
        <div style={{
          position: 'absolute', left: 10, top: 10, display: 'flex', gap: 6,
        }}>
          <button onClick={() => setMuted(!muted)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 28, padding: '0 10px', borderRadius: 999,
            background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none',
            font: `11.5px/1 ${t.ui}`, cursor: 'pointer', backdropFilter: 'blur(6px)',
          }}>{muted ? I.mute : I.sound}{muted ? 'Muted' : 'Sound'}</button>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 28, padding: '0 10px', borderRadius: 999,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            font: `11.5px/1 ${t.ui}`, backdropFilter: 'blur(6px)',
          }}>1.0× preview</span>
        </div>
      )}
      <div style={{
        position: 'absolute', right: 10, top: 10,
        background: 'rgba(0,0,0,0.6)', color: '#fff',
        padding: '5px 9px', borderRadius: 999,
        font: `11px/1 ${t.mono}`, letterSpacing: '.04em',
      }}>{VIDEO_META.duration}</div>
    </div>
  );
}

function FormatRow({ t, fmt, onDownload, active }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '64px 1fr auto auto',
      alignItems: 'center', gap: 14,
      padding: '12px 14px',
      borderRadius: t.radius,
      border: `1px solid ${active ? t.accent : t.line}`,
      background: active ? t.accentSoft + '40' : 'transparent',
      transition: 'background .15s, border-color .15s',
    }}>
      <div style={{
        font: `600 14px/1 ${t.ui}`, color: t.ink,
        padding: '8px 0', textAlign: 'left',
      }}>{fmt.label}</div>
      <div>
        <div style={{ font: `13px/1.2 ${t.ui}`, color: t.ink, marginBottom: 3 }}>
          {fmt.kind}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: `11.5px/1 ${t.mono}`, color: t.mute }}>
          <span>{fmt.size}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.good }}>
            {I.shield} virus‑scanned
          </span>
          {fmt.tag && <span style={{ color: t.accent }}>★ {fmt.tag}</span>}
        </div>
      </div>
      <div style={{ font: `12px/1 ${t.mono}`, color: t.mute }}>
        ~ {fmt.id.startsWith('mp3') ? '3s' : '12s'}
      </div>
      <Btn t={t} kind={fmt.tag ? 'primary' : 'soft'} size="sm" icon={I.dl}
        onClick={() => onDownload(fmt)}>Download</Btn>
    </div>
  );
}

function AdvancedTools({ t }) {
  return (
    <div style={{
      marginTop: 18, padding: 18,
      border: `1px dashed ${t.line2}`, borderRadius: t.radius,
      background: t.surface2 + '70',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
      }}>
        <div style={{ font: `600 13px/1 ${t.ui}`, color: t.ink, letterSpacing: '.02em' }}>
          Advanced tools
        </div>
        <div style={{ font: `11px/1 ${t.mono}`, color: t.mute, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Server‑side · FFmpeg
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Trim */}
        <div style={{
          padding: 14, borderRadius: t.radius, background: t.surface, border: `1px solid ${t.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: t.ink, font: `13px/1 ${t.ui}` }}>
            <span style={{ color: t.accent, display: 'flex' }}>{I.scissors}</span>
            <b style={{ fontWeight: 600 }}>Clip a segment</b>
          </div>
          {/* trim slider */}
          <div style={{ position: 'relative', height: 28, marginBottom: 8 }}>
            <div style={{
              position: 'absolute', inset: '12px 0', borderRadius: 999, background: t.surface2,
            }}/>
            <div style={{
              position: 'absolute', top: 12, bottom: 12, left: '20%', right: '32%',
              borderRadius: 999, background: t.accent,
            }}/>
            <div style={{ position: 'absolute', top: 4, left: 'calc(20% - 8px)', width: 16, height: 20, borderRadius: 6, background: t.surface, border: `1.5px solid ${t.accent}` }}/>
            <div style={{ position: 'absolute', top: 4, left: 'calc(68% - 8px)', width: 16, height: 20, borderRadius: 6, background: t.surface, border: `1.5px solid ${t.accent}` }}/>
          </div>
          <div style={{ display: 'flex', gap: 8, font: `12px/1 ${t.mono}`, color: t.ink2 }}>
            <span>00:56</span><span style={{ color: t.mute }}>→</span><span>03:08</span>
            <span style={{ marginLeft: 'auto', color: t.mute }}>2:12 clip</span>
          </div>
        </div>

        {/* MP3 bitrate */}
        <div style={{
          padding: 14, borderRadius: t.radius, background: t.surface, border: `1px solid ${t.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: t.ink, font: `13px/1 ${t.ui}` }}>
            <span style={{ color: t.accent, display: 'flex' }}>{I.sound}</span>
            <b style={{ fontWeight: 600 }}>MP3 bitrate</b>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['96', '128', '192', '256', '320'].map((b) => (
              <div key={b} style={{
                flex: 1, padding: '8px 0', textAlign: 'center',
                borderRadius: 8, border: `1px solid ${b === '320' ? t.accent : t.line}`,
                background: b === '320' ? t.accent : 'transparent',
                color: b === '320' ? t.accentInk : t.ink2,
                font: `12px/1 ${t.mono}`,
              }}>{b}<span style={{ opacity: 0.6, marginLeft: 2 }}>k</span></div>
            ))}
          </div>
        </div>

        {/* Convert format */}
        <div style={{
          padding: 14, borderRadius: t.radius, background: t.surface, border: `1px solid ${t.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: t.ink, font: `13px/1 ${t.ui}` }}>
            <span style={{ color: t.accent, display: 'flex' }}>{I.convert}</span>
            <b style={{ fontWeight: 600 }}>Convert format</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: `12px/1 ${t.ui}`, color: t.ink }}>
            <span style={{ padding: '6px 12px', borderRadius: 8, background: t.surface2, border: `1px solid ${t.line}`, font: `12px/1 ${t.mono}` }}>MP4</span>
            <span style={{ color: t.mute }}>→</span>
            <span style={{ padding: '6px 12px', borderRadius: 8, background: t.accentSoft, border: `1px solid ${t.accent}`, font: `12px/1 ${t.mono}`, color: t.accent }}>WebM</span>
            <span style={{ padding: '6px 12px', borderRadius: 8, background: 'transparent', border: `1px solid ${t.line}`, font: `12px/1 ${t.mono}`, color: t.mute }}>MOV</span>
          </div>
        </div>

        {/* QR send */}
        <div style={{
          padding: 14, borderRadius: t.radius, background: t.surface, border: `1px solid ${t.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: t.ink, font: `13px/1 ${t.ui}` }}>
            <span style={{ color: t.accent, display: 'flex' }}>{I.qr}</span>
            <b style={{ fontWeight: 600 }}>Send to phone</b>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: `1px solid ${t.line}` }}>
              <QRMark t={t} seed="downder-share" size={56}/>
            </div>
            <div style={{ font: `12px/1.4 ${t.ui}`, color: t.ink2 }}>
              Scan to pull the download<br/>onto a phone or tablet.<br/>
              <span style={{ color: t.mute, font: `11px/1.4 ${t.mono}` }}>Link expires in 10 min · end‑to‑end</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ t, advanced, onDownload, muted, setMuted, downloading, completed }) {
  return (
    <div style={cardStyle(t)}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 28 }}>
        <div>
          <VideoPreviewCard t={t} muted={muted} setMuted={setMuted} advanced={advanced} />
          <div style={{ marginTop: 16, font: `${t.displayWeight} 22px/1.25 ${t.display}`, fontStyle: t.displayItalic ? 'italic' : 'normal', color: t.ink, letterSpacing: '-.01em' }}>
            {VIDEO_META.title}
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, font: `12.5px/1 ${t.ui}`, color: t.ink2 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: t.surface2, border: `1px solid ${t.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: `10px/1 ${t.mono}`, color: t.ink }}>m</span>
            @{VIDEO_META.uploader}
            <span style={{ color: t.mute }}>·</span>
            <span style={{ color: t.mute }}>{VIDEO_META.views} views</span>
            <span style={{ color: t.mute }}>·</span>
            <span style={{ color: t.mute, font: `11.5px/1 ${t.mono}` }}>{VIDEO_META.url}</span>
          </div>
        </div>

        <div>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12,
          }}>
            <div style={{ font: `600 14px/1 ${t.ui}`, color: t.ink, letterSpacing: '.01em' }}>
              Pick a quality
            </div>
            <div style={{ font: `11px/1 ${t.mono}`, color: t.mute, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              6 formats · streamed to your device
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FORMATS.map((f) => (
              <FormatRow key={f.id} t={t} fmt={f} onDownload={onDownload} active={f.tag === 'recommended'} />
            ))}
          </div>

          {advanced && <AdvancedTools t={t} />}
        </div>
      </div>
    </div>
  );
}

// ─── Downloading state (in-row replacement on top row) ────────────────────
function DownloadingCard({ t, advanced, muted, setMuted, progress }) {
  return (
    <div style={cardStyle(t)}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 28 }}>
        <div>
          <VideoPreviewCard t={t} muted={muted} setMuted={setMuted} advanced={advanced} />
          <div style={{ marginTop: 16, font: `${t.displayWeight} 22px/1.25 ${t.display}`, fontStyle: t.displayItalic ? 'italic' : 'normal', color: t.ink }}>
            {VIDEO_META.title}
          </div>
        </div>
        <div>
          <div style={{ font: `11px/1 ${t.mono}`, color: t.mute, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Downloading · 1080p MP4
          </div>
          <div style={{
            padding: 22, borderRadius: t.radius, border: `1px solid ${t.line}`, background: t.surface,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ font: `${t.displayWeight} 36px/1 ${t.display}`, fontStyle: t.displayItalic ? 'italic' : 'normal', color: t.ink, letterSpacing: '-.02em' }}>
                {Math.round(progress * 100)}<span style={{ font: `400 20px/1 ${t.mono}`, color: t.mute, marginLeft: 4 }}>%</span>
              </div>
              <div style={{ display: 'flex', gap: 18, font: `12px/1 ${t.mono}`, color: t.ink2 }}>
                <div><span style={{ color: t.mute }}>speed </span>14.2 MB/s</div>
                <div><span style={{ color: t.mute }}>eta </span>00:08</div>
                <div><span style={{ color: t.mute }}>got </span>{Math.round(progress * 184)}/184 MB</div>
              </div>
            </div>
            <div style={{
              height: 8, borderRadius: 999, background: t.surface2, overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, width: `${progress * 100}%`,
                background: t.accent, borderRadius: 999,
                transition: 'width .15s linear',
              }}/>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, font: `11.5px/1 ${t.mono}`, color: t.mute, flexWrap: 'wrap' }}>
              <Pill t={t} tone="ghost">↯ 8 goroutines</Pill>
              <Pill t={t} tone="ghost">stream → disk</Pill>
              <Pill t={t} tone="ghost">{I.lock} TLS 1.3</Pill>
              <Pill t={t} tone="ghost">no copy in RAM</Pill>
            </div>
          </div>

          {/* Other rows greyed */}
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, opacity: 0.5 }}>
            {FORMATS.slice(1, 4).map((f) => (
              <FormatRow key={f.id} t={t} fmt={f} onDownload={() => {}} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Completed state ──────────────────────────────────────────────────────
function CompletedCard({ t, advanced, onAnother }) {
  return (
    <div style={cardStyle(t)}>
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 28 }}>
        <div>
          <ThumbPlaceholder t={t} label={`${VIDEO_META.uploader} · saved`}/>
          <div style={{ marginTop: 16, font: `${t.displayWeight} 22px/1.25 ${t.display}`, fontStyle: t.displayItalic ? 'italic' : 'normal', color: t.ink }}>
            {VIDEO_META.title}
          </div>
          <div style={{ marginTop: 8, font: `12px/1.4 ${t.mono}`, color: t.mute }}>
            saved to ~/Downloads/<br/>
            <span style={{ color: t.ink2 }}>lisbon-mornings-1080p.mp4</span>
          </div>
        </div>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px',
            borderRadius: 999, background: t.accentSoft, color: t.good,
            font: `12.5px/1 ${t.ui}`, marginBottom: 16,
          }}>
            <span style={{ display: 'inline-flex' }}>{I.check}</span>
            Downloaded · 184 MB in 12.4s
          </div>
          <div style={{ font: `${t.displayWeight} 32px/1.15 ${t.display}`, fontStyle: t.displayItalic ? 'italic' : 'normal', color: t.ink, letterSpacing: '-.015em', marginBottom: 14 }}>
            Yours, end‑to‑end.
          </div>
          <div style={{ font: `13.5px/1.5 ${t.ui}`, color: t.ink2, marginBottom: 18, maxWidth: 460 }}>
            The file streamed straight to your machine — nothing was logged, nothing was kept.
            Verify integrity with the SHA‑256 below, or scan the QR to pull the same file onto a phone.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                padding: 14, borderRadius: t.radius, border: `1px solid ${t.line}`, background: t.surface2 + '60',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: t.ink2, font: `11px/1 ${t.mono}`, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  <span style={{ color: t.good, display: 'flex' }}>{I.shield}</span> SHA‑256 · virus‑scanned
                </div>
                <div style={{ font: `12px/1.5 ${t.mono}`, color: t.ink, wordBreak: 'break-all' }}>
                  9f4ad2b6c071e8a3f1d5c89e2b14702a<br/>e3a1bd5f0c8769124aae3b8d76f0c213
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Btn t={t} kind="soft" size="sm">Open folder</Btn>
                <Btn t={t} kind="soft" size="sm">Copy hash</Btn>
                <Btn t={t} kind="ghost" size="sm" onClick={onAnother}>Grab another</Btn>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                padding: 8, borderRadius: t.radius, border: `1px solid ${t.line2}`,
                background: t.surface, display: 'inline-block',
              }}>
                <QRMark t={t} seed="downder-complete" size={120}/>
              </div>
              <div style={{ marginTop: 8, font: `11px/1.3 ${t.mono}`, color: t.mute, maxWidth: 130 }}>
                Scan to pull to phone
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────
function ErrorCard({ t, onRetry }) {
  return (
    <div style={{ ...cardStyle(t), display: 'flex', gap: 28, alignItems: 'flex-start' }}>
      <div style={{
        width: 64, height: 64, borderRadius: t.radius, flexShrink: 0,
        background: 'oklch(0.94 0.06 30)', color: 'oklch(0.50 0.15 30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2L12 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 10v5M12 17.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: `${t.displayWeight} 26px/1.2 ${t.display}`, fontStyle: t.displayItalic ? 'italic' : 'normal', color: t.ink, letterSpacing: '-.01em', marginBottom: 8 }}>
          Hmm — this one&rsquo;s shy.
        </div>
        <div style={{ font: `14px/1.55 ${t.ui}`, color: t.ink2, maxWidth: 540, marginBottom: 14 }}>
          The video at this link is private, taken down, or the platform is gating it
          behind a login. We don&rsquo;t touch protected content. Try a public link, or
          if you&rsquo;re sure the URL is right, give it another shot.
        </div>
        <div style={{
          padding: 12, borderRadius: t.radius,
          background: t.surface2 + '70', border: `1px dashed ${t.line2}`,
          font: `12px/1.5 ${t.mono}`, color: t.ink2, marginBottom: 16, maxWidth: 540,
        }}>
          <span style={{ color: t.mute }}>code </span><b style={{ color: t.ink }}>403 · private_video</b><br/>
          <span style={{ color: t.mute }}>url  </span>https://www.tiktok.com/@private_user/video/0000000000
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn t={t} kind="primary" size="md" onClick={onRetry}>Try a different link</Btn>
          <Btn t={t} kind="ghost" size="md">Report this URL</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer({ t }) {
  const items = [
    { label: 'Streamed, never cached', sub: 'Bytes flow straight from source to your disk.' },
    { label: 'Zero logs · zero accounts', sub: 'No URL, no IP, no email is ever stored.' },
    { label: 'Virus‑scanned on the fly', sub: 'Every file passes ClamAV before the final byte.' },
    { label: 'Built on Go', sub: 'Concurrent chunk fetching, FFmpeg muxing, served fast.' },
  ];
  return (
    <footer style={{
      padding: '24px 36px', borderTop: `1px solid ${t.line}`,
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
      background: t.surface2 + '40',
    }}>
      {items.map((i) => (
        <div key={i.label}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            font: `600 12.5px/1 ${t.ui}`, color: t.ink, marginBottom: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, display: 'inline-block' }}/>
            {i.label}
          </div>
          <div style={{ font: `12px/1.5 ${t.ui}`, color: t.ink2 }}>{i.sub}</div>
        </div>
      ))}
    </footer>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────
// crisp or calm
function DownDerApp({ themeKey = 'crisp', dark = false, advanced = true }) {
  const t = resolveTheme(themeKey, dark);
  const [state, setState] = useState('idle');
  const [url, setUrl] = useState('');
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0.36);

  // auto-advance loading → result
  useEffect(() => {
    if (state === 'loading') {
      if (!url) setUrl('https://www.tiktok.com/@maya.films/video/7387264829017');
      const id = setTimeout(() => setState('result'), 1400);
      return () => clearTimeout(id);
    }
    if (state === 'downloading') {
      setProgress(0.08);
      const id = setInterval(() => {
        setProgress((p) => {
          const nxt = p + 0.04;
          if (nxt >= 1) { clearInterval(id); setTimeout(() => setState('completed'), 500); return 1; }
          return nxt;
        });
      }, 220);
      return () => clearInterval(id);
    }
  }, [state]);

  // when entering result-ish states, ensure url is filled
  useEffect(() => {
    if ((state === 'result' || state === 'downloading' || state === 'completed') && !url) {
      setUrl('https://www.tiktok.com/@maya.films/video/7387264829017');
    }
  }, [state]);

  const onDownload = (fmt) => setState('downloading');
  const onAnother = () => { setUrl(''); setState('idle'); };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: t.bg, color: t.ink,
      fontFamily: t.ui, overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <Header t={t}/>
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 48,
      }}>
        <Hero t={t} state={state} setState={setState} url={url} setUrl={setUrl} advanced={advanced} />
        <div style={{ padding: '12px 36px 24px' }}>
          {state === 'loading' && <LoadingCard t={t} />}
          {state === 'result' && <ResultCard t={t} advanced={advanced} muted={muted} setMuted={setMuted} onDownload={onDownload} />}
          {state === 'downloading' && <DownloadingCard t={t} advanced={advanced} muted={muted} setMuted={setMuted} progress={progress} />}
          {state === 'completed' && <CompletedCard t={t} advanced={advanced} onAnother={onAnother} />}
          {state === 'error' && <ErrorCard t={t} onRetry={() => setState('idle')} />}
        </div>
        <Footer t={t}/>
      </div>
      <StateRail t={t} state={state} setState={(s) => {
        if (s === 'downloading') setProgress(0.36);
        setState(s);
      }} />
    </div>
  );
}

export default DownDerApp;