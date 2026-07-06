import { T } from '@start9labs/start-sdk'
import {
  rpcHostId as btcRpcHostId,
  rpcPort as btcRpcPort,
  zmqHostId as btcZmqHostId,
  zmqPortBlock as btcZmqPortBlock,
} from 'bitcoin-core-startos/startos/utils'
import { sdk } from './sdk'

export const uiPort = 80
export const stratumPort = 3333
export const bitcoindMountpoint = '/mnt/bitcoind'

/**
 * Bridge address (`10.0.3.1:<assigned external port>`) of a dependency's
 * binding, as a minimal reactive value. Chain `.const()` in main: the mapped
 * string only changes when the address itself does, so main restarts exactly
 * on dependency install/uninstall/port-change and never on dependency
 * updates. Chain `.once()` in an action context. `fallbackPort` keeps the
 * value non-null while the dependency is absent — sanctioned only for tor's
 * allocator-guaranteed SOCKS 9050. Drop-in for the planned SDK
 * `sdk.host.getBridgeAddress` helper.
 */
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort: number
  },
): { const(): Promise<string>; once(): Promise<string> }
export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
): { const(): Promise<string | null>; once(): Promise<string | null> }
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort?: number
  },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port =
          host?.bindings[opts.internalPort]?.net.assignedPort ??
          opts.fallbackPort
        return port != null ? `${osIp}:${port}` : null
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

/**
 * bitcoind's RPC and ZMQ-block endpoints over the LXC bridge, which main writes
 * into `.env` before the stratum daemon starts. One reactive subscription per
 * host (RPC and ZMQ are separate bitcoind hosts); each fires only when its own
 * assigned port changes, so bitcoind updates and restarts never restart the
 * pool. undefined until bitcoind's bindings resolve.
 */
export const getBitcoindBridge = async (effects: T.Effects) => {
  const rpc = await bridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcRpcHostId,
    internalPort: btcRpcPort,
  }).const()
  const zmq = await bridgeAddress(effects, {
    packageId: 'bitcoind',
    hostId: btcZmqHostId,
    internalPort: btcZmqPortBlock,
  }).const()
  if (!rpc || !zmq) return undefined
  const [rpcHost, rpcPort] = rpc.split(':')
  const [zmqHost, zmqPort] = zmq.split(':')
  return { rpcHost, rpcPort, zmqHost, zmqPort }
}
