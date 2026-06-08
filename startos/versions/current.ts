import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const current = VersionInfo.of({
  version: '0.2.5:12',
  releaseNotes: {
    en_US: `Updated the Public Pool UI to the latest upstream.

- Hashrate chart tooltips now show accepted shares, credited difficulty, and average time to block.
- Hashrate charts now use a 1-hour average and improved number formatting.

Full changes: https://github.com/benjamin-wilson/public-pool-ui/compare/5f730f4...6542500`,
    es_ES: `Se actualizó la interfaz de Public Pool a la última versión upstream.

- Las descripciones emergentes del gráfico de hashrate ahora muestran las acciones aceptadas, la dificultad acreditada y el tiempo medio hasta el bloque.
- Los gráficos de hashrate ahora usan un promedio de 1 hora y un mejor formato numérico.

Cambios completos: https://github.com/benjamin-wilson/public-pool-ui/compare/5f730f4...6542500`,
    de_DE: `Die Public-Pool-Oberfläche wurde auf den neuesten Upstream-Stand aktualisiert.

- Die Tooltips des Hashrate-Diagramms zeigen jetzt akzeptierte Shares, gutgeschriebene Difficulty und die durchschnittliche Zeit bis zum Block an.
- Hashrate-Diagramme verwenden jetzt einen 1-Stunden-Durchschnitt und eine verbesserte Zahlenformatierung.

Vollständige Änderungen: https://github.com/benjamin-wilson/public-pool-ui/compare/5f730f4...6542500`,
    pl_PL: `Zaktualizowano interfejs Public Pool do najnowszej wersji upstream.

- Dymki wykresu hashrate pokazują teraz zaakceptowane udziały, przypisaną trudność oraz średni czas do bloku.
- Wykresy hashrate używają teraz średniej 1-godzinnej i ulepszonego formatowania liczb.

Pełne zmiany: https://github.com/benjamin-wilson/public-pool-ui/compare/5f730f4...6542500`,
    fr_FR: `Mise à jour de l'interface de Public Pool vers la dernière version upstream.

- Les info-bulles du graphique de hashrate affichent désormais les parts acceptées, la difficulté créditée et le temps moyen jusqu'au bloc.
- Les graphiques de hashrate utilisent désormais une moyenne sur 1 heure et un meilleur formatage des nombres.

Modifications complètes : https://github.com/benjamin-wilson/public-pool-ui/compare/5f730f4...6542500`,
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
