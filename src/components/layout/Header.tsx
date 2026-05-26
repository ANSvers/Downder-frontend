import Pill from "../ui/pill";
import { Sun, Moon } from "lucide-react"
import ToggleTheme from "../ui/toggleTheme";

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

export default function Header({ t, themeName, setThemeName } : 
    { t: any, themeName : string, setThemeName: any } ) {
    return <header
        style = {{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '22px 36px', borderBottom: `1px solid ${t.line}`,
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            {/* <Pill t={t} tone="good"><span style={{ color: t.good }}>{I.shield}</span> Zero‑logs</Pill> */}
            <ToggleTheme t={t} themeName={themeName} setThemeName={setThemeName}/>
        </nav>
    </header>
}