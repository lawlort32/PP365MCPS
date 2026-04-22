export interface AccessToken {
  accessToken: string;
  expiresAt: number;
  tokenType?: string;
}

export interface AuthProvider {
  getAccessToken(scope: string): Promise<AccessToken>;
}
