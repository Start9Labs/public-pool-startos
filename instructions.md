# Public Pool

## Documentation

- [Public Pool upstream README](https://github.com/benjamin-wilson/public-pool#readme) — the upstream project page, with background on the pool and protocol.

## What you get on StartOS

- A **Web UI** interface — the Public Pool dashboard for watching workers, hashrate, and block discoveries.
- A **Stratum Server** interface — plain TCP on port 3333 and TLS (`stratum+tls`) on port 4333 — the endpoint your mining hardware points at.
- Bitcoin Core auto-wired as a dependency: RPC over the cookie file and ZMQ block notifications are configured for you, so you do not edit `.env`.

## Getting set up

1. Install Bitcoin Core first. Public Pool requires it and will run the **Auto Configure** task on Bitcoin Core to enable ZMQ before it can start.
2. Install Public Pool. It will start automatically once Bitcoin Core is running and ZMQ is enabled.
3. Open the **Configure** action and set:
   - **Pool Identifier** — the string that appears in your coinbase transactions (default `Public-Pool on StartOS`).
   - **Server Display URL** — which of the Stratum interface's plain-TCP addresses to show on the dashboard as the connection URL for miners. Defaults to the device's `.local` hostname.
   - **Secure Server Display URL** — which of the Stratum interface's TLS addresses to show for `stratum+tls` connections. Also defaults to `.local`, which has the bonus that the TLS certificate matches the hostname.
4. Point your mining hardware at the Stratum server. See **Connecting miners** below.

## Using Public Pool

### Web UI

Open the **Web UI** interface from the service page. The dashboard shows pool hashrate, your workers, recent blocks found, and the configured Stratum display URLs miners should use.

### Configure action

Run **Configure** whenever you want to change the coinbase pool identifier or pick different Stratum display URLs (for example after adding a new clearnet or LAN address to the Stratum interface).

### Connecting miners

- **Plain TCP** — point your miner at `stratum+tcp://<host>:3333`.
- **TLS** — point your miner at `stratum+tls://<host>:4333`. StartOS terminates the TLS connection and forwards it to the pool.

The dashboard shows the device's `.local` hostname by default. ESP32-based miners like the Bitaxe generally resolve mDNS fine; if yours cannot (stock ASIC firmware often can't), run **Configure** and select the LAN IP instead. Avoid the `.onion` address — mining firmware cannot resolve Tor.

## Limitations

- The TLS certificate on port 4333 is issued by your device's StartOS root CA. Miners that validate certificates need that CA installed (download it from your StartOS dashboard); many ASIC firmwares skip certificate validation or do not support `stratum+tls` at all — plain TCP on 3333 always works.
- The connection screen's "Stratum V2" entry comes from the upstream UI; Public Pool itself only speaks Stratum V1, so use the V1 endpoints.
