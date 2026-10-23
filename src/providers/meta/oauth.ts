export const META_OAUTH_SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'instagram_basic',
  'instagram_content_publish',
] as const;

export interface MetaPageAccount {
  id: string; // Facebook Page ID
  name: string;
  accessToken: string; // Page-specific Access Token
  instagramAccount?: {
    id: string; // Instagram Business Account ID
    username: string;
    name?: string;
    avatarUrl?: string;
  };
}

export class MetaOAuthHelper {
  private appId: string;
  private appSecret: string;
  private redirectUri: string;

  constructor() {
    this.appId = process.env.META_APP_ID || '';
    this.appSecret = process.env.META_APP_SECRET || '';
    this.redirectUri = process.env.META_REDIRECT_URI || 'http://localhost:3000/api/connections/meta/callback';
  }

  public generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      state,
      scope: META_OAUTH_SCOPES.join(','),
      response_type: 'code',
    });

    return `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`;
  }

  public async exchangeCode(code: string): Promise<{ accessToken: string; expiresIn: number }> {
    const url = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${this.appId}&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&client_secret=${this.appSecret}&code=${code}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(`Meta token exchange failed: ${data.error.message}`);
    }

    // Exchange short-lived token for 60-day long-lived token
    return this.exchangeForLongLivedToken(data.access_token);
  }

  public async exchangeForLongLivedToken(
    shortLivedToken: string
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const url = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${shortLivedToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(`Failed to exchange Meta long-lived token: ${data.error.message}`);
    }

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in || 5184000, // 60 days in seconds
    };
  }

  /**
   * Retrieves Facebook Pages and connected Instagram Business Accounts managed by the user.
   */
  public async getManagedPagesAndInstagram(userAccessToken: string): Promise<MetaPageAccount[]> {
    const url = `https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}&access_token=${userAccessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(`Failed to fetch Meta accounts: ${data.error.message}`);
    }

    const items = data.data || [];
    return items.map((p: any) => ({
      id: p.id,
      name: p.name,
      accessToken: p.access_token,
      instagramAccount: p.instagram_business_account
        ? {
            id: p.instagram_business_account.id,
            username: p.instagram_business_account.username,
            name: p.instagram_business_account.name,
            avatarUrl: p.instagram_business_account.profile_picture_url,
          }
        : undefined,
    }));
  }
}

export const metaOAuth = new MetaOAuthHelper();
