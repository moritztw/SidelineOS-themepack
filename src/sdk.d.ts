declare module '@sidelineos/plugin-sdk' {
  import type { ComponentType, ReactNode } from 'react';

  export type UnterstuetzteSprache = 'de' | 'en';
  export type SprachPaket = Record<string, string>;
  export type SprachWoerterbuecher = {
    de: SprachPaket;
  } & Partial<Record<UnterstuetzteSprache, SprachPaket>>;

  export type TeamRolle = 'TEAM_ADMIN' | 'COACH' | 'PLAYER';
  export type SpielerUnit = 'OFFENSE' | 'DEFENSE' | 'SPECIAL_TEAMS';
  export type PluginId = string;
  export type CoreBereich =
    | 'hub'
    | 'settings-hub'
    | 'modul'
    | 'settings'
    | 'team-settings'
    | 'sysadmin';

  export type AppRouteModus =
    | { art: 'app' }
    | { art: 'login' }
    | { art: 'invite'; token: string }
    | { art: 'share'; token: string };

  export interface ProfilCustomFeld {
    key: string;
    label: string;
    typ: 'text' | 'number' | 'select';
    pflicht?: boolean;
    optionen?: string[];
  }

  export interface BenutzerKonto {
    uuid: string;
    benutzername: string;
    vollerName: string;
    email: string;
    telefon?: string;
    trikotNummer?: string;
    position?: string;
    istSysadmin: boolean;
    erstelltAm: string;
    preferredLocale?: UnterstuetzteSprache;
    preferredTheme?: string;
    customProfilWerte: Record<string, string>;
  }

  export interface S3Konfiguration {
    endpoint: string;
    region: string;
    bucket: string;
    accessKey: string;
    forcePathStyle: boolean;
    cleanupRetentionDays?: number;
    hatSecretKey?: boolean;
    konfiguriert?: boolean;
  }

  export interface TeamKontext {
    id: string;
    name: string;
    kurzname: string;
    aktiveSaison: string;
    saisons: string[];
    primaerFarbe?: string;
    aktivierteModule: PluginId[];
    customProfilFelder: ProfilCustomFeld[];
  }

  export interface BrandKonfiguration {
    produktName: string;
    coreName: string;
    kurzName: string;
    sdkScope: '@sidelineos/plugin-sdk';
    paketFormat: 'sideline-plugin-v1';
  }

  export type SidelineCssToken =
    | '--sl-color-scheme'
    | '--sl-bg-canvas'
    | '--sl-bg-topbar'
    | '--sl-bg-surface'
    | '--sl-bg-elevated'
    | '--sl-border'
    | '--sl-border-strong'
    | '--sl-text-heading'
    | '--sl-text-primary'
    | '--sl-text-muted'
    | '--sl-text-subtle'
    | '--sl-accent'
    | '--sl-accent-hover'
    | '--sl-accent-contrast'
    | '--sl-danger'
    | '--sl-danger-text'
    | '--sl-success'
    | '--sl-success-text'
    | '--sl-warning-text';

  export interface SidelineCssTokenDefinition {
    cssVar: `--sl-${string}`;
    tailwindColor?: string;
    defaultValue: string;
    beschreibung: string;
  }

  export interface TeamAkzentTokens {
    '--sl-accent': string;
    '--sl-accent-hover': string;
    '--sl-accent-contrast': '#0B0E11' | '#FFFFFF';
  }

  export interface PluginThemePreset {
    id: string;
    name: string;
    beschreibung?: string;
    colorScheme: 'dark' | 'light';
    tokens: Partial<Record<SidelineCssToken, string>>;
    overrideTeamAccent?: boolean;
  }

  export interface VerfuegbaresThemeEintrag {
    themeRef: string;
    pluginId: string | null;
    pluginName: string | null;
    preset: PluginThemePreset;
  }

  export interface AufgeloestesThemeErgebnis {
    themeRef: string;
    quelle: 'user' | 'instance' | 'core';
    pluginId: string | null;
    pluginName: string | null;
    preset: PluginThemePreset;
  }

  export type GeparsteThemeRef =
    | { typ: 'core' }
    | { typ: 'plugin'; pluginId: string; themeId: string };

  export type PluginPermission =
    | 'team:read'
    | 'team:roster-read'
    | 's3:team-rw'
    | 's3:cleanup-queue'
    | 'db:plugin-tables'
    | 'share:public-links'
    | 'notifications:send'
    | 'notifications:channel';

  export type PluginIconName =
    | 'film'
    | 'book-open'
    | 'clipboard-check'
    | 'layers'
    | 'puzzle';

  export interface PluginSettingsAnker {
    id: string;
    label: string;
    badge?: number;
  }

  export interface PluginManifest {
    id: PluginId;
    name: string;
    kurzbeschreibung: string;
    version: string;
    sdkVersion: '1.0' | (string & {});
    minCoreVersion?: string;
    maxCoreVersion?: string;
    autor: string;
    repositoryUrl: string;
    icon: PluginIconName;
    status: 'AKTIV' | 'VORSCHAU';
    standardAktiviert: boolean;
    hideHubTile?: boolean;
    permissions: PluginPermission[];
    dbPrefix: string;
    s3Prefix?: string;
    settingsAnker: {
      user?: PluginSettingsAnker[];
      team?: PluginSettingsAnker[];
      sysadmin?: PluginSettingsAnker[];
    };
    themes?: PluginThemePreset[];
  }

  export interface PluginTab {
    id: string;
    label: string;
  }

  export interface PluginLaufzeitKontext {
    team: TeamKontext;
    aktiveTeamAnsicht: TeamRolle;
    gewaehlteSaison: string;
    benutzer: BenutzerKonto;
    locale: string;
    aktuellerTab: string;
    onTabWechseln: (tabId: string) => void;
    onTeamSettingsOeffnen: () => void;
    onZurueckZurStartseite: () => void;
    onPublicShareOeffnen?: (token: string) => void;
  }

  export interface PluginSettingsKontext {
    team: TeamKontext;
    benutzer: BenutzerKonto;
    aktiveTeamAnsicht: TeamRolle | null;
    s3Konfig: S3Konfiguration;
    locale: string;
  }

  export interface PluginProviderKontext {
    pluginId: PluginId;
    team: TeamKontext | null;
    aktiveTeamAnsicht: TeamRolle | null;
    gewaehlteSaison: string | null;
    benutzer: BenutzerKonto | null;
    locale: string;
    bereich: CoreBereich;
    routeArt: AppRouteModus['art'];
    istGlobalAktiv: boolean;
    istFuerAktivesTeamAktiv: boolean;
  }

  export interface PluginProviderProps {
    children: ReactNode;
    ctx?: PluginProviderKontext;
  }

  export interface S3MultipartPartRef {
    partNumber: number;
    etag: string;
  }

  export interface PluginS3Scope {
    readonly prefix: string;
    getSignedUploadUrl(params: {
      objectPath: string;
      contentType?: string;
      fileSizeBytes?: number;
      expiresInSeconds?: number;
    }): Promise<{ url: string; key: string; expiresIn: number }>;
    getSignedDownloadUrl(params: {
      objectPath: string;
      expiresInSeconds?: number;
    }): Promise<{ url: string; key: string; expiresIn: number }>;
    initiateMultipartUpload(params: {
      objectPath: string;
      contentType?: string;
      fileSizeBytes?: number;
    }): Promise<{ uploadId: string; key: string; maxFileSizeBytes: number }>;
    getSignedMultipartPartUrl(params: {
      objectPath: string;
      uploadId: string;
      partNumber: number;
      expiresInSeconds?: number;
    }): Promise<{ url: string; key: string; partNumber: number; expiresIn: number }>;
    completeMultipartUpload(params: {
      objectPath: string;
      uploadId: string;
      parts: S3MultipartPartRef[];
    }): Promise<{ key: string; etag?: string; location?: string }>;
    abortMultipartUpload(params: { objectPath: string; uploadId: string }): Promise<void>;
    deleteObject(objectPath: string): Promise<void>;
  }

  export interface SidelinePlugin {
    manifest: PluginManifest;
    Provider?: ComponentType<PluginProviderProps>;
    defaultTab?: string;
    getTabs?: (ctx: { teamRolle: TeamRolle; locale?: string }) => PluginTab[];
    PrimaerAktion?: ComponentType<{ ctx: PluginLaufzeitKontext; className: string }>;
    renderMainView?: (ctx: PluginLaufzeitKontext) => ReactNode;
    renderPublicShareView?: (ctx: {
      token: string;
      locale?: string;
      onSchliessen: () => void;
    }) => ReactNode;
    settingsPanels?: {
      user?: ComponentType<{ ctx: PluginSettingsKontext }>;
      team?: ComponentType<{ ctx: PluginSettingsKontext }>;
      sysadmin?: ComponentType<{ ctx: PluginSettingsKontext }>;
    };
    themes?: readonly PluginThemePreset[];
  }

  export const SIDELINE_CSS_TOKENS: Record<string, SidelineCssTokenDefinition>;
  export const SIDELINE_STANDARD_THEME_TOKENS: Record<SidelineCssToken, string>;
  export const CORE_STANDARD_THEME_PRESET: PluginThemePreset;
  export const STANDARD_THEME_REF: string;

  export function holeAktuelleBrandKonfig(explizitName?: string): BrandKonfiguration;
  export function teileWortmarke(produktName: string): { basis: string; akzent: string };
  export function uebersetzeSchluessel(
    woerterbuecher: SprachWoerterbuecher,
    sprache: string | undefined,
    schluessel: string,
    variablen?: Record<string, string | number | undefined>
  ): string;
  export function createPluginTranslator(
    woerterbuecher: SprachWoerterbuecher,
    locale?: string
  ): (schluessel: string, variablen?: Record<string, string | number | undefined>) => string;
  export function normalisiereHexFarbe(raw?: string): string | null;
  export function berechneRelativeLuminanz(hex: string): number;
  export function ermittleKontrastTextFarbe(hex: string): '#0B0E11' | '#FFFFFF';
  export function ermittleHoverAkzentFarbe(hex: string): string;
  export function ermittleTeamAkzentTokens(primaerFarbe?: string): TeamAkzentTokens | null;
  export function validiereThemeSlug(raw: unknown): string | null;
  export function bauePluginThemeRef(pluginId: string, themeId: string): string;
  export function parseThemeRef(raw: unknown): GeparsteThemeRef | null;
  export function validiereThemeTokenWert(token: string, rawWert: unknown): string | null;
  export function bereinigePluginThemePresets(raw: unknown): PluginThemePreset[];
  export function sammleVerfuegbareThemes(
    quellen: ReadonlyArray<{
      pluginId: string;
      pluginName: string;
      themes?: readonly PluginThemePreset[];
    }>
  ): VerfuegbaresThemeEintrag[];
  export function loeseAktivesThemeAuf(optionen: {
    userPreferredTheme?: string | null;
    instanceDefaultTheme?: string | null;
    verfuegbareThemes: readonly VerfuegbaresThemeEintrag[];
  }): AufgeloestesThemeErgebnis;
}
