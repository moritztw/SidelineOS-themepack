import { useEffect, useState } from 'react';
import type { PluginSettingsKontext, PluginThemePreset } from '@sidelineos/plugin-sdk';
import { CORE_STANDARD_THEME_PRESET, SIDELINE_STANDARD_THEME_TOKENS } from './dev/sdkShim.ts';
import themePlugin from './client.tsx';

const PREVIEW_TEAM_COLORS = [
  { label: 'Core Amber', hex: '#F59E0B' },
  { label: 'Team Blue', hex: '#2563EB' },
  { label: 'Turf Green', hex: '#16A34A' },
  { label: 'Crimson', hex: '#DC2626' },
];

export default function App() {
  const presets = themePlugin.themes ?? [];
  const [selectedId, setSelectedId] = useState<string>(presets[0]?.id ?? 'default');
  const [teamAccent, setTeamAccent] = useState<string>('#2563EB');

  const activePreset: PluginThemePreset =
    presets.find((p) => p.id === selectedId) ?? CORE_STANDARD_THEME_PRESET;

  useEffect(() => {
    const root = document.documentElement;
    const merged: Record<string, string> = {
      ...SIDELINE_STANDARD_THEME_TOKENS,
      ...activePreset.tokens,
    };

    if (!activePreset.overrideTeamAccent && selectedId !== 'default') {
      merged['--sl-accent'] = teamAccent;
      merged['--sl-accent-hover'] = teamAccent;
      merged['--sl-accent-contrast'] = '#FFFFFF';
    }

    root.classList.remove('dark', 'light');
    root.classList.add(activePreset.colorScheme);
    for (const [token, value] of Object.entries(merged)) {
      root.style.setProperty(token, value);
    }
  }, [activePreset, selectedId, teamAccent]);

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
              ThemePack Studio (Phase 0 Preview)
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
        <section className="rounded-lg border border-sl-border bg-sl-surface p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-base font-semibold text-sl-heading">
                {activePreset.name}
              </h1>
              <p className="text-xs text-sl-muted">
                {activePreset.beschreibung ?? 'Core Standard-Erscheinungsbild'}
              </p>
            </div>
            <button
              type="button"
              className="rounded-md bg-sl-accent px-3.5 py-1.5 text-xs font-semibold text-sl-accent-contrast transition-colors hover:bg-sl-accent-hover"
            >
              Beispiel-Aktion
            </button>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="text-sl-success-text">Status: Gültige Token-Konfiguration</span>
            <span className="text-sl-warning-text">Hinweis: Phase 0 Grundgerüst</span>
            <span className="text-sl-danger-text">Fehler-Kontrast-Check</span>
          </div>
        </section>

        {SettingsPanel && <SettingsPanel ctx={settingsCtx} />}
      </main>
    </div>
  );
}
