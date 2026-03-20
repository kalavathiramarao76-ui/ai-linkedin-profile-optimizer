'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('profileai-theme') as Theme | null;
    const initial = stored || 'dark';
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);

    // Listen for system theme changes when in system mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const current = localStorage.getItem('profileai-theme') as Theme | null;
      if (current === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const cycle = () => {
    const order: Theme[] = ['dark', 'light', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    localStorage.setItem('profileai-theme', next);
    applyTheme(next);
  };

  if (!mounted) return null;

  const icon =
    theme === 'dark' ? <Moon className="h-4 w-4" /> :
    theme === 'light' ? <Sun className="h-4 w-4" /> :
    <Monitor className="h-4 w-4" />;

  const label =
    theme === 'dark' ? 'Dark' :
    theme === 'light' ? 'Light' :
    'System';

  return (
    <button
      onClick={cycle}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-zinc-200 dark:hover:text-zinc-200 hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 transition-all"
      title={`Theme: ${label}`}
    >
      {icon}
      <span>{label} Mode</span>
    </button>
  );
}
