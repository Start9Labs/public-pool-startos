import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const current = VersionInfo.of({
  version: '0.2.5:13',
  releaseNotes: {
    en_US: `Updated the Public Pool UI to the latest upstream.

- Redesigned mining dashboard, worker, and connection screens.
- The connection screen now lists multiple stratum endpoints (V1, V1 + TLS, V2) with one-click copy.

Full changes: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    es_ES: `Se actualizó la interfaz de Public Pool a la última versión upstream.

- Se rediseñaron las pantallas de panel de minería, trabajadores y conexión.
- La pantalla de conexión ahora muestra varios puntos de conexión stratum (V1, V1 + TLS, V2) con copia en un clic.

Cambios completos: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    de_DE: `Die Public-Pool-Oberfläche wurde auf den neuesten Upstream-Stand aktualisiert.

- Mining-Dashboard, Worker- und Verbindungsbildschirme wurden neu gestaltet.
- Der Verbindungsbildschirm listet jetzt mehrere Stratum-Endpunkte (V1, V1 + TLS, V2) mit Kopieren per Klick auf.

Vollständige Änderungen: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    pl_PL: `Zaktualizowano interfejs Public Pool do najnowszej wersji upstream.

- Przeprojektowano ekrany panelu kopania, pracowników i połączenia.
- Ekran połączenia pokazuje teraz wiele punktów końcowych stratum (V1, V1 + TLS, V2) z kopiowaniem jednym kliknięciem.

Pełne zmiany: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    fr_FR: `Mise à jour de l'interface de Public Pool vers la dernière version upstream.

- Refonte des écrans du tableau de bord de minage, des workers et de la connexion.
- L'écran de connexion répertorie désormais plusieurs points de terminaison stratum (V1, V1 + TLS, V2) avec copie en un clic.

Modifications complètes : https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
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
