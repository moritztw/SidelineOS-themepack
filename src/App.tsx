import { useEffect, useState } from 'react';
import type { PluginSettingsKontext, PluginThemePreset } from '@sidelineos/plugin-sdk';
import {
  CORE_STANDARD_THEME_PRESET,
  SIDELINE_STANDARD_THEME_TOKENS,
  berechneRelativeLuminanz,
  ermittleTeamAkzentTokens,
} from './dev/sdkShim.ts';
import themePlugin from './client.tsx';

const PREVIEW_TEAM_COLORS = [
  { label: 'Core Amber (#F59E0B)', hex: '#F59E0B' },
  { label: 'Team Blue (#2563EB)', hex: '#2563EB' },
  { label: 'Turf Green (#16A34A)', hex: '#16A34A' },
  { label: 'Crimson (#DC2626)', hex: '#DC2626' },
];

function kontrastVerhaeltnis(hexA: string, hexB: string): string {
  const l1 = berechneRelativeLuminanz(hexA);
  const l2 = berechneRelativeLuminanz(hexB);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return `${ratio.toFixed(2)}:1`;
}

export default function App() {
  const presets = themePlugin.themes ?? [];
  const [selectedId, setSelectedId] = useState<string>(presets[0]?.id ?? 'default');
  const [teamAccent, setTeamAccent] = useState<string>('#2563EB');

  const activePreset: PluginThemePreset =
    presets.find((p) => p.id === selectedId) ?? CORE_STANDARD_THEME_PRESET;

  const mergedTokens: Record<string, string> = {
    ...SIDELINE_STANDARD_THEME_TOKENS,
    ...activePreset.tokens,
  };

  if (!activePreset.overrideTeamAccent && selectedId !== 'default') {
    const teamTokens = ermittleTeamAkzentTokens(teamAccent);
    if (teamTokens) {
      Object.assign(mergedTokens, teamTokens);
    }
  }

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(activePreset.colorScheme);
    for (const [token, value] of Object.entries(mergedTokens)) {
      root.style.setProperty(token, value);
    }
  }, [activePreset, mergedTokens]);

  const settingsCtx: PluginSettingsKontext = {
    team: {
      id: 'team-preview',
      name: 'Munich Mavericks',
      kurzname: 'MMV',
      aktiveSaison: '2026',
      saisons: ['2026', '2025'],
      primaerFarbe: teamAccent,
      aktivierteModule: ['themepack'],
      customProfilFelder: [],
    },
    benutzer: {
      uuid: 'dev-user-1',
      benutzername: 'coach',
      vollerName: 'Coach Preview',
      email: 'coach@example.org',
      istSysadmin: true,
      erstelltAm: '2026-01-01T00:00:00Z',
      preferredLocale: 'de',
      customProfilWerte: {},
    },
    aktiveTeamAnsicht: 'TEAM_ADMIN',
    s3Konfig: {
      endpoint: '',
      region: '',
      bucket: '',
      accessKey: '',
      forcePathStyle: true,
    },
    locale: 'de',
  };

  const SettingsPanel = themePlugin.settingsPanels?.user;

  return (
    <div className="min-h-screen bg-sl-canvas text-sl-primary">
      <header className="sticky top-0 z-20 border-b border-sl-border bg-sl-topbar px-6 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold text-sl-heading">
              Sideline<span className="text-sl-accent">OS</span>
            </span>
            <span className="text-sl-border-strong">/</span>
            <span className="text-xs font-medium text-sl-muted">
              ThemePack Studio
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-sl-muted">
              <span>Theme</span>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="rounded border border-sl-border bg-sl-surface px-2.5 py-1 text-xs font-medium text-sl-heading focus:border-sl-accent focus:outline-none"
              >
                <option value="default">SidelineOS Standard (Dark)</option>
                {presets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-xs text-sl-muted">
              <span>Team-Akzent</span>
              <select
                value={teamAccent}
                onChange={(e) => setTeamAccent(e.target.value)}
                className="rounded border border-sl-border bg-sl-surface px-2.5 py-1 text-xs font-medium text-sl-heading focus:border-sl-accent focus:outline-none"
              >
                {PREVIEW_TEAM_COLORS.map((c) => (
                  <option key={c.hex} value={c.hex}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-6">
        <section className="space-y-4 rounded-lg border border-sl-border bg-sl-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-base font-semibold text-sl-heading">
                {activePreset.name}
              </h1>
              <p className="text-xs text-sl-muted">
                {activePreset.beschreibung ?? 'Core Standard-Erscheinungsbild'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-sl-border bg-sl-elevated px-3 py-1.5 text-xs font-medium text-sl-primary transition-colors hover:border-sl-border-strong"
              >
                Sekundär
              </button>
              <button
                type="button"
                className="rounded-md bg-sl-accent px-3.5 py-1.5 text-xs font-semibold text-sl-accent-contrast transition-colors hover:bg-sl-accent-hover"
              >
                Primär-Aktion
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-sl-border pt-3 text-xs sm:grid-cols-4">
            <div className="rounded border border-sl-border bg-sl-canvas px-3 py-2">
              <div className="text-sl-subtle">Heading / Surface</div>
              <div className="font-mono font-semibold text-sl-heading">
                {kontrastVerhaeltnis(
                  mergedTokens['--sl-text-heading'],
                  mergedTokens['--sl-bg-surface']
                )}
              </div>
            </div>
            <div className="rounded border border-sl-border bg-sl-canvas px-3 py-2">
              <div className="text-sl-subtle">Muted / Canvas</div>
              <div className="font-mono font-semibold text-sl-primary">
                {kontrastVerhaeltnis(
                  mergedTokens['--sl-text-muted'],
                  mergedTokens['--sl-bg-canvas']
                )}
              </div>
            </div>
            <div className="rounded border border-sl-border bg-sl-canvas px-3 py-2">
              <div className="text-sl-subtle">Accent Button</div>
              <div className="font-mono font-semibold text-sl-primary">
                {kontrastVerhaeltnis(
                  mergedTokens['--sl-accent-contrast'],
                  mergedTokens['--sl-accent']
                )}
              </div>
            </div>
            <div className="rounded border border-sl-border bg-sl-canvas px-3 py-2">
              <div className="text-sl-subtle">Status-Kontrast</div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-sl-success-text">OK</span>
                <span className="text-sl-warning-text">Warn</span>
                <span className="text-sl-danger-text">Err</span>
              </div>
            </div>
          </div>
        </section>

        {SettingsPanel && <SettingsPanel ctx={settingsCtx} />}
      </main>
    </div>
  );
}
