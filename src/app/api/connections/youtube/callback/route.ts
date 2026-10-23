import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TokenVaultService } from '@/modules/security/token-vault';
import { youtubeOAuth } from '@/providers/youtube/oauth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  const redirectBase = new URL('/accounts', req.url);

  if (oauthError) {
    redirectBase.searchParams.set('error', `OAuth rejected: ${oauthError}`);
    return NextResponse.redirect(redirectBase);
  }

  if (!code || !state) {
    redirectBase.searchParams.set('error', 'Missing code or state from provider callback');
    return NextResponse.redirect(redirectBase);
  }

  try {
    const [workspaceId] = state.split(':');
    if (!workspaceId) {
      throw new Error('Invalid state structure');
    }

    // Exchange code for tokens
    const tokens = await youtubeOAuth.exchangeCode(code);

    // Fetch authenticated YouTube channel details
    const channelProfile = await youtubeOAuth.getChannelProfile(tokens.access_token);

    // Encrypt sensitive tokens via TokenVaultService (AES-256-GCM)
    const vault = new TokenVaultService();
    const encryptedAccess = vault.encrypt(tokens.access_token);
    const encryptedRefresh = tokens.refresh_token ? vault.encrypt(tokens.refresh_token) : null;

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Atomic transaction: upsert SocialConnection and PlatformAccount
    await prisma.$transaction(async (tx) => {
      // Find or create workspace if in dev mode
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
            platform: 'YOUTUBE',
            providerUserId: channelProfile.channelId,
          },
        },
        update: {
          encryptedAccessToken: encryptedAccess.ciphertext,
          encryptedRefreshToken: encryptedRefresh?.ciphertext,
          keyVersion: encryptedAccess.keyVersion,
          accessTokenExpiresAt: expiresAt,
          status: 'ACTIVE',
          lastError: null,
        },
        create: {
          workspaceId: workspace.id,
          platform: 'YOUTUBE',
          providerUserId: channelProfile.channelId,
          encryptedAccessToken: encryptedAccess.ciphertext,
          encryptedRefreshToken: encryptedRefresh?.ciphertext,
          keyVersion: encryptedAccess.keyVersion,
          accessTokenExpiresAt: expiresAt,
          grantedScopes: tokens.scope.split(' '),
          status: 'ACTIVE',
        },
      });

      await tx.platformAccount.upsert({
        where: {
          workspaceId_platform_providerAccountId: {
            workspaceId: workspace.id,
            platform: 'YOUTUBE',
            providerAccountId: channelProfile.channelId,
          },
        },
        update: {
          connectionId: connection.id,
          handle: channelProfile.customUrl || channelProfile.channelId,
          displayName: channelProfile.title,
          avatarUrl: channelProfile.avatarUrl,
          isActive: true,
          capabilitiesCache: {
            canUploadVideo: true,
            maxVideoDurationSec: 43200, // 12 hours for verified accounts
          },
          capabilitiesFetchedAt: new Date(),
        },
        create: {
          workspaceId: workspace.id,
          connectionId: connection.id,
          platform: 'YOUTUBE',
          providerAccountId: channelProfile.channelId,
          handle: channelProfile.customUrl || channelProfile.channelId,
          displayName: channelProfile.title,
          avatarUrl: channelProfile.avatarUrl,
          isActive: true,
          capabilitiesCache: {
            canUploadVideo: true,
            maxVideoDurationSec: 43200,
          },
          capabilitiesFetchedAt: new Date(),
        },
      });
    });

    redirectBase.searchParams.set('success', `YouTube channel '${channelProfile.title}' connected`);
    return NextResponse.redirect(redirectBase);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    redirectBase.searchParams.set('error', `Connection failed: ${message}`);
    return NextResponse.redirect(redirectBase);
  }
}
