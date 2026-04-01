import { sdk } from './sdk'
import { FileHelper } from '@start9labs/start-sdk'
import { bitcoindMountpoint, stratumPort, uiPort } from './utils'
import { store } from './file-models/store.json'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Public Pool!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  // ** Stratum subcontainer **
  const stratumSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'public-pool' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: 'mainnet',
        mountpoint: '/public-pool/DB',
        readonly: false,
      })
      .mountVolume({
        volumeId: 'main',
        subpath: '.env',
        mountpoint: '/public-pool/.env',
        readonly: true,
        type: 'file',
      })
      .mountDependency({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: bitcoindMountpoint,
        readonly: true,
      }),
    'stratum',
  )

  await FileHelper.string(`${stratumSub.rootfs}${bitcoindMountpoint}/.cookie`)
    .read()
    .const(effects)

  // ** UI subcontainer **
  const uiSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'public-pool' },
    null,
    'ui',
  )
  // set desired Stratum URL for display in the UI
  const url = (await store.read().const(effects))?.stratumDisplayAddress || ''

  await uiSub.exec([
    'sh',
    '-c',
    `sed -i "s/<Stratum URL>/${url}/" "$(find /var/www/html/main.*.js)"`,
  ])

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects)
    .addDaemon('stratum', {
      subcontainer: stratumSub,
      exec: {
        command: ['/usr/local/bin/node', 'dist/main.js'],
        cwd: '/public-pool',
      },
      ready: {
        display: i18n('Stratum Server'),
        gracePeriod: 15_000,
        fn: () =>
          sdk.healthCheck.checkPortListening(
            effects,
            stratumPort,
            {
              successMessage: i18n('Stratum server is ready'),
              errorMessage: i18n('Stratum server is not ready'),
            },
          ),
      },
      requires: [],
    })
    .addDaemon('ui', {
      subcontainer: uiSub,
      exec: {
        command: ['nginx', '-g', 'daemon off;'],
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
      },
      requires: [],
    })
})
