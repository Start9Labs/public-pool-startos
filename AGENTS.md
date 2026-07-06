# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `public-pool`.** A Bitcoin mining pool exposing two interfaces — `ui` (web UI) and `stratum` (the Stratum server) — that share a single MultiHost (host id `main`, exported from `startos/interfaces.ts`) so they can live on the same (sub)domain. The stratum interface is plain TCP on 3333 with StartOS-terminated TLS on 4333.
- **Hard dependency on Bitcoin Core (`bitcoind`, `optional: false`) with ZMQ required.** A `critical` autoconfig task (`startos/dependencies.ts`) enforces `zmqEnabled` on bitcoind.
- **Reaching bitcoind's RPC and ZMQ goes through the LXC bridge**, not `bitcoind.startos` DNS. `getBitcoindBridge` (`startos/utils.ts`) resolves both addresses through the reactive `bridgeAddress` helper — the bridge `10.0.3.1:<assigned port>` for bitcoind's exported `rpcHostId`/`rpcPort` and `zmqHostId`/`zmqPortBlock` (imported from `bitcoin-core-startos/startos/utils`, never hardcoded), read via `.const()` so the pool restarts only on a real port change, never on a plain bitcoind update. `main.ts` writes them into `.env` (`BITCOIN_RPC_URL`/`BITCOIN_RPC_PORT`/`BITCOIN_ZMQ_HOST`) before the stratum daemon starts, throwing if bitcoind isn't yet reachable. The env file model types those fields loosely (`z.string()` with legacy `bitcoind.startos` catches) because the address is dynamic.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach public-pool -n <name> -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `stratum` for the pool backend or `ui` for the nginx web UI) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
