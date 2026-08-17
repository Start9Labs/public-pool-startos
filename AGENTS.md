# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **`DEV_FEE_ADDRESS` must stay _named_ in the env model, pinned empty.** A file model preserves keys it does not name, so leaving it out lets a line planted on the volume — a restored backup, say — survive every wrapper write. Upstream splits the coinbase 1.5%/98.5% to whatever it holds once a miner clears 50 TH/s, and never validates it is an address, so a junk value makes every job throw. Naming it means each merge coerces it back to empty, and upstream then pays the miner 100%.
- **Substitute the Stratum display URL in Node, not through `sh -c sed`.** The address is user-supplied and both layers read parts of it as syntax: a lone `/` ends `s///` early, and a quote or `$( )` escapes the shell.
- **RPC and ZMQ are separate bitcoind hosts and need separate `.const()` subscriptions.** Each fires only on its own assigned-port change, which is what keeps a routine bitcoind update or restart from restarting the pool.
- **`main` throws when bitcoind is unreachable rather than writing a placeholder address.** Starting against an address that does not resolve gives a green stratum check and miners that silently never get work.
- **The `.cookie` read in `main` is a `.const()` watch, not a one-off.** It is what makes a bitcoind cookie rotation restart the pool instead of leaving it authenticating with a stale credential.
- **The stratum binding keeps `secure: { ssl: false }`.** With `secure: null` the OS would expose only the TLS port on ordinary LAN gateways, and most mining hardware speaks plain stratum only.
- **Display addresses are seeded only when missing**, so a user's selection survives updates and restores.
