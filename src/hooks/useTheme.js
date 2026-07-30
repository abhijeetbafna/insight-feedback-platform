/**
 * InSight — Custom Hook for Dark / Light Theme Switching
 */

import { useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'insight_theme_preference';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
      return 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      // Ignore storage errors in restricted iframe environments
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme
  };
}
