import { sdk } from './sdk'
import { otherConfig } from 'bitcoind-startos/startos/actions/config/other'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', otherConfig, 'critical', {
    input: { kind: 'partial', value: { zmqEnabled: true } },
    reason: 'Must enable ZMQ in Bitcoin to use it with Public Pool',
    when: { condition: 'input-not-matches', once: false },
  })

  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=28.3:0-beta.0',
      healthChecks: ['bitcoind'],
    },
  }
})
