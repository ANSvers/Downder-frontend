# Downder Frontend Structure
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Global layout (Providers, Global state)
│   │   ├── page.tsx       # Main Downloader Page (Hero + Input)
│   │   └── globals.css    # Tailwind styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx # Brand header with Light/Dark & Tweaks toggle
│   │   │   └── Footer.tsx
│   │   ├── downloader/
│   │   │   ├── InputBar.tsx     # URL box, auto-paste, validation
│   │   │   ├── ResultCard.tsx   # Wrapper for phase 3 (shows up post-fetch)
│   │   │   ├── VideoPlayer.tsx  # HTML5 custom preview (Mute, playback speed)
│   │   │   ├── OptionsTable.tsx # Grid/Rows of qualities & Download buttons
│   │   │   └── TweaksPanel.tsx  # Trimmer inputs, format & bitrate selectors
│   │   └── ui/
│   │       ├── button.tsx       # Reusable components (e.g., from Shadcn)
│   │       ├── input.tsx
│   │       └── progress.tsx     # Virus scan status / download progress bar
│   ├── hooks/
│   │   ├── useLocalStorage.ts   # For storing Light/Dark & Advanced view state
│   │   └── useVideoFetch.ts     # Custom hook managing API states (idle, loading, success, error)
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces matching backend models
│   └── utils/
│       └── api.ts         # Axios/Fetch client configuration pointing to Backend
├── tailwind.config.js
├── tsconfig.json
└── package.json