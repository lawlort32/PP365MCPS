import axios from 'axios';
import { AccessToken, AuthProvider } from './auth-provider.js';

export interface ClientSecretAuthConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

export class ClientSecretAuthProvider implements AuthProvider {
  private config: ClientSecretAuthConfig;
  private authToken: AccessToken | null = null;

  constructor(config: ClientSecretAuthConfig) {
    this.config = config;
  }

  async getAccessToken(scope: string): Promise<AccessToken> {
    if (!this.authToken || Date.now() >= this.authToken.expiresAt) {
      this.authToken = await this.authenticate(scope);
    }

    return this.authToken;
  }

  private async authenticate(scope: string): Promise<AccessToken> {
    const tokenUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.config.clientId);
    params.append('client_secret', this.config.clientSecret);
    params.append('scope', scope);

    try {
      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return {
        accessToken: response.data.access_token,
        tokenType: response.data.token_type,
        expiresAt: Date.now() + (response.data.expires_in * 1000) - 60000
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
