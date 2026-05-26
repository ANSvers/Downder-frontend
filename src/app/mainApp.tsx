"use client"

import Header from "@/components/layout/Header";
import { useState } from "react";

const THEMES = {
    light: {
        bg:        '#f6f7f9', surface:   '#ffffff', surface2:  '#eef0f3',
        line:      'rgba(15,23,40,0.08)', line2:     'rgba(15,23,40,0.16)',
        ink:       '#0e1620', ink2:      '#3d4654', mute:      '#7a8492',
        accent:    'oklch(0.60 0.13 165)', accentInk: '#ffffff',
        accentSoft:'oklch(0.94 0.04 165)',
        good:      'oklch(0.60 0.13 165)',
        radius:    10,
        radiusLg:  14,
        display:   '"Geist", ui-sans-serif, system-ui, sans-serif',
        ui:        '"Geist", ui-sans-serif, system-ui, sans-serif',
        mono:      '"Geist Mono", ui-monospace, monospace',
        displayWeight: 600,
        displayItalic: false,
    },
    dark: {
        bg: '#0d1117', surface: '#141a22', surface2: '#1c232d',
        line: 'rgba(200,220,255,0.08)', line2: 'rgba(200,220,255,0.18)',
        ink: '#e7eef7', ink2: '#9aa6b6', mute: '#6a7585',
        accent: 'oklch(0.72 0.14 165)', accentInk: '#06140d',
        accentSoft: 'oklch(0.28 0.05 165)',
        good:      'oklch(0.60 0.13 165)',
        radius:    10,
        radiusLg:  14,
        display:   '"Geist", ui-sans-serif, system-ui, sans-serif',
        ui:        '"Geist", ui-sans-serif, system-ui, sans-serif',
        mono:      '"Geist Mono", ui-monospace, monospace',
        displayWeight: 600,
        displayItalic: false,
    },
};

export default function MainApp() {

    const [themeName, setThemeName] = useState<"light" | "dark">("dark")
    const t = THEMES[themeName];

    return <div style={{
            position: 'absolute', inset: 0, background: t.bg, color: t.ink,
            fontFamily: t.ui, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
        <Header t={t} themeName={themeName} setThemeName={setThemeName}/>
    </div>
}