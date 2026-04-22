import axios from 'axios';
import { AccessToken, AuthProvider } from './auth-provider.js';

export interface OboAuthConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  userAssertionToken?: string;
}

export class OboAuthProvider implements AuthProvider {
  private config: OboAuthConfig;
  private authToken: AccessToken | null = null;

  constructor(config: OboAuthConfig) {
    this.config = config;
  }

  async getAccessToken(scope: string): Promise<AccessToken> {
    if (!this.config.userAssertionToken) {
      throw new Error(
        'OBO auth mode requires DATAVERSE_OBO_ASSERTION. Provide an incoming user token from your MCP host or auth gateway.'
      );
    }

    if (!this.authToken || Date.now() >= this.authToken.expiresAt) {
      this.authToken = await this.exchangeOnBehalfOfToken(scope, this.config.userAssertionToken);
    }

    return this.authToken;
  }

  private async exchangeOnBehalfOfToken(scope: string, assertionToken: string): Promise<AccessToken> {
    const tokenUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    params.append('requested_token_use', 'on_behalf_of');
    params.append('client_id', this.config.clientId);
    params.append('client_secret', this.config.clientSecret);
    params.append('assertion', assertionToken);
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
      throw new Error(`OBO authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
