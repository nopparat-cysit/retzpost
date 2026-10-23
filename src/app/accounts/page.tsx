'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Lock
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { StatusTag } from '@/components/ui/status-tag';

export default function ConnectedAccountsPage() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');
  const errorMessage = searchParams.get('error');

  const accounts = [
    {
      id: 'acc-ig-1',
      platform: 'INSTAGRAM' as const,
      displayName: 'Alex Rivera Studio',
      handle: '@alexrivera_official',
      channelId: 'ig_user_17841405',
      status: 'CONNECTED' as const,
      scopes: ['instagram_basic', 'instagram_content_publish'],
      expiresIn: '60-day Long-Lived Token (Auto-refreshed via Token Vault)',
      capabilities: 'Feed Photos • Carousels (Up to 10) • 24h Stories • Reels',
      lastSynced: '5 mins ago',
    },
    {
      id: 'acc-fb-1',
      platform: 'FACEBOOK' as const,
      displayName: 'Alex Rivera Media Studio',
      handle: 'FB Page: Alex Rivera Media Studio',
      channelId: 'fb_page_10928374',
      status: 'CONNECTED' as const,
      scopes: ['pages_show_list', 'pages_manage_posts'],
      expiresIn: 'Permanent Page Access Token (Encrypted)',
      capabilities: 'Page Timeline • Photo Albums • Text Status • Page Stories',
      lastSynced: '5 mins ago',
    },
    {
      id: 'acc-yt-1',
      platform: 'YOUTUBE' as const,
      displayName: 'Alex Rivera Studio',
      handle: '@AlexRiveraStudio',
      channelId: 'UC_x65aB891F_Live',
      status: 'CONNECTED' as const,
      scopes: ['youtube.upload', 'youtube.readonly'],
      expiresIn: 'Active Google OAuth Token',
      capabilities: 'YouTube Shorts (9:16) • Long-form Videos • Resumable',
      lastSynced: '10 mins ago',
    },
    {
      id: 'acc-tt-1',
      platform: 'TIKTOK' as const,
      displayName: 'Alex Rivera Official',
      handle: '@alexrivera_official',
      channelId: 'open_id_tt_8892',
      status: 'CONNECTED' as const,
      scopes: ['video.publish', 'user.info.basic'],
      expiresIn: 'Active TikTok Token',
      capabilities: 'Max Video Duration: 10m (600s) • Direct Post & Inbox',
      lastSynced: '1 hour ago',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="WORKSPACE DIRECTORY / AUTH MATRIX"
        editionDate="MULTI-FORMAT ENDPOINTS"
        title="Connected Channels & Health"
        subtitle="Manage authorized publication endpoints across Instagram, Facebook, YouTube, and TikTok."
      />

      {/* Notifications */}
      {successMessage && (
        <div className="mb-6 p-4 bg-semantic-success-bg border border-semantic-success/20 rounded-card flex items-center gap-3 text-xs text-semantic-success font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-semantic-error-bg border border-semantic-error/20 rounded-card flex items-center gap-3 text-xs text-semantic-error font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Security Architecture Badge */}
      <div className="mb-8 p-4 bg-paper-raised border border-border-rule rounded-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-paper-subtle rounded-editorial text-brand-indigo">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-medium text-sm text-ink-primary">
              Multi-Platform Envelope Encryption Active
            </h2>
            <p className="text-xs text-ink-secondary">
              Tokens for Meta, Google, and TikTok are securely vaulted with AES-256-GCM. Client-side code never accesses raw API credentials.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-1 bg-paper-subtle rounded text-ink-secondary">
          AES-256-GCM
        </span>
      </div>

      {/* Active Accounts Grid */}
      <div className="space-y-4 mb-8">
        <h2 className="font-serif font-medium text-lg text-ink-primary">
          Authorized Endpoints ({accounts.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-paper-raised border border-border-rule rounded-card p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-editorial flex items-center justify-center font-bold text-xs text-white ${
                      acc.platform === 'INSTAGRAM'
                        ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
                        : acc.platform === 'FACEBOOK'
                        ? 'bg-[#1877F2]'
                        : acc.platform === 'YOUTUBE'
                        ? 'bg-[#FF0000]'
                        : 'bg-ink-primary'
                    }`}
                  >
                    {acc.platform === 'INSTAGRAM' && 'IG'}
                    {acc.platform === 'FACEBOOK' && 'FB'}
                    {acc.platform === 'YOUTUBE' && 'YT'}
                    {acc.platform === 'TIKTOK' && 'TT'}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-ink-primary leading-tight">
                      {acc.displayName}
                    </h3>
                    <p className="text-xs font-mono text-ink-secondary">{acc.handle}</p>
                  </div>
                </div>

                <StatusTag status={acc.status} />
              </div>

              {/* Capabilities & Scopes */}
              <div className="space-y-1.5 p-3 bg-paper-canvas rounded-editorial text-[11px] font-mono text-ink-secondary border border-border-rule">
                <div>
                  <span className="text-ink-primary font-semibold">Capabilities: </span>
                  <span className="text-brand-indigo font-medium">{acc.capabilities}</span>
                </div>
                <div>
                  <span className="text-ink-primary font-semibold">Token Health: </span>
                  <span>{acc.expiresIn}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border-rule text-xs">
                <span className="text-[10px] font-mono text-ink-secondary">Synced {acc.lastSynced}</span>
                <a
                  href={`/api/connections/${acc.platform === 'INSTAGRAM' || acc.platform === 'FACEBOOK' ? 'meta' : acc.platform.toLowerCase()}/start`}
                  className="px-3 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary font-medium rounded-editorial border border-border-rule transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-ink-secondary" />
                  <span>Re-authenticate</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Endpoints Bar */}
      <div className="p-6 bg-paper-raised border border-border-rule rounded-card">
        <h2 className="font-serif font-medium text-base text-ink-primary mb-2">
          Connect Additional Publication Endpoints
        </h2>
        <p className="text-xs text-ink-secondary mb-4 max-w-xl">
          Authorize Facebook Pages, Instagram Professional accounts, YouTube channels, or TikTok profiles.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/connections/meta/start"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white text-xs font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Meta (Facebook & Instagram)</span>
          </a>

          <a
            href="/api/connections/youtube/start"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white text-xs font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Connect YouTube Channel</span>
          </a>

          <a
            href="/api/connections/tiktok/start"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ink-primary text-white text-xs font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Connect TikTok Account</span>
          </a>
        </div>
      </div>
    </div>
  );
}
