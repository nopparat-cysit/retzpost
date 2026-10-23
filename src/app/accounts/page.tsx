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
      id: 'acc-yt-1',
      platform: 'YOUTUBE' as const,
      displayName: 'Alex Rivera Studio',
      handle: '@AlexRiveraStudio',
      channelId: 'UC_x65aB891F_Live',
      status: 'CONNECTED' as const,
      scopes: ['youtube.upload', 'youtube.readonly'],
      expiresIn: 'Expires in 6 days (Auto-refreshed via Token Vault)',
      capabilities: 'Max Video Duration: 12h • Resumable Uploads Supported',
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
      expiresIn: 'Active Access Token',
      capabilities: 'Max Video Duration: 10m (600s) • Privacy Configurable',
      lastSynced: '1 hour ago',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="WORKSPACE DIRECTORY / AUTH MATRIX"
        editionDate="VOL. 26"
        title="Connected Channels & Health"
        subtitle="Manage authorized social publication endpoints, OAuth credentials, and token validity."
      />

      {/* Callback Notifications */}
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
              Envelope Token Encryption Active
            </h2>
            <p className="text-xs text-ink-secondary">
              OAuth tokens are encrypted at rest with AES-256-GCM. Credentials never leak to frontend bundles or client logs.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-1 bg-paper-subtle rounded text-ink-secondary">
          Key Version: v1
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
                      acc.platform === 'YOUTUBE' ? 'bg-[#FF0000]' : 'bg-ink-primary'
                    }`}
                  >
                    {acc.platform === 'YOUTUBE' ? 'YT' : 'TT'}
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

              {/* Account Capabilities & Details */}
              <div className="space-y-1.5 p-3 bg-paper-canvas rounded-editorial text-[11px] font-mono text-ink-secondary border border-border-rule">
                <div>
                  <span className="text-ink-primary font-semibold">Capabilities: </span>
                  <span>{acc.capabilities}</span>
                </div>
                <div>
                  <span className="text-ink-primary font-semibold">Token Health: </span>
                  <span>{acc.expiresIn}</span>
                </div>
                <div>
                  <span className="text-ink-primary font-semibold">Granted Scopes: </span>
                  <span>{acc.scopes.join(', ')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border-rule text-xs">
                <span className="text-[10px] font-mono text-ink-secondary">Synced {acc.lastSynced}</span>
                <a
                  href={`/api/connections/${acc.platform.toLowerCase()}/start`}
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

      {/* Connect New Channel Actions */}
      <div className="p-6 bg-paper-raised border border-border-rule rounded-card">
        <h2 className="font-serif font-medium text-base text-ink-primary mb-2">
          Connect Additional Distribution Endpoints
        </h2>
        <p className="text-xs text-ink-secondary mb-4 max-w-xl">
          Authenticate new YouTube channels or TikTok accounts using official OAuth 2.0 protocols.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/connections/youtube/start"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white text-xs font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Connect YouTube Channel</span>
          </a>

          <button
            onClick={() => alert('TikTok OAuth configuration is ready in Phase 6.')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-ink-primary text-white text-xs font-semibold rounded-editorial hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Connect TikTok Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
