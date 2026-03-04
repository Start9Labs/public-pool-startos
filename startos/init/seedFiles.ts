import { envFile } from '../file-models/env'
import { store } from '../file-models/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await envFile.merge(effects, {})
  await store.merge(effects, {})
})
