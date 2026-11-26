import type {
  PluginThemePreset,
  SidelineCssToken,
  SprachWoerterbuecher,
  TeamAkzentTokens,
} from '@sidelineos/plugin-sdk';

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

export function normalisiereHexFarbe(raw?: string): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  const shortMatch = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(trimmed);
  if (shortMatch) {
    const [, r, g, b] = shortMatch;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

export function berechneRelativeLuminanz(hex: string): number {
  const norm = normalisiereHexFarbe(hex) ?? '#000000';
  const kanal = (idx: number) => {
    const val = Number.parseInt(norm.slice(idx, idx + 2), 16) / 255;
    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * kanal(1) + 0.7152 * kanal(3) + 0.0722 * kanal(5);
}

export function ermittleKontrastTextFarbe(hex: string): '#0B0E11' | '#FFFFFF' {
  const lum = berechneRelativeLuminanz(hex);
  const kontrastDunkel = (lum + 0.05) / (berechneRelativeLuminanz('#0B0E11') + 0.05);
  const kontrastHell = (1 + 0.05) / (lum + 0.05);
  return kontrastDunkel >= kontrastHell ? '#0B0E11' : '#FFFFFF';
}

export function ermittleHoverAkzentFarbe(hex: string): string {
  const norm = normalisiereHexFarbe(hex) ?? '#F59E0B';
  const r = Number.parseInt(norm.slice(1, 3), 16);
  const g = Number.parseInt(norm.slice(3, 5), 16);
  const b = Number.parseInt(norm.slice(5, 7), 16);
  const mix = (c: number) =>
    Math.min(255, Math.round(c + (255 - c) * 0.16))
      .toString(16)
      .padStart(2, '0');
  return `#${mix(r)}${mix(g)}${mix(b)}`.toUpperCase();
}

export function ermittleTeamAkzentTokens(primaerFarbe?: string): TeamAkzentTokens | null {
  const hex = normalisiereHexFarbe(primaerFarbe);
  if (!hex) return null;
  return {
    '--sl-accent': hex,
    '--sl-accent-hover': ermittleHoverAkzentFarbe(hex),
    '--sl-accent-contrast': ermittleKontrastTextFarbe(hex),
  };
}

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
