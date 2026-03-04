import { store } from '../file-models/store.json'
import { sdk } from '../sdk'

export const setStratumDisplayAddress = sdk.setupOnInit(async (effects) => {
  const stratumDisplayAddress = await sdk.serviceInterface
    .getOwn(
      effects,
      'stratum',
      (iface) =>
        iface?.addressInfo
          ?.filter({
            visibility: 'private',
            kind: 'ipv4',
          })
          ?.format()[0],
    )
    .const()

  await store.merge(effects, { stratumDisplayAddress })
})
