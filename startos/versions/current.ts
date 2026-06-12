import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const current = VersionInfo.of({
  version: '0.2.5:16',
  releaseNotes: {
    en_US: `Updated the Public Pool UI to the latest upstream.

- Removed affiliate links from the UI.
- Tidied up the dashboard tables and the share display.

Full changes: https://github.com/benjamin-wilson/public-pool-ui/compare/aaab760...0778deb`,
    es_ES: `Se actualizó la interfaz de Public Pool a la última versión upstream.

- Se eliminaron los enlaces de afiliados de la interfaz.
- Se ordenaron las tablas del panel y la visualización de shares.

Cambios completos: https://github.com/benjamin-wilson/public-pool-ui/compare/aaab760...0778deb`,
    de_DE: `Die Public-Pool-Oberfläche wurde auf den neuesten Upstream-Stand aktualisiert.

- Affiliate-Links wurden aus der Oberfläche entfernt.
- Die Dashboard-Tabellen und die Share-Anzeige wurden aufgeräumt.

Vollständige Änderungen: https://github.com/benjamin-wilson/public-pool-ui/compare/aaab760...0778deb`,
    pl_PL: `Zaktualizowano interfejs Public Pool do najnowszej wersji upstream.

- Usunięto linki afiliacyjne z interfejsu.
- Uporządkowano tabele panelu i wyświetlanie udziałów (shares).

Pełne zmiany: https://github.com/benjamin-wilson/public-pool-ui/compare/aaab760...0778deb`,
    fr_FR: `Mise à jour de l'interface de Public Pool vers la dernière version upstream.

- Suppression des liens d'affiliation de l'interface.
- Nettoyage des tableaux du tableau de bord et de l'affichage des parts (shares).

Modifications complètes : https://github.com/benjamin-wilson/public-pool-ui/compare/aaab760...0778deb`,
  },
  migrations: {
    up: async ({ effects }) => {
      const configYaml:
        | {
            'pool-identifier': string
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        const POOL_IDENTIFIER = configYaml['pool-identifier'] ?? 'Public-Pool'

        await envFile.merge(effects, { POOL_IDENTIFIER })

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
