# SidelineOS-themepack

Theme-Pack-Plugin für [SidelineOS-Core](https://github.com/moritztw/SidelineOS-core) auf Basis von `@sidelineos/plugin-sdk` (`1.0`).

Stellt kuratierte Gestaltungs-Themes (Light, Outdoor & Editorial) direkt über die deklarative Theme-API (`manifest.themes`) und `hideHubTile: true` bereit.

## Entwicklung

```bash
npm install --legacy-peer-deps
npm run lint
npm test
npm run pack:plugin
```

Lokale Vorschau im Browser (Port 3000):

```bash
npm run dev
```

## Release-Artefakte (`sideline-plugin-v1`)

Beim Erstellen eines Git-Tags `v*` erzeugt GitHub Actions automatisch:
- `sideline-plugin-v1.tar.gz` (`plugin.manifest.json` + `dist/client.js`)
- `sideline-plugin-v1.tar.gz.sha256`
- `plugin.manifest.json`
