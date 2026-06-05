import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const current = VersionInfo.of({
  version: '0.2.5:9',
  releaseNotes: {
    en_US:
      'Update Public Pool to the latest upstream (NestJS 11, SQLite improvements, stratum fixes); build on Node 22.',
    es_ES:
      'Actualización de Public Pool a la última versión upstream (NestJS 11, mejoras de SQLite, correcciones de stratum); compilación en Node 22.',
    de_DE:
      'Aktualisierung von Public Pool auf den neuesten Upstream-Stand (NestJS 11, SQLite-Verbesserungen, Stratum-Korrekturen); Build mit Node 22.',
    pl_PL:
      'Aktualizacja Public Pool do najnowszej wersji upstream (NestJS 11, ulepszenia SQLite, poprawki stratum); kompilacja na Node 22.',
    fr_FR:
      'Mise à jour de Public Pool vers la dernière version upstream (NestJS 11, améliorations SQLite, corrections stratum) ; compilation sous Node 22.',
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
