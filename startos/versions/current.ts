import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const current = VersionInfo.of({
  version: '0.2.5:10',
  releaseNotes: {
    en_US:
      'Update the Public Pool UI to the latest upstream (runtime configuration support).',
    es_ES:
      'Actualización de la interfaz de Public Pool a la última versión upstream (compatibilidad con configuración en tiempo de ejecución).',
    de_DE:
      'Aktualisierung der Public-Pool-Oberfläche auf den neuesten Upstream-Stand (Unterstützung für Laufzeitkonfiguration).',
    pl_PL:
      'Aktualizacja interfejsu Public Pool do najnowszej wersji upstream (obsługa konfiguracji w czasie działania).',
    fr_FR:
      "Mise à jour de l'interface de Public Pool vers la dernière version upstream (prise en charge de la configuration à l'exécution).",
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
