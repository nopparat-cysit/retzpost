import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { TokenVaultService } from '@/modules/security/token-vault';
import { Platform } from '@prisma/client';

export const dynamic = 'force-dynamic';

const DEFAULT_WORKSPACE_ID = 'dfec755f-256c-4182-813f-a69266c7b6f0';

function normalizePlatform(input: string): Platform {
  const upper = (input || '').toUpperCase();
  if (upper === 'INSTAGRAM') return Platform.INSTAGRAM;
  if (upper === 'YOUTUBE') return Platform.YOUTUBE;
  if (upper === 'TIKTOK') return Platform.TIKTOK;
  return Platform.FACEBOOK;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || DEFAULT_WORKSPACE_ID;

    const accounts = await prisma.platformAccount.findMany({
      where: {
        workspaceId,
        isActive: true,
      },
      include: {
        connection: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ accounts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to fetch platform accounts', message }, { status: 500 });
  }
}

const connectAccountSchema = z.object({
  workspaceId: z.string().uuid().optional(),
  platform: z.string(),
  handle: z.string().min(1),
  displayName: z.string().min(1),
  avatarUrl: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = connectAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { platform: rawPlatform, handle, displayName, avatarUrl } = parsed.data;
    const workspaceId = parsed.data.workspaceId || DEFAULT_WORKSPACE_ID;
    const platform = normalizePlatform(rawPlatform);

    const vault = new TokenVaultService();
    const mockToken = `oauth_token_${platform.toLowerCase()}_${Date.now()}`;
    const encrypted = vault.encrypt(mockToken);

    const cleanHandle = handle.trim().replace(/^@/, '');
    const providerUserId = `usr_${cleanHandle.toLowerCase()}_${Date.now()}`;
    const providerAccountId = `acc_${cleanHandle.toLowerCase()}_${Date.now()}`;

    // Atomically upsert socialConnection and platformAccount
    const account = await prisma.$transaction(async (tx) => {
      // Ensure workspace exists
      const ws = await tx.workspace.findUnique({ where: { id: workspaceId } });
      if (!ws) {
        throw new Error(`Workspace ${workspaceId} not found`);
      }

      const connection = await tx.socialConnection.create({
        data: {
          workspaceId,
          platform,
          providerUserId,
          encryptedAccessToken: encrypted.ciphertext,
          keyVersion: encrypted.keyVersion,
          status: 'ACTIVE',
        },
      });

      const capabilities = {
        canPostFeedPhotos: true,
        canPostFeedAlbums: true,
        canPostFeedStatus: true,
        canPostStories: platform === Platform.FACEBOOK || platform === Platform.INSTAGRAM,
        canPostReels: platform !== Platform.YOUTUBE,
        canPostShorts: platform === Platform.YOUTUBE,
      };

      const createdAccount = await tx.platformAccount.create({
        data: {
          workspaceId,
          connectionId: connection.id,
          platform,
          providerAccountId,
          handle: handle.startsWith('@') ? handle : `@${handle}`,
          displayName,
          avatarUrl: avatarUrl || null,
          capabilitiesCache: capabilities,
          capabilitiesFetchedAt: new Date(),
          isActive: true,
        },
        include: {
          connection: true,
        },
      });

      return createdAccount;
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to connect platform account', message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let accountId = searchParams.get('accountId');

    if (!accountId) {
      try {
        const body = await req.json();
        accountId = body.accountId;
      } catch {
        // query param preferred
      }
    }

    if (!accountId) {
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
    }

    await prisma.platformAccount.update({
      where: { id: accountId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to deactivate platform account', message }, { status: 500 });
  }
}
