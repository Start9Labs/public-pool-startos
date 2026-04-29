import { VersionGraph } from '@start9labs/start-sdk'
import { v_0_2_5_6 } from './v0.2.5.6'
import { v_0_2_5_7 } from './v0.2.5.7'

export const versionGraph = VersionGraph.of({
  current: v_0_2_5_7,
  other: [v_0_2_5_6],
})
