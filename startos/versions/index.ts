import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_2_5_18 } from './v0.2.5_18'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_2_5_18],
})
