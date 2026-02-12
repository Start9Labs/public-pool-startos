import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'public-pool',
  title: 'Public Pool',
  license: 'GPL',
  wrapperRepo: 'https://github.com/Start9Labs/public-pool-startos',
  upstreamRepo: 'https://github.com/benjamin-wilson/public-pool',
  supportSite: 'https://github.com/benjamin-wilson/public-pool/issues',
  docsUrl: 'https://github.com/benjamin-wilson/public-pool#readme',
  marketingSite: 'https://web.public-pool.io',
  donationUrl: 'https://web.public-pool.io',
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
      description: 'Used to subscribe to new block events',
      optional: true,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
    'bitcoind-testnet': {
      description: 'Used to subscribe to new block events',
      optional: true,
      metadata: {
        title: 'A Bitcoin Full Node',
        // @TODO replace with testnet when available
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})
