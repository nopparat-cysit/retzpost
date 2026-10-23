import crypto from 'crypto';

export const TIKTOK_OAUTH_SCOPES = [
  'user.info.basic',
  'video.publish', // Direct post to public (requires app approval)
  'video.upload',  // Upload to inbox fallback
] as const;

export interface TikTokTokenResponse {
  open_id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  scope: string;
  token_type: string;
}

export interface TikTokCreatorInfo {
  creator_nickname: string;
  creator_avatar_url?: string;
  creator_username?: string;
  privacy_level_options: string[]; // e.g. ["PUBLIC_TO_EVERYONE", "MUTUAL_FOLLOW_FRIENDS", "SELF_ONLY"]
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
}

export class TikTokOAuthHelper {
  private clientKey: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientKey = process.env.TIKTOK_CLIENT_KEY || '';
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET || '';
    this.redirectUri = process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/connections/tiktok/callback';
  }

  /**
   * Generates TikTok OAuth authorization URL with PKCE (code_challenge S256).
   */
  public generateAuthUrl(state: string, codeChallenge: string): string {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      response_type: 'code',
      scope: TIKTOK_OAUTH_SCOPES.join(','),
      redirect_uri: this.redirectUri,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  /**
   * Exchanges code for TikTok access and refresh tokens.
   */
  public async exchangeCode(code: string, codeVerifier: string): Promise<TikTokTokenResponse> {
    const url = 'https://open.tiktokapis.com/v2/oauth/token/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();
    if (data.error || !data.data) {
      throw new Error(`TikTok token exchange failed: ${data.error_description || data.message || JSON.stringify(data)}`);
    }

    return data.data;
  }

  /**
   * Refreshes an expired TikTok access token using the refresh token.
   */
  public async refreshAccessToken(refreshToken: string): Promise<TikTokTokenResponse> {
    const url = 'https://open.tiktokapis.com/v2/oauth/token/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();
    if (data.error || !data.data) {
      throw new Error(`TikTok token refresh failed: ${data.error_description || data.message}`);
    }

    return data.data;
  }

  /**
   * Queries real-time creator capabilities and constraints.
   * Crucial API gate required before creating TikTok posts.
   */
  public async queryCreatorInfo(accessToken: string): Promise<TikTokCreatorInfo> {
    const url = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    const data = await response.json();
    if (data.error?.code !== 'ok' && !data.data) {
      throw new Error(`Failed to query TikTok creator_info: ${data.error?.message || JSON.stringify(data)}`);
    }

    const c = data.data;
    return {
      creator_nickname: c.creator_nickname || 'TikTok Creator',
      creator_avatar_url: c.creator_avatar_url,
      creator_username: c.creator_username,
      privacy_level_options: c.privacy_level_options || ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'],
      comment_disabled: Boolean(c.comment_disabled),
      duet_disabled: Boolean(c.duet_disabled),
      stitch_disabled: Boolean(c.stitch_disabled),
      max_video_post_duration_sec: c.max_video_post_duration_sec || 600, // 10 minutes default
    };
  }
}

export const tiktokOAuth = new TikTokOAuthHelper();
