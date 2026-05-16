import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const v_0_2_5_9 = VersionInfo.of({
  version: '0.2.5:9',
  releaseNotes: {
    en_US: 'Bumps start-sdk to 1.5.2.',
    es_ES: 'Actualiza start-sdk a 1.5.2.',
    de_DE: 'Aktualisiert start-sdk auf 1.5.2.',
    pl_PL: 'Aktualizuje start-sdk do 1.5.2.',
    fr_FR: 'Met à jour start-sdk vers 1.5.2.',
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
