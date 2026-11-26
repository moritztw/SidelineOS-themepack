import type { PluginThemePreset } from '@sidelineos/plugin-sdk';
import manifest from '../../plugin.manifest.json';

/**
 * Verbindliche Liste der vom ThemePack bereitgestellten Theme-Presets.
 * Quelle ist `plugin.manifest.json`, sodass Store, Backend und Pre-Auth-Boot
 * die Presets ohne Laden des Client-Bundles lesen können.
 */
export const THEMEPACK_PRESETS: readonly PluginThemePreset[] =
  manifest.themes as PluginThemePreset[];
