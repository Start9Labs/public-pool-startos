import { autoconfig } from 'bitcoind-startos/startos/actions/config/autoconfig'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
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
