import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'public-pool',
  title: 'Public Pool',
  license: 'GPL',
  wrapperRepo: 'https://github.com/remcoros/public-pool-startos',
  upstreamRepo: 'https://github.com/benjamin-wilson/public-pool',
  supportSite: 'https://github.com/benjamin-wilson/public-pool/issues',
  docsUrl:
    'https://github.com/remcoros/public-pool-startos/blob/main/instructions.md',
  marketingSite: 'https://web.public-pool.io',
  donationUrl: 'https://web.public-pool.io',
  description: {
    short: 'Open source Bitcoin mining pool.',
    long: 'Open source Bitcoin mining pool.',
  },
  volumes: ['main'],
  images: {
    'public-pool': {
      source: {
        dockerBuild: {},
      },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
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
