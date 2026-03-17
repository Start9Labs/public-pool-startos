## How the upstream version is pulled
- `Dockerfile` ARGs: `PUBLIC_POOL_SHA` and `PUBLIC_POOL_UI_SHA` (commit hashes)
- Image is `dockerBuild` (no dockerTag in manifest to update)

> Upstream has no tags or releases — version is tracked by commit SHA in the Dockerfile.
