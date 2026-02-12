import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { envFile } from '../../file-models/env'
import { readFile, rm } from 'fs/promises'
import {
  envDefaults,
  getStratumIpv4Address,
  mainnet,
  testnet,
} from '../../utils'
import { store } from '../../file-models/store.json'

export const v_0_2_5_2_b0 = VersionInfo.of({
  version: '0.2.5:2-beta.0',
  releaseNotes: 'Updated README, workflows, and docs URL.',
  migrations: {
    up: async ({ effects }) => {
      // 0.3.5.1 migration
      const configYaml = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined) as
        | {
            'pool-identifier': string
            bitcoind: {
              type: 'mainnet' | 'testnet'
            }
          }
        | undefined

      if (configYaml) {
        const POOL_IDENTIFIER =
          configYaml['pool-identifier'] ?? 'Public-Pool'
        const type = configYaml.bitcoind?.type ?? 'mainnet'

        const ipv4Address = await getStratumIpv4Address(effects)

        await Promise.all([
          envFile.write(effects, {
            ...envDefaults,
            ...(type === 'mainnet' ? mainnet : testnet),
            POOL_IDENTIFIER,
          }),
          store.merge(effects, { stratumDisplayAddress: ipv4Address }),
        ])

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
