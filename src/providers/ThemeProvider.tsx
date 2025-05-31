import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Theme } from '../types';
import { STORAGE_KEYS } from '../constants';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  contrast: boolean;
  setContrast: (enabled: boolean) => void;
  reducedMotion: boolean;
  error: Error | null;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  contrast: false,
  setContrast: () => {},
  reducedMotion: false,
  error: null
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Theme state
  const {
    value: theme,
    setValue: setTheme,
    error: themeError
  } = useLocalStorage<Theme>(
    STORAGE_KEYS.THEME,
    'system'
  );

  const {
    value: contrast,
    setValue: setContrast,
    error: contrastError
  } = useLocalStorage(
    STORAGE_KEYS.CONTRAST,
    false
  );

  // Media queries
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.setAttribute('data-contrast', contrast ? 'high' : 'normal');
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
    
    // Update meta theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        isDark ? 'rgb(15, 23, 42)' : 'rgb(255, 255, 255)'
      );
    }
  }, [theme, contrast, prefersDark, reducedMotion]);

  const value = {
    theme,
    setTheme,
    contrast,
    setContrast,
    reducedMotion,
    error: themeError || contrastError
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}