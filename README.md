# PP365MCPS

Monorepo for Power Platform / Dataverse / M365 MCP servers.

## Current MCPs

- `mcps/dataverse-mcp` - imported from `mwhesse/dataverse-mcp` and refactored with modular auth providers.

## Upstream sync strategy (Dataverse MCP)

This repo tracks Dataverse MCP with an upstream remote:

```bash
git remote add upstream https://github.com/mwhesse/dataverse-mcp.git
git fetch upstream
```

The Dataverse MCP lives under `mcps/dataverse-mcp` so future updates can be pulled from `upstream/main` and merged into this monorepo folder with a prefix-based import workflow.

## Dataverse MCP setup

See:

- `mcps/dataverse-mcp/README.md`
- `mcps/dataverse-mcp/docs/AUTH_MODULE_ARCHITECTURE.md`
