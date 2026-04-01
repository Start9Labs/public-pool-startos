import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const BITCOIN_RPC_HOST = 'bitcoind.startos'

const shape = z.object({
  BITCOIN_RPC_TIMEOUT: z.literal('10000').catch('10000'),
  API_PORT: z.literal('3334').catch('3334'),
  STRATUM_PORT: z.literal('3333').catch('3333'),
  API_SECURE: z.literal('false').catch('false'),
  POOL_IDENTIFIER: z.string().catch('Public-Pool'),
  BITCOIN_RPC_URL: z
    .literal(`http://${BITCOIN_RPC_HOST}`)
    .catch(`http://${BITCOIN_RPC_HOST}`),
  BITCOIN_RPC_PORT: z.literal('8332').catch('8332'),
  BITCOIN_RPC_COOKIEFILE: z
    .literal('/mnt/bitcoind/.cookie')
    .catch('/mnt/bitcoind/.cookie'),
  BITCOIN_ZMQ_HOST: z
    .literal(`tcp://${BITCOIN_RPC_HOST}:28332`)
    .catch(`tcp://${BITCOIN_RPC_HOST}:28332`),
})

export type EnvType = z.infer<typeof shape>

export const envFile = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '.env',
  },
  shape,
)
