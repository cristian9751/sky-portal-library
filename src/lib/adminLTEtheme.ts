const KEY = 'adminlte-theme';

export type ThemeMode = 'light' | 'dark' | 'auto';

function resolve(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function setTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage can be unavailable; the theme still applies for this page view */
  }
  document.documentElement.setAttribute('data-bs-theme', resolve(theme));
}

export function applyStoredTheme() {
  let stored: ThemeMode = 'auto';
  try {
    const savedTheme = localStorage.getItem(KEY);
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto') {
      stored = savedTheme;
    }
  } catch {
    /* ignore */
  }
  document.documentElement.setAttribute('data-bs-theme', resolve(stored));
}
