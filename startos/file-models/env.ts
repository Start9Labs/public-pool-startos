import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  BITCOIN_RPC_TIMEOUT: z.literal('10000').catch('10000'),
  API_PORT: z.literal('3334').catch('3334'),
  STRATUM_PORT: z.literal('3333').catch('3333'),
  API_SECURE: z.literal('false').catch('false'),
  POOL_IDENTIFIER: z.string().catch('Public-Pool on StartOS'),
  // Bitcoin's address is dynamic and resolved over the bridge — main.ts writes
  // these when bitcoind is reachable, so they stay absent until it resolves.
  BITCOIN_RPC_URL: z.string().optional().catch(undefined),
  BITCOIN_RPC_PORT: z.string().optional().catch(undefined),
  BITCOIN_RPC_COOKIEFILE: z
    .literal('/mnt/bitcoind/.cookie')
    .catch('/mnt/bitcoind/.cookie'),
  BITCOIN_ZMQ_HOST: z.string().optional().catch(undefined),
  NETWORK: z.literal('mainnet').catch('mainnet'),
})

export type EnvType = z.infer<typeof shape>

export const envFile = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '.env',
  },
  shape,
)
