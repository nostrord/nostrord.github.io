(function() {
  const THEME_KEY = 'nostrord-theme';
  const themes = ['system', 'light', 'dark'];

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'system') {
      root.setAttribute('data-theme', getSystemTheme());
      root.setAttribute('data-theme-mode', 'system');
    } else {
      root.setAttribute('data-theme', theme);
      root.setAttribute('data-theme-mode', theme);
    }
  }

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || 'system';
  }

  function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  function cycleTheme() {
    const current = getSavedTheme();
    const nextIndex = (themes.indexOf(current) + 1) % themes.length;
    const next = themes[nextIndex];
    saveTheme(next);
    applyTheme(next);
    updateToggleIcon(next);
  }

  function updateToggleIcon(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const labels = {
      'system': 'Theme: System (click to change)',
      'light': 'Theme: Light (click to change)',
      'dark': 'Theme: Dark (click to change)'
    };
    toggle.setAttribute('title', labels[theme]);
    toggle.setAttribute('aria-label', labels[theme]);
    toggle.setAttribute('data-theme', theme);
  }

  // Initial setup
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getSavedTheme() === 'system') {
      applyTheme('system');
    }
  });

  // Setup toggle button when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', cycleTheme);
      updateToggleIcon(savedTheme);
    }
  });
})();
