export const YOUTUBE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
] as const;

export interface YouTubeTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface YouTubeChannelProfile {
  channelId: string;
  title: string;
  customUrl?: string;
  avatarUrl?: string;
}

export class YouTubeOAuthHelper {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/connections/youtube/callback';
  }

  /**
   * Generates Google OAuth 2.0 authorization URL with offline access (to obtain refresh_token).
   */
  public generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: YOUTUBE_OAUTH_SCOPES.join(' '),
      access_type: 'offline', // Required to receive refresh_token
      prompt: 'consent',     // Forces consent prompt so refresh_token is returned
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for access and refresh tokens.
   */
  public async exchangeCode(code: string): Promise<YouTubeTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange YouTube authorization code: ${errorText}`);
    }

    return response.json();
  }

  /**
   * Refreshes an expired access token using the stored refresh token.
   */
  public async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh YouTube access token: ${errorText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Retrieves the authentic channel ID, title, and avatar for the authenticated user.
   */
  public async getChannelProfile(accessToken: string): Promise<YouTubeChannelProfile> {
    const url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true';
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch YouTube channel profile: ${errorText}`);
    }

    const data = await response.json();
    const items = data.items || [];
    if (items.length === 0) {
      throw new Error('No YouTube channel associated with this Google account.');
    }

    const channel = items[0];
    return {
      channelId: channel.id,
      title: channel.snippet?.title || 'YouTube Channel',
      customUrl: channel.snippet?.customUrl,
      avatarUrl: channel.snippet?.thumbnails?.default?.url,
    };
  }
}

export const youtubeOAuth = new YouTubeOAuthHelper();
