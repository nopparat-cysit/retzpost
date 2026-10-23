import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { metaOAuth } from '@/providers/meta/oauth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || '00000000-0000-0000-0000-000000000000';

    const nonce = crypto.randomBytes(16).toString('hex');
    const state = `${workspaceId}:${nonce}`;

    const authUrl = metaOAuth.generateAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to initiate Meta connection', message }, { status: 500 });
  }
}
