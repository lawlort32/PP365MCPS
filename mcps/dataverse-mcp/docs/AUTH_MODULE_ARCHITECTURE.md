# Authentication Module Architecture

This MCP now uses an auth abstraction so additional MCPs can reuse the same pattern.

## Auth provider contract

- `src/auth/auth-provider.ts`
  - `AuthProvider#getAccessToken(scope)` returns a normalized token shape:
    - `accessToken`
    - `expiresAt`
    - `tokenType` (optional)

## Current providers

- `ClientSecretAuthProvider` (`client_secret`, default)
  - Preserves original behavior (`client_credentials` to Entra token endpoint).
- `OboAuthProvider` (`obo`)
  - Exchanges incoming user assertion (`DATAVERSE_OBO_ASSERTION`) for a Dataverse token.
  - Intended for remote gateways and delegated user flows.
- `PublicClientAuthProvider` (`public_client`, `broker`)
  - Scaffold/placeholder for interactive public client login and WAM/broker integration.

## Bootstrap wiring

- `src/auth/create-auth-provider.ts` selects a provider from `DATAVERSE_AUTH_MODE`.
- `src/index.ts` validates required env vars by mode and injects provider into `DataverseClient`.
- `DataverseClient` no longer contains grant-specific auth logic; it only requests tokens from `AuthProvider`.

## Environment variables

- `DATAVERSE_AUTH_MODE=client_secret|obo|public_client|broker`
- `DATAVERSE_URL`
- `DATAVERSE_CLIENT_ID`
- `DATAVERSE_TENANT_ID`
- `DATAVERSE_CLIENT_SECRET` (required for `client_secret` and `obo`)
- `DATAVERSE_OBO_ASSERTION` (required at runtime for `obo` token exchange)

## Reuse in future MCPs

1. Copy `src/auth/*`.
2. Keep resource-specific API clients focused on API calls only.
3. Inject `AuthProvider` into each client at bootstrap time.
