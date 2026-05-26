export default function Pill({ t, children, tone = 'neutral', style } : 
    { t : any, children : React.ReactNode, tone : string, style? : React.CSSProperties}) {
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
      background: tones?.bg, color: tones?.fg,
      border: `1px solid ${tones?.bd}`,
      font: `11px/1 ${t.ui}`, letterSpacing: '.005em',
      ...style,
    }}>{children}</span>
  );
}