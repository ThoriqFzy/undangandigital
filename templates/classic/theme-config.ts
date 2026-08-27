/**
 * CLASSIC TEMPLATE — Default Theme Values
 * 
 * These are the fallback values. 
 * Actual values come from the themes table in DB.
 * Theme overrides from invitation.themeOverrides take highest priority.
 */

import type { ThemeConfig } from "../../shared/types/invitation";

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
 * Convert a DB-backed ThemeConfig (from themes.config JSONB) into CSS custom
 * properties. Missing fields fall back to the classic defaults so partial configs
 * still render correctly.
 */
export function themeConfigToCSSVars(theme: Partial<ThemeConfig> | undefined | null): Record<string, string> {
  const base = defaultClassicTheme;
  const c = (theme?.colors ?? {}) as Record<string, string>;
  const t = (theme?.typography ?? {}) as Record<string, string>;
  const b = (theme?.buttons ?? {}) as Record<string, string>;

  const primary = c.primary || base.colors.primary;
  const secondary = c.secondary || base.colors.secondary;
  const background = c.background || base.colors.background;
  const surface = c.surface || base.colors.surface;
  const text = c.text || base.colors.text;
  const accent = c.accent || secondary;

  return {
    "--color-primary": primary,
    "--color-primary-soft": c.primarySoft || secondary,
    "--color-primary-dark": c.primaryDark || primary,
    "--color-secondary": secondary,
    "--color-accent": accent,
    "--color-accent-soft": c.accentSoft || surface,
    "--color-background": background,
    "--color-surface": surface,
    "--color-surface-soft": c.surfaceSoft || surface,
    "--color-text": text,
    "--color-text-muted": c.textMuted || base.colors.textMuted,
    "--color-text-light": c.textLight || base.colors.textLight,
    "--color-border": c.border || base.colors.border,
    "--color-border-soft": c.borderSoft || base.colors.borderSoft,
    "--font-display": t.display || base.typography.display,
    "--font-heading": t.heading || base.typography.heading,
    "--font-body": t.body || base.typography.body,
    "--font-accent": t.accent || base.typography.accent,
    "--radius-card": base.radius.card,
    "--radius-button": b.radius || base.radius.button,
    "--radius-image": base.radius.image,
  };
}
