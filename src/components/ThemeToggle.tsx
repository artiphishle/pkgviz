'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const active = theme === 'system' ? resolvedTheme : theme;
  const isDark = active === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
      className="rounded-lg px-3 py-2 border border-blue-400 dark:border-blue-600 text-xs cursor-pointer"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
