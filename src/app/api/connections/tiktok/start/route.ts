import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { tiktokOAuth } from '@/providers/tiktok/oauth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId') || '00000000-0000-0000-0000-000000000000';

    // Generate PKCE code_verifier and code_challenge (S256)
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    // Secure state containing workspaceId and nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    const state = `${workspaceId}:${nonce}`;

    const authUrl = tiktokOAuth.generateAuthUrl(state, codeChallenge);

    const response = NextResponse.redirect(authUrl);
    // Store codeVerifier in HttpOnly cookie valid for 10 minutes
    response.cookies.set('tiktok_pkce_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to initiate TikTok connection', message }, { status: 500 });
  }
}
