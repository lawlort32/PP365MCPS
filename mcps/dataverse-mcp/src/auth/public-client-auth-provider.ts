import { AccessToken, AuthProvider } from './auth-provider.js';

export type PublicClientMode = 'public_client' | 'broker';

export interface PublicClientAuthConfig {
  mode: PublicClientMode;
}

export class PublicClientAuthProvider implements AuthProvider {
  private config: PublicClientAuthConfig;

  constructor(config: PublicClientAuthConfig) {
    this.config = config;
  }

  async getAccessToken(_scope: string): Promise<AccessToken> {
    if (this.config.mode === 'broker') {
      throw new Error(
        'Broker auth mode is a scaffold in this repo. Implement WAM/broker token acquisition for your target runtime, then wire it into PublicClientAuthProvider.'
      );
    }

    throw new Error(
      'Public client auth mode is a scaffold in this repo. Implement MSAL interactive/device-code login and token cache handling, then wire it into PublicClientAuthProvider.'
    );
  }
}
