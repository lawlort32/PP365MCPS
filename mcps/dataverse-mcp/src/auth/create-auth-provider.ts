import { AuthProvider } from './auth-provider.js';
import { ClientSecretAuthProvider } from './client-secret-auth-provider.js';
import { OboAuthProvider } from './obo-auth-provider.js';
import { PublicClientAuthProvider, PublicClientMode } from './public-client-auth-provider.js';

export type AuthMode = 'client_secret' | 'obo' | 'public_client' | 'broker';

export interface AuthProviderConfig {
  mode?: AuthMode;
  tenantId: string;
  clientId: string;
  clientSecret?: string;
  oboAssertionToken?: string;
}

export function createAuthProvider(config: AuthProviderConfig): AuthProvider {
  const mode = config.mode ?? 'client_secret';

  if (mode === 'client_secret') {
    if (!config.clientSecret) {
      throw new Error('DATAVERSE_CLIENT_SECRET is required when DATAVERSE_AUTH_MODE=client_secret');
    }

    return new ClientSecretAuthProvider({
      tenantId: config.tenantId,
      clientId: config.clientId,
      clientSecret: config.clientSecret
    });
  }

  if (mode === 'obo') {
    if (!config.clientSecret) {
      throw new Error('DATAVERSE_CLIENT_SECRET is required when DATAVERSE_AUTH_MODE=obo');
    }

    return new OboAuthProvider({
      tenantId: config.tenantId,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      userAssertionToken: config.oboAssertionToken
    });
  }

  const publicClientMode: PublicClientMode = mode === 'broker' ? 'broker' : 'public_client';
  return new PublicClientAuthProvider({ mode: publicClientMode });
}
