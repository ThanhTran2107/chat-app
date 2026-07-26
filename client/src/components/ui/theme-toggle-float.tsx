import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/use-theme-store';

export function ThemeToggleFloat() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className="fixed right-10 bottom-15 z-50 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-950 shadow-xl shadow-slate-900/10 transition hover:bg-slate-100 focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/95 dark:text-white dark:hover:bg-slate-900/80"
    >
      {isDark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
    </button>
  );
}
