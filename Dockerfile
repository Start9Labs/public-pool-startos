FROM node:22-bookworm-slim AS build

# Public Pool repo does not use versions/tags yet, point directly to commit sha
ARG PUBLIC_POOL_SHA=96a9202c11de2c6fc8d41155e2e779912a476dc7
ARG PUBLIC_POOL_UI_SHA=0778debf51443deb704c2897371cc013ace35e1a

RUN \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential ca-certificates cmake curl git python3 wget && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /build

RUN \
    git clone https://github.com/benjamin-wilson/public-pool.git && \
    cd public-pool && \
    git checkout ${PUBLIC_POOL_SHA}

RUN \
    cd public-pool && \
    npm ci --no-audit --no-fund && \
    NODE_ENV=production npm run build && \
    npm prune --production

RUN \
    git clone https://github.com/benjamin-wilson/public-pool-ui.git && \
    cd public-pool-ui && \
    git checkout ${PUBLIC_POOL_UI_SHA}

# build fixes only — runtime config is injected by main.ts via window.__PUBLIC_POOL_CONFIG__
COPY assets/patches/public-pool-ui.patch /build/public-pool-ui/public-pool-ui.patch

RUN \
    cd public-pool-ui && \
    git apply public-pool-ui.patch && \
    npm ci --no-audit --no-fund && \
    NODE_ENV=production npm run build && \
    npm prune --production

# main container
FROM node:22-bookworm-slim

ENV NODE_ENV=production

WORKDIR /public-pool

RUN \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    nginx && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY ./assets/nginx.conf /etc/nginx/sites-available/default

COPY --from=build /build/public-pool/node_modules ./node_modules
COPY --from=build /build/public-pool/dist ./dist

WORKDIR /var/www/html
COPY --from=build /build/public-pool-ui/dist/public-pool-ui .
