import { T, utils } from '@start9labs/start-sdk'
import {
  rpcHostId as btcRpcHostId,
  rpcInterfaceId as btcRpcInterfaceId,
  zmqHostId as btcZmqHostId,
  zmqBlockInterfaceId as btcZmqBlockInterfaceId,
} from 'bitcoin-core-startos/startos/utils'
import { sdk } from './sdk'

export const uiPort = 80
export const stratumPort = 3333
export const bitcoindMountpoint = '/mnt/bitcoind'

/**
 * The IPv4 LXC-bridge host:port for an interface on an already-resolved host.
 * Pure — call INSIDE an sdk.host map fn so .const() reacts only to this address.
 * `.startos` / container IPs are deprecated; containers reach each other over
 * this bridge.
 */
const bridgeAddr = (host: utils.FilledHost | null, interfaceId: string) => {
  const iface =
    host &&
    Object.values(host.bindings)
      .flatMap((b) => Object.values(b.interfaces))
      .find((i) => i.id === interfaceId)
  return iface
    ? iface.addressInfo.filter({
        kind: 'bridge',
        predicate: (h) => h.metadata.kind === 'ipv4' && !h.ssl,
      }).hostnames[0]
    : undefined
}

/**
 * bitcoind's RPC and ZMQ-block endpoints over the LXC bridge — replaces the
 * static bitcoind.startos, which no longer resolves in 2.0. One subscription per
 * host, each returning only its resolved address. undefined until the
 * dependency's interfaces are available.
 */
export const getBitcoindBridge = async (effects: T.Effects) => {
  const rpc = await sdk.host
    .get(effects, { hostId: btcRpcHostId, packageId: 'bitcoind' }, (host) =>
      bridgeAddr(host, btcRpcInterfaceId),
    )
    .const()
  const zmq = await sdk.host
    .get(effects, { hostId: btcZmqHostId, packageId: 'bitcoind' }, (host) =>
      bridgeAddr(host, btcZmqBlockInterfaceId),
    )
    .const()
  return rpc?.port != null && zmq?.port != null
    ? {
        rpcHost: rpc.hostname,
        rpcPort: `${rpc.port}`,
        zmqHost: zmq.hostname,
        zmqPort: `${zmq.port}`,
      }
    : undefined
}
