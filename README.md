<p align="center">
  <img src="icon.svg" alt="Public Pool Logo" width="21%">
</p>

# Public Pool on StartOS

> **Upstream docs:** <https://github.com/benjamin-wilson/public-pool#readme>
>
> Everything not listed in this document should behave the same as upstream
> Public Pool. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable.

[Public Pool](https://github.com/benjamin-wilson/public-pool) is an open-source Bitcoin mining pool with a Stratum server and web UI dashboard.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | Custom Dockerfile (multi-stage build from upstream source) |
| Base | `node:20-bookworm-slim` + nginx |
| Architectures | x86_64, aarch64 |

The image is built from source, compiling both the backend ([public-pool](https://github.com/benjamin-wilson/public-pool)) and frontend ([public-pool-ui](https://github.com/benjamin-wilson/public-pool-ui)) with StartOS-specific patches applied to the UI for display URL injection.

Two subcontainers run from the same image:

- **Stratum** — Node.js backend serving the Stratum mining protocol and API
- **UI** — nginx serving the static web dashboard and proxying API requests

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | various | All Public Pool data |

**Key paths on the `main` volume:**

- `.env` — environment configuration file
- `store.json` — persists Stratum display address selection
- `mainnet/` — mining database (mounted to `/public-pool/DB`)

**Bitcoin dependency mount:**

- `/mnt/bitcoind` — Bitcoin Core volume (read-only, for cookie auth)

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Installation | Docker Compose | Install from marketplace |
| Configuration | Edit `.env` file manually | Auto-configured, tunable via action |
| Bitcoin Core | Manual RPC setup | Auto-configured via dependency |

**First-run steps:**

1. Ensure Bitcoin Core is installed with ZMQ enabled
2. Install Public Pool from the StartOS marketplace
3. Optionally run "Configure" to set a custom pool identifier
4. Point your mining hardware at the Stratum interface (port 3333)

---

## Configuration Management

### Auto-Configured by StartOS

| Setting | Value | Purpose |
|---------|-------|---------|
| `BITCOIN_RPC_URL` | `http://bitcoind.startos` | Bitcoin RPC endpoint |
| `BITCOIN_RPC_PORT` | `8332` | RPC port |
| `BITCOIN_RPC_COOKIEFILE` | `/mnt/bitcoind/.cookie` | Cookie auth |
| `BITCOIN_ZMQ_HOST` | `tcp://bitcoind.startos:28332` | ZMQ block notifications |
| `BITCOIN_RPC_TIMEOUT` | `10000` | RPC timeout (ms) |
| `API_PORT` | `3334` | Internal API port (proxied by nginx) |
| `STRATUM_PORT` | `3333` | Stratum protocol port |
| `API_SECURE` | `false` | No SSL for internal API |

### Configurable via Actions

| Setting | Action | Default | Purpose |
|---------|--------|---------|---------|
| Pool Identifier | Configure | `Public-Pool` | Coinbase transaction identifier |
| Server Display URL | Configure | Auto-detected IPv4 | Address shown on pool homepage |

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Web UI | 80 | HTTP | Pool dashboard and statistics |
| Stratum Server | 3333 | TCP (raw) | Mining protocol |

Both interfaces share the same domain. The Stratum server uses raw TCP (no SSL wrapper) and advertises a preferred external port of 3333.

---

## Actions (StartOS UI)

### Configure

| Property | Value |
|----------|-------|
| ID | `config` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Set pool identifier and display URL |

**Inputs:**

- **Pool Identifier** — ASCII text included in Coinbase transactions (max 100 chars)
- **Server Display URL** — the address shown on your pool's homepage (auto-populated from available Stratum interface addresses)

---

## Dependencies

| Property | Value |
|----------|-------|
| **Service** | Bitcoin Core (`bitcoind`) |
| **Required** | Yes |
| **Version constraint** | `>=28.3` |
| **Health checks** | `bitcoind` must pass before Public Pool starts |
| **Mounted volumes** | `bitcoind:main` at `/mnt/bitcoind` (read-only) — used for cookie authentication |
| **Purpose** | Block notifications via ZMQ and RPC for mining |

StartOS creates a critical task to enable ZMQ on Bitcoin Core when Public Pool is installed. The pool connects via cookie authentication from the mounted dependency volume.

---

## Backups and Restore

**Included in backup:**

- `main` volume — configuration, database, and state

**Restore behavior:**

- All mining history and configuration restored
- Service resumes normal operation

---

## Health Checks

| Check | Display Name | Grace Period | Messages |
|-------|--------------|-------------|----------|
| Stratum | "Stratum Server" | 15s | "Stratum server is ready" / "Stratum server is not ready" |
| Web UI | "Web Interface" | Default | "The web interface is ready" / "The web interface is not ready" |

---

## Limitations and Differences

1. **Custom Docker image** — built from source with UI patches for Stratum display URL injection
2. **Mainnet only** — no testnet support
3. **Fixed Bitcoin connection** — must use the StartOS Bitcoin Core dependency; cannot connect to external Bitcoin nodes

---

## What Is Unchanged from Upstream

- Full Stratum protocol support
- Mining statistics and dashboard
- Block discovery tracking
- Worker management
- Coinbase transaction customization
- All web UI features

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: public-pool
image: custom (dockerBuild from upstream source)
architectures:
  - x86_64
  - aarch64
volumes:
  main: various (.env, store.json, mainnet/)
ports:
  ui: 80
  stratum: 3333
dependencies:
  - bitcoind
startos_managed_env_vars:
  - BITCOIN_RPC_URL
  - BITCOIN_RPC_PORT
  - BITCOIN_RPC_COOKIEFILE
  - BITCOIN_ZMQ_HOST
  - BITCOIN_RPC_TIMEOUT
  - API_PORT
  - STRATUM_PORT
  - API_SECURE
  - POOL_IDENTIFIER
actions:
  - config
```
