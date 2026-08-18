# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`DEV_FEE_ADDRESS` must stay _named_ in the env model, pinned empty.** A file model preserves keys it does not name, so leaving it out lets a line planted on the volume — a restored backup, say — survive every wrapper write. Upstream splits the coinbase 1.5%/98.5% to whatever it holds once a miner clears 50 TH/s, and never validates it is an address, so a junk value makes every job throw. Naming it means each merge coerces it back to empty, and upstream then pays the miner 100%.
- **Substitute the Stratum display URL in Node, not through `sh -c sed`.** The address is user-supplied and both layers read parts of it as syntax: a lone `/` ends `s///` early, and a quote or `$( )` escapes the shell.
- **RPC and ZMQ are separate bitcoind hosts and need separate `.const()` subscriptions.** Each fires only on its own assigned-port change, which is what keeps a routine bitcoind update or restart from restarting the pool.
- **`main` throws when bitcoind is unreachable rather than writing a placeholder address.** Starting against an address that does not resolve gives a green stratum check and miners that silently never get work.
- **The `.cookie` read in `main` is a `.const()` watch, not a one-off.** It is what makes a bitcoind cookie rotation restart the pool instead of leaving it authenticating with a stale credential.
- **The stratum binding keeps `secure: { ssl: false }`.** With `secure: null` the OS would expose only the TLS port on ordinary LAN gateways, and most mining hardware speaks plain stratum only.
- **Display addresses are seeded only when missing**, so a user's selection survives updates and restores.
