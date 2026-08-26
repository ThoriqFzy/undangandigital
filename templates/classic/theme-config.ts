/**
 * CLASSIC TEMPLATE — Default Theme Values
 * 
 * These are the fallback values. 
 * Actual values come from the themes table in DB.
 * Theme overrides from invitation.themeOverrides take highest priority.
 */

export interface ClassicThemeConfig {
  colors: {
    primary: string;
    primarySoft: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    accentSoft: string;
    background: string;
    surface: string;
    surfaceSoft: string;
    text: string;
    textMuted: string;
    textLight: string;
    border: string;
    borderSoft: string;
  };
  typography: {
    display: string;
    heading: string;
    body: string;
    accent: string;
  };
  spacing: {
    sectionPadding: string;
    cardPadding: string;
    containerMaxWidth: string;
  };
  radius: {
    card: string;
    button: string;
    image: string;
  };
  animation: {
    intensity: 'low' | 'medium' | 'high';
    duration: string;
  };
}

export const defaultClassicTheme: ClassicThemeConfig = {
  colors: {
    primary: '#4A6FA5',
    primarySoft: '#8BA8D0',
    primaryDark: '#2C4A7C',
    secondary: '#8BA8D0',
    accent: '#C8A96E',
    accentSoft: '#E2D4B6',
    background: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceSoft: '#F5F0EA',
    text: '#2D2926',
    textMuted: '#7A7572',
    textLight: '#A8A3A0',
    border: '#E8E2DC',
    borderSoft: '#F0EBE6',
  },
  typography: {
    display: "'Playfair Display', 'Georgia', serif",
    heading: "'Cormorant Garamond', 'Georgia', serif",
    body: "'Inter', 'Helvetica Neue', sans-serif",
    accent: "'Great Vibes', cursive",
  },
  spacing: {
    sectionPadding: '3rem 1.25rem',
    cardPadding: '1.5rem',
    containerMaxWidth: '480px',
  },
  radius: {
    card: '1rem',
    button: '9999px',
    image: '1rem',
  },
  animation: {
    intensity: 'medium',
    duration: '0.5s',
  },
};

/**
 * Convert theme config to CSS custom properties string.
 * Injected as inline style on the invitation shell.
 */
export function themeToCSSVars(theme: Partial<ClassicThemeConfig>): Record<string, string> {
  const base = defaultClassicTheme;
  const t = { ...base, ...theme };

  return {
    '--color-primary': t.colors.primary,
    '--color-primary-soft': t.colors.primarySoft,
    '--color-primary-dark': t.colors.primaryDark,
    '--color-secondary': t.colors.secondary,
    '--color-accent': t.colors.accent,
    '--color-accent-soft': t.colors.accentSoft,
    '--color-background': t.colors.background,
    '--color-surface': t.colors.surface,
    '--color-surface-soft': t.colors.surfaceSoft,
    '--color-text': t.colors.text,
    '--color-text-muted': t.colors.textMuted,
    '--color-text-light': t.colors.textLight,
    '--color-border': t.colors.border,
    '--color-border-soft': t.colors.borderSoft,
    '--font-display': t.typography.display,
    '--font-heading': t.typography.heading,
    '--font-body': t.typography.body,
    '--font-accent': t.typography.accent,
    '--radius-card': t.radius.card,
    '--radius-button': t.radius.button,
    '--radius-image': t.radius.image,
  };
}
