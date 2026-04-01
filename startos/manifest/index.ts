import { setupManifest } from '@start9labs/start-sdk'
import { short, long, bitcoindDescription } from './i18n'

export const manifest = setupManifest({
  id: 'public-pool',
  title: 'Public Pool',
  license: 'GPL',
  packageRepo:
    'https://github.com/Start9Labs/public-pool-startos',
  upstreamRepo: 'https://github.com/benjamin-wilson/public-pool',
  marketingUrl: 'https://web.public-pool.io',
  donationUrl: 'https://web.public-pool.io',
  docsUrls: ['https://github.com/benjamin-wilson/public-pool#readme'],
  description: { short, long },
  volumes: ['main'],
  images: {
    'public-pool': {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoindDescription,
      optional: false,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoind-startos/refs/heads/master/icon.svg',
      },
    },
  },
})
