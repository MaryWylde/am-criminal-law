import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import yerevan from './assets/yerevan.jpg';
import yerevanDither from './assets/yerevan-dither.png';
import flag from './assets/flag.jpg';

export type Theme = 'gta' | 'regular';

const STORAGE_KEY = 'cc-theme';
const DEFAULT_THEME: Theme = 'gta';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeState | null>(null);

function isTheme(v: unknown): v is Theme {
  return v === 'regular' || v === 'gta';
}

/** `?theme=regular` in the URL wins (shareable), then the stored choice. */
function readInitial(): Theme {
  const fromUrl = new URLSearchParams(window.location.search).get('theme');
  if (isTheme(fromUrl)) return fromUrl;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isTheme(v) ? v : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** Owns the `data-theme` attribute on <html>. All colour/font decisions live
 *  in CSS variables keyed off that attribute (see index.css); components never
 *  branch on the theme except for purely structural extras. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    // The skyline is a hashed Vite asset, so its URL is handed to CSS here.
    root.style.setProperty('--stage-image', `url(${yerevan})`);
    root.style.setProperty('--stage-image-dither', `url(${yerevanDither})`);
    // The article hero carries the flag (full colour in both skins).
    root.style.setProperty('--hero-image', `url(${flag})`);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode etc. — theme simply won't persist */
    }
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, setTheme: setThemeState }}>{children}</Ctx.Provider>
  );
}

export function useTheme(): ThemeState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
