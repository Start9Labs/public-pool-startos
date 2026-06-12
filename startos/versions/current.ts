import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const current = VersionInfo.of({
  version: '0.2.5:17',
  releaseNotes: {
    en_US:
      'Pinned the Public Pool UI to its pre-overhaul version; the latest upstream UI is incompatible with the current backend.',
    es_ES:
      'Se fijó la interfaz de Public Pool a su versión previa a la reestructuración; la última interfaz upstream es incompatible con el backend actual.',
    de_DE:
      'Die Public-Pool-Oberfläche wurde auf die Version vor der Überarbeitung festgelegt; die neueste Upstream-Oberfläche ist mit dem aktuellen Backend nicht kompatibel.',
    pl_PL:
      'Przypięto interfejs Public Pool do wersji sprzed przebudowy; najnowszy interfejs upstream jest niezgodny z obecnym backendem.',
    fr_FR:
      "Interface de Public Pool figée sur sa version d'avant la refonte ; la dernière interface upstream est incompatible avec le backend actuel.",
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
