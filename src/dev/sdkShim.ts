import type { PluginThemePreset, SidelineCssToken, SprachWoerterbuecher } from '@sidelineos/plugin-sdk';

export const SIDELINE_STANDARD_THEME_TOKENS: Record<SidelineCssToken, string> = {
  '--sl-color-scheme': 'dark',
  '--sl-bg-canvas': '#0B0E11',
  '--sl-bg-topbar': '#0F1318',
  '--sl-bg-surface': '#13171D',
  '--sl-bg-elevated': '#1E2530',
  '--sl-border': '#232933',
  '--sl-border-strong': '#36404F',
  '--sl-text-heading': '#FFFFFF',
  '--sl-text-primary': '#E6EDF3',
  '--sl-text-muted': '#8B949E',
  '--sl-text-subtle': '#6E7681',
  '--sl-accent': '#F59E0B',
  '--sl-accent-hover': '#FBBF24',
  '--sl-accent-contrast': '#0B0E11',
  '--sl-danger': '#DC2626',
  '--sl-danger-text': '#FCA5A5',
  '--sl-success': '#16A34A',
  '--sl-success-text': '#86EFAC',
  '--sl-warning-text': '#FDE68A',
};

export const CORE_STANDARD_THEME_PRESET: PluginThemePreset = {
  id: 'default',
  name: 'SidelineOS Standard (Dark)',
  colorScheme: 'dark',
  tokens: { ...SIDELINE_STANDARD_THEME_TOKENS },
};

export function uebersetzeSchluessel(
  woerterbuecher: SprachWoerterbuecher,
  sprache: string | undefined,
  schluessel: string,
  variablen?: Record<string, string | number | undefined>
): string {
  const code = sprache?.startsWith('en') ? 'en' : 'de';
  const basis = woerterbuecher[code]?.[schluessel] ?? woerterbuecher.de[schluessel] ?? schluessel;
  if (!variablen) return basis;
  return basis.replace(/\{([a-zA-Z0-9_]+)\}/g, (_m, k) => String(variablen[k] ?? ''));
}
