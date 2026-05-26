import { Sun, Moon } from "lucide-react";

export default function ToggleTheme({ t, themeName, setThemeName } : 
    { t: any, themeName : string, setThemeName: any } ) {
    
    const isLight = themeName === 'light';

    return (
        <button 
            onClick={() => setThemeName(isLight ? 'dark' : 'light')}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 999,
                height: '32px', 
                width: '72px',
                background: t.ink,
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                padding: 0, // Reset padding to control alignment manually
                overflow: 'hidden',
                transition: 'background 0.3s ease'
            }}
        > 
            {/* 1. The Sliding Pill */}
            <div 
                style={{
                    position: 'absolute',
                    top: '3px', // Centering vertically (32px height - 26px div) / 2
                    left: isLight ? '3px' : 'calc(100% - 37px)', 
                    width: '34px',
                    height: '26px',
                    background: 'rgba(255, 255, 255, 0.25)', // Tinted look from your image
                    borderRadius: 999,
                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    zIndex: 1
                }}
            />
            
            {/* 2. The Icons (Fixed positions) */}
            <div style={{ 
                position: 'absolute',
                left: '12px',
                zIndex: 2, 
                display: 'flex', 
                transition: 'color 0.3s',
                color: isLight ? '#fff' : '#64748b' 
            }}>
                <Sun size={16} strokeWidth={2.5} />
            </div>

            <div style={{ 
                position: 'absolute',
                right: '12px',
                zIndex: 2, 
                display: 'flex', 
                transition: 'color 0.3s',
                color: !isLight ? '#fff' : '#64748b' 
            }}>
                <Moon size={16} strokeWidth={2.5} />
            </div>
        </button>
    );
}