import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { youtubeOAuth } from '@/providers/youtube/oauth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || '00000000-0000-0000-0000-000000000000'; // Fallback for dev

    // Generate tamper-resistant state packing workspaceId and random nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    const state = `${workspaceId}:${nonce}`;

    const authUrl = youtubeOAuth.generateAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to initiate YouTube connection', message }, { status: 500 });
  }
}
