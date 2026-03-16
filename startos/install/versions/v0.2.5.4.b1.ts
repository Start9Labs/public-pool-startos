import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { storeJson } from 'bitcoind-startos/startos/fileModels/store.json'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../../file-models/env'

export const v_0_2_5_4_b1 = VersionInfo.of({
  version: '0.2.5:4-beta.1',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.60',
    es_ES: 'Actualización a StartOS SDK beta.60',
    de_DE: 'Update auf StartOS SDK beta.60',
    pl_PL: 'Aktualizacja do StartOS SDK beta.60',
    fr_FR: 'Mise à jour vers StartOS SDK beta.60',
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
        await storeJson.merge(effects, {})

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
