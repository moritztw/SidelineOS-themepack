import type {
  PluginSettingsKontext,
  SidelinePlugin,
  SprachWoerterbuecher,
} from '@sidelineos/plugin-sdk';
import { uebersetzeSchluessel } from '@sidelineos/plugin-sdk';
import { Palette } from 'lucide-react';
import manifest from '../plugin.manifest.json';
import { THEMEPACK_PRESETS } from './themes/presets.ts';

const WOERTERBUCH: SprachWoerterbuecher = {
  de: {
    heading: 'ThemePack Katalog',
    subtitle:
      'Enthaltene Themes stehen direkt oben in den Konto- bzw. Instanz-Theme-Einstellungen zur Auswahl bereit.',
    modeLight: 'Hell',
    modeDark: 'Dunkel',
    accentTeam: 'Team-Akzent aktiv',
    accentFixed: 'Eigener Akzent',
    countLabel: 'Presets geladen',
  },
  en: {
    heading: 'ThemePack Catalog',
    subtitle:
      'Included themes are available directly in the account and instance theme selectors above.',
    modeLight: 'Light',
    modeDark: 'Dark',
    accentTeam: 'Follows team accent',
    accentFixed: 'Fixed preset accent',
    countLabel: 'Presets loaded',
  },
};

function ThemePackSettingsPanel({ ctx }: { ctx: PluginSettingsKontext }) {
  const t = (key: string) => uebersetzeSchluessel(WOERTERBUCH, ctx.locale, key);

  return (
    <section
      id="themepack-katalog"
      className="scroll-mt-20 space-y-4 rounded-lg border border-sl-border bg-sl-surface p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sl-border pb-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-sl-accent" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-sl-heading">{t('heading')}</h2>
            <p className="text-xs text-sl-muted">{t('subtitle')}</p>
          </div>
        </div>
        <span className="font-mono text-[11px] text-sl-subtle">
          {THEMEPACK_PRESETS.length} {t('countLabel')} · v{manifest.version}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEMEPACK_PRESETS.map((preset) => {
          const canvas = preset.tokens['--sl-bg-canvas'] ?? '#0B0E11';
          const surface = preset.tokens['--sl-bg-surface'] ?? '#13171D';
          const border = preset.tokens['--sl-border'] ?? '#232933';
          const heading = preset.tokens['--sl-text-heading'] ?? '#FFFFFF';
          const muted = preset.tokens['--sl-text-muted'] ?? '#8B949E';
          const accent = preset.tokens['--sl-accent'] ?? '#F59E0B';

          return (
            <article
              key={preset.id}
              className="flex flex-col justify-between gap-3 rounded-lg border border-sl-border bg-sl-canvas p-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-sl-heading">{preset.name}</h3>
                  <span className="rounded border border-sl-border bg-sl-surface px-2 py-0.5 font-mono text-[10px] text-sl-muted">
                    {preset.colorScheme === 'light' ? t('modeLight') : t('modeDark')}
                  </span>
                </div>
                {preset.beschreibung && (
                  <p className="text-xs leading-relaxed text-sl-muted">{preset.beschreibung}</p>
                )}
              </div>

              {/* Mini-UI-Farbvorschau direkt mit den Preset-Hexwerten */}
              <div
                className="space-y-2 rounded-md border p-2.5"
                style={{ backgroundColor: canvas, borderColor: border }}
              >
                <div
                  className="flex items-center justify-between rounded border px-2.5 py-1.5"
                  style={{ backgroundColor: surface, borderColor: border }}
                >
                  <span className="text-[11px] font-semibold" style={{ color: heading }}>
                    SidelineOS
                  </span>
                  <span
                    className="h-2.5 w-6 rounded-sm"
                    style={{ backgroundColor: accent }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center justify-between px-1 text-[10px]" style={{ color: muted }}>
                  <span className="font-mono">{preset.id}</span>
                  <span>
                    {preset.overrideTeamAccent ? t('accentFixed') : t('accentTeam')}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const plugin: SidelinePlugin = {
  manifest: manifest as SidelinePlugin['manifest'],
  themes: THEMEPACK_PRESETS,
  settingsPanels: {
    user: ThemePackSettingsPanel,
    sysadmin: ThemePackSettingsPanel,
  },
};

export default plugin;
