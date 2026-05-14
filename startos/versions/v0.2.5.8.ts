import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const v_0_2_5_8 = VersionInfo.of({
  version: '0.2.5:8',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 1.5.1)',
    es_ES: 'Actualizaciones internas (start-sdk 1.5.1)',
    de_DE: 'Interne Aktualisierungen (start-sdk 1.5.1)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 1.5.1)',
    fr_FR: 'Mises à jour internes (start-sdk 1.5.1)',
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
