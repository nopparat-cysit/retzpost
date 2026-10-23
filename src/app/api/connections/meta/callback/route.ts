import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TokenVaultService } from '@/modules/security/token-vault';
import { metaOAuth } from '@/providers/meta/oauth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error') || searchParams.get('error_description');

  const redirectBase = new URL('/accounts', req.url);

  if (oauthError) {
    redirectBase.searchParams.set('error', `Meta OAuth rejected: ${oauthError}`);
    return NextResponse.redirect(redirectBase);
  }

  if (!code || !state) {
    redirectBase.searchParams.set('error', 'Missing code or state from Meta callback');
    return NextResponse.redirect(redirectBase);
  }

  try {
    const [workspaceId] = state.split(':');

    // 1. Exchange code for 60-day long-lived User Access Token
    const { accessToken: userLongLivedToken, expiresIn } = await metaOAuth.exchangeCode(code);

    // 2. Discover Facebook Pages & connected Instagram Business accounts
    const pages = await metaOAuth.getManagedPagesAndInstagram(userLongLivedToken);

    if (pages.length === 0) {
      redirectBase.searchParams.set('error', 'No managed Facebook Pages found on this account.');
      return NextResponse.redirect(redirectBase);
    }

    const vault = new TokenVaultService();
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // 3. Atomically upsert connections and platform accounts
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

      for (const page of pages) {
        // Facebook Page Connection & Account
        const fbEncrypted = vault.encrypt(page.accessToken);
        const fbConnection = await tx.socialConnection.upsert({
          where: {
            workspaceId_platform_providerUserId: {
              workspaceId: workspace.id,
              platform: 'FACEBOOK',
              providerUserId: page.id,
            },
          },
          update: {
            encryptedAccessToken: fbEncrypted.ciphertext,
            keyVersion: fbEncrypted.keyVersion,
            accessTokenExpiresAt: expiresAt,
            status: 'ACTIVE',
            lastError: null,
          },
          create: {
            workspaceId: workspace.id,
            platform: 'FACEBOOK',
            providerUserId: page.id,
            encryptedAccessToken: fbEncrypted.ciphertext,
            keyVersion: fbEncrypted.keyVersion,
            accessTokenExpiresAt: expiresAt,
            status: 'ACTIVE',
          },
        });

        await tx.platformAccount.upsert({
          where: {
            workspaceId_platform_providerAccountId: {
              workspaceId: workspace.id,
              platform: 'FACEBOOK',
              providerAccountId: page.id,
            },
          },
          update: {
            connectionId: fbConnection.id,
            handle: page.name,
            displayName: `FB: ${page.name}`,
            isActive: true,
            capabilitiesCache: {
              canPostFeedPhotos: true,
              canPostFeedAlbums: true,
              canPostFeedStatus: true,
              canPostStories: true,
            },
            capabilitiesFetchedAt: new Date(),
          },
          create: {
            workspaceId: workspace.id,
            connectionId: fbConnection.id,
            platform: 'FACEBOOK',
            providerAccountId: page.id,
            handle: page.name,
            displayName: `FB: ${page.name}`,
            isActive: true,
            capabilitiesCache: {
              canPostFeedPhotos: true,
              canPostFeedAlbums: true,
              canPostFeedStatus: true,
              canPostStories: true,
            },
            capabilitiesFetchedAt: new Date(),
          },
        });

        // Connected Instagram Professional Account (if linked to the Facebook Page)
        if (page.instagramAccount) {
          const ig = page.instagramAccount;
          const igConnection = await tx.socialConnection.upsert({
            where: {
              workspaceId_platform_providerUserId: {
                workspaceId: workspace.id,
                platform: 'INSTAGRAM',
                providerUserId: ig.id,
              },
            },
            update: {
              encryptedAccessToken: fbEncrypted.ciphertext, // Uses page access token to publish to linked IG
              keyVersion: fbEncrypted.keyVersion,
              accessTokenExpiresAt: expiresAt,
              status: 'ACTIVE',
              lastError: null,
            },
            create: {
              workspaceId: workspace.id,
              platform: 'INSTAGRAM',
              providerUserId: ig.id,
              encryptedAccessToken: fbEncrypted.ciphertext,
              keyVersion: fbEncrypted.keyVersion,
              accessTokenExpiresAt: expiresAt,
              status: 'ACTIVE',
            },
          });

          await tx.platformAccount.upsert({
            where: {
              workspaceId_platform_providerAccountId: {
                workspaceId: workspace.id,
                platform: 'INSTAGRAM',
                providerAccountId: ig.id,
              },
            },
            update: {
              connectionId: igConnection.id,
              handle: `@${ig.username}`,
              displayName: `IG: ${ig.username}`,
              avatarUrl: ig.avatarUrl,
              isActive: true,
              capabilitiesCache: {
                canPostSinglePhoto: true,
                canPostCarousels: true,
                canPostStories: true,
                canPostReels: true,
              },
              capabilitiesFetchedAt: new Date(),
            },
            create: {
              workspaceId: workspace.id,
              connectionId: igConnection.id,
              platform: 'INSTAGRAM',
              providerAccountId: ig.id,
              handle: `@${ig.username}`,
              displayName: `IG: ${ig.username}`,
              avatarUrl: ig.avatarUrl,
              isActive: true,
              capabilitiesCache: {
                canPostSinglePhoto: true,
                canPostCarousels: true,
                canPostStories: true,
                canPostReels: true,
              },
              capabilitiesFetchedAt: new Date(),
            },
          });
        }
      }
    });

    redirectBase.searchParams.set('success', `Connected Facebook Pages and Instagram Accounts successfully`);
    return NextResponse.redirect(redirectBase);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    redirectBase.searchParams.set('error', `Meta connection error: ${message}`);
    return NextResponse.redirect(redirectBase);
  }
}
