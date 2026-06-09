import { sdk } from './sdk'
import { uiPort, stratumPort } from './utils'

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

  // Stratum — plain TCP on 3333, with StartOS-terminated TLS on 4333.
  // secure: { ssl: false } keeps the plain port exposed on regular (non-"secure")
  // LAN gateways; with secure: null the OS would expose only the TLS port there.
  const stratumMultiOrigin = await multiHost.bindPort(stratumPort, {
    protocol: null,
    addSsl: {
      preferredExternalPort: 4333,
      alpn: null,
      addXForwardedHeaders: false,
      auth: null,
    },
    preferredExternalPort: stratumPort,
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
