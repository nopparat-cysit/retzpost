import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TokenVaultService } from '@/modules/security/token-vault';
import { tiktokOAuth } from '@/providers/tiktok/oauth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error') || searchParams.get('error_description');

  const redirectBase = new URL('/accounts', req.url);

  if (oauthError) {
    redirectBase.searchParams.set('error', `TikTok OAuth rejected: ${oauthError}`);
    return NextResponse.redirect(redirectBase);
  }

  const codeVerifier = req.cookies.get('tiktok_pkce_verifier')?.value;
  if (!code || !codeVerifier || !state) {
    redirectBase.searchParams.set('error', 'Missing code, verifier, or state from TikTok callback');
    return NextResponse.redirect(redirectBase);
  }

  try {
    const [workspaceId] = state.split(':');

    // Exchange authorization code for TikTok tokens
    const tokens = await tiktokOAuth.exchangeCode(code, codeVerifier);

    // Query genuine creator profile & account capabilities
    const creatorInfo = await tiktokOAuth.queryCreatorInfo(tokens.access_token);

    // Encrypt sensitive tokens via TokenVaultService (AES-256-GCM)
    const vault = new TokenVaultService();
    const encryptedAccess = vault.encrypt(tokens.access_token);
    const encryptedRefresh = tokens.refresh_token ? vault.encrypt(tokens.refresh_token) : null;

    const accessExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    const refreshExpiresAt = tokens.refresh_expires_in
      ? new Date(Date.now() + tokens.refresh_expires_in * 1000)
      : null;

    // Atomic transaction: upsert SocialConnection and PlatformAccount
    await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.upsert({
        where: { id: workspaceId },
        update: {},
        create: {
          id: workspaceId,
          name: 'Acme Creator Studio',
          slug: 'acme-creator-studio',
        },
      });

      const connection = await tx.socialConnection.upsert({
        where: {
          workspaceId_platform_providerUserId: {
            workspaceId: workspace.id,
            platform: 'TIKTOK',
            providerUserId: tokens.open_id,
          },
        },
        update: {
          encryptedAccessToken: encryptedAccess.ciphertext,
          encryptedRefreshToken: encryptedRefresh?.ciphertext,
          keyVersion: encryptedAccess.keyVersion,
          accessTokenExpiresAt: accessExpiresAt,
          refreshTokenExpiresAt: refreshExpiresAt,
          status: 'ACTIVE',
          lastError: null,
        },
        create: {
          workspaceId: workspace.id,
          platform: 'TIKTOK',
          providerUserId: tokens.open_id,
          encryptedAccessToken: encryptedAccess.ciphertext,
          encryptedRefreshToken: encryptedRefresh?.ciphertext,
          keyVersion: encryptedAccess.keyVersion,
          accessTokenExpiresAt: accessExpiresAt,
          refreshTokenExpiresAt: refreshExpiresAt,
          grantedScopes: tokens.scope.split(','),
          status: 'ACTIVE',
        },
      });

      await tx.platformAccount.upsert({
        where: {
          workspaceId_platform_providerAccountId: {
            workspaceId: workspace.id,
            platform: 'TIKTOK',
            providerAccountId: tokens.open_id,
          },
        },
        update: {
          connectionId: connection.id,
          handle: creatorInfo.creator_username || `@${creatorInfo.creator_nickname.toLowerCase().replace(/\s+/g, '')}`,
          displayName: creatorInfo.creator_nickname,
          avatarUrl: creatorInfo.creator_avatar_url,
          isActive: true,
          capabilitiesCache: {
            privacyLevelOptions: creatorInfo.privacy_level_options,
            commentDisabled: creatorInfo.comment_disabled,
            duetDisabled: creatorInfo.duet_disabled,
            stitchDisabled: creatorInfo.stitch_disabled,
            maxVideoPostDurationSec: creatorInfo.max_video_post_duration_sec,
          },
          capabilitiesFetchedAt: new Date(),
        },
        create: {
          workspaceId: workspace.id,
          connectionId: connection.id,
          platform: 'TIKTOK',
          providerAccountId: tokens.open_id,
          handle: creatorInfo.creator_username || `@${creatorInfo.creator_nickname.toLowerCase().replace(/\s+/g, '')}`,
          displayName: creatorInfo.creator_nickname,
          avatarUrl: creatorInfo.creator_avatar_url,
          isActive: true,
          capabilitiesCache: {
            privacyLevelOptions: creatorInfo.privacy_level_options,
            commentDisabled: creatorInfo.comment_disabled,
            duetDisabled: creatorInfo.duet_disabled,
            stitchDisabled: creatorInfo.stitch_disabled,
            maxVideoPostDurationSec: creatorInfo.max_video_post_duration_sec,
          },
          capabilitiesFetchedAt: new Date(),
        },
      });
    });

    redirectBase.searchParams.set('success', `TikTok account '${creatorInfo.creator_nickname}' connected`);
    const res = NextResponse.redirect(redirectBase);
    res.cookies.delete('tiktok_pkce_verifier');
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    redirectBase.searchParams.set('error', `TikTok connection failed: ${message}`);
    return NextResponse.redirect(redirectBase);
  }
}
