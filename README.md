<p align="center">
  <img src="icon.svg" alt="Public Pool Logo" width="21%">
</p>

# Public Pool on StartOS

> **Upstream docs:** <https://github.com/benjamin-wilson/public-pool#readme>
>
> Everything not listed in this document should behave the same as upstream
> Public Pool. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable.

[Public Pool](https://github.com/benjamin-wilson/public-pool) is an open source Bitcoin mining pool with a Stratum server and web UI.

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
| Architectures | x86_64, aarch64 (emulated) |

The image is built from source, compiling both the backend (public-pool) and frontend (public-pool-ui) with StartOS-specific patches applied to the UI.

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | various | All Public Pool data |

**Key paths on the `main` volume:**

- `.env` — environment configuration file
- `store.json` — persists Stratum display address
- `mainnet/` — mainnet database (mounted to `/public-pool/DB`)
- `testnet/` — testnet database (mounted to `/public-pool/DB`)

**Bitcoin dependency mount:**

- `/mnt/bitcoind` — Bitcoin Core volume (read-only, for cookie auth)

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Installation | Docker Compose | Install from marketplace |
| Configuration | Edit `.env` file manually | Auto-configured, tunable via action |
| Bitcoin Core | Manual RPC setup | Auto-configured via dependency |
| Network | Single network only | Switchable between mainnet and testnet |

**First-run steps:**

1. Ensure Bitcoin Core (or Bitcoin Testnet) is installed
2. Install Public Pool from the StartOS marketplace
3. Optionally run "Configure" to set a custom pool identifier
4. Point your mining hardware at the Stratum interface

---

## Configuration Management

### Auto-Configured by StartOS

| Setting | Value | Purpose |
|---------|-------|---------|
| `BITCOIN_RPC_URL` | `http://bitcoind.startos` | Bitcoin RPC (mainnet) |
| `BITCOIN_RPC_PORT` | `8332` / `48332` | RPC port (mainnet/testnet) |
| `BITCOIN_RPC_COOKIEFILE` | `/mnt/bitcoind/.cookie` | Cookie auth |
| `BITCOIN_ZMQ_HOST` | `tcp://bitcoind.startos:28332` | ZMQ notifications |
| `BITCOIN_RPC_TIMEOUT` | `10000` | RPC timeout (ms) |
| `API_PORT` | `3334` | Internal API port |
| `STRATUM_PORT` | `3333` | Stratum protocol port |
| `API_SECURE` | `false` | API security |

### Configurable via Actions

| Setting | Action | Default | Purpose |
|---------|--------|---------|---------|
| Pool Identifier | Configure | `Public-Pool` | Coinbase transaction identifier |
| Server Display URL | Configure | Auto-detected IPv4 | Homepage display address |
| Network | Switch Network | mainnet | Toggle mainnet/testnet |

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Web UI | 80 | HTTP | Pool dashboard and statistics |
| Stratum Server | 3333 | TCP | Mining protocol |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

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
- **Server Display URL** — the address shown on your pool's homepage (auto-populated from available interfaces)

### Switch Network

| Property | Value |
|----------|-------|
| ID | `set-network` |
| Visibility | Enabled |
| Availability | Any status |
| Purpose | Toggle between mainnet and testnet |

Dynamically shows "Switch to testnet" or "Switch to mainnet" based on current configuration. Includes a confirmation warning.

---

## Dependencies

| Dependency | Required | Version | Purpose | Auto-Config |
|------------|----------|---------|---------|-------------|
| Bitcoin Core | Optional | >=29.1 | Mainnet mining | ZMQ enabled |
| Bitcoin Testnet | Optional | >=29.1 | Testnet mining | ZMQ enabled |

One of the two Bitcoin dependencies is required depending on the selected network. StartOS creates a critical task to enable ZMQ on the active Bitcoin node.

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
| Stratum | Stratum Server | 15s | Ready / Not ready |
| Web UI | Web Interface | Default | Ready / Not ready |

---

## Limitations and Differences

1. **Custom Docker image** — built from source with UI patches for display URL injection
2. **Single network** — cannot mine on mainnet and testnet simultaneously (switchable via action)
3. **Architecture emulation** — aarch64 builds use emulation

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
architectures: [x86_64, aarch64]
volumes:
  main:
    .env: environment configuration
    store.json: stratum display address
    mainnet/: mainnet database
    testnet/: testnet database
ports:
  ui: 80
  stratum: 3333
  api: 3334 (internal)
dependencies:
  bitcoind:
    required: false (one of bitcoind or bitcoind-testnet required)
    min_version: ">=29.1"
    enforced_config: [zmqEnabled=true]
  bitcoind-testnet:
    required: false
    min_version: ">=29.1"
    enforced_config: [zmqEnabled=true]
actions:
  - config (enabled, any)
  - set-network (enabled, any)
health_checks:
  - stratum: port_listening 3333 (15s grace)
  - ui: port_listening 80
backup_volumes:
  - main
startos_managed_config:
  BITCOIN_RPC_TIMEOUT: "10000"
  API_PORT: "3334"
  STRATUM_PORT: "3333"
  API_SECURE: "false"
not_available:
  - Simultaneous mainnet and testnet mining
```
