import { z } from 'zod';

export const themeConfigSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    surface: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
  typography: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
  }),
  buttons: z.object({
    radius: z.string(),
  }),
  animation: z.object({
    intensity: z.enum(['low', 'medium', 'high']),
  }),
});

export const updateThemeSchema = z.object({
  themeOverrides: z.record(z.unknown()),
});

export type ThemeConfigInput = z.infer<typeof themeConfigSchema>;
