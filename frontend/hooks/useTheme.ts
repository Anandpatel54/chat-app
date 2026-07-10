'use client';

import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isDark = resolvedTheme === 'dark';

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    toggleTheme,
    isDark,
  };
};
