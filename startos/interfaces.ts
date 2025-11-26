import { sdk } from './sdk'
import { envDefaults, uiPort } from './utils'

const STRATUM_PORT = Number(envDefaults.STRATUM_PORT)

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Use a single MultiHost for both UI and Stratum, so they can share the same (sub)domain
  const multiHost = sdk.MultiHost.of(effects, 'main')

  // UI
  const uiMultiOrigin = await multiHost.bindPort(uiPort, {
    protocol: 'http',
  })
  const ui = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'ui',
    description: 'Personal web user interface for Public Pool',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const uiReceipt = await uiMultiOrigin.export([ui])

  // Stratum
  const stratumMultiOrigin = await multiHost.bindPort(STRATUM_PORT, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: STRATUM_PORT,
    secure: { ssl: false },
  })
  const stratum = sdk.createInterface(effects, {
    name: 'Stratum Server',
    id: 'stratum',
    description: 'Your Stratum server',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const stratumReceipt = await stratumMultiOrigin.export([stratum])

  return [uiReceipt, stratumReceipt]
})
