'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Clock, 
  Bell, 
  Key, 
  CheckCircle2, 
  Save, 
  Palette,
  Sliders,
  Globe
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

export default function SettingsPage() {
  const [defaultTimezone, setDefaultTimezone] = useState('Asia/Bangkok');
  const [autoFrameStories, setAutoFrameStories] = useState(true);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState('4');
  const [emailAlertsOnFailure, setEmailAlertsOnFailure] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Masthead
        folio="WORKSPACE PREFERENCES / ENGINE CONFIG"
        editionDate="SYSTEM DEFAULTS"
        title="Workspace Settings"
        subtitle="Configure editorial automation rules, default dispatch timezone, and failure alerts."
      />

      {saveSuccess && (
        <div className="mb-6 p-3.5 bg-semantic-success-bg border border-semantic-success/20 rounded-card flex items-center gap-2.5 text-xs text-semantic-success font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Workspace preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SECTION 1: EDITORIAL CADENCE & TIMEZONE */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-rule">
            <Clock className="w-4 h-4 text-brand-indigo" />
            <h2 className="font-serif font-medium text-base text-ink-primary">
              Scheduling & Default Timezone
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-secondary mb-1">
                Primary Publication Timezone
              </label>
              <select
                value={defaultTimezone}
                onChange={(e) => setDefaultTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo"
              >
                <option value="Asia/Bangkok">Asia/Bangkok (UTC+7, Indochina)</option>
                <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                <option value="Europe/London">Europe/London (UTC+0 / BST)</option>
                <option value="America/New_York">America/New_York (EST / EDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT)</option>
              </select>
              <p className="text-[10px] text-ink-secondary mt-1">
                All scheduled dispatches default to this wall-clock reference.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-ink-secondary mb-1">
                Retry Engine Policy
              </label>
              <select
                value={maxRetryAttempts}
                onChange={(e) => setMaxRetryAttempts(e.target.value)}
                className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo"
              >
                <option value="3">3 Attempts with Exponential Backoff</option>
                <option value="4">4 Attempts (Default: 1m, 5m, 15m, 1h)</option>
                <option value="5">5 Attempts (Aggressive Resiliency)</option>
              </select>
              <p className="text-[10px] text-ink-secondary mt-1">
                Applies when TikTok or Meta returns transient 429 Rate Limits.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: MULTI-FORMAT MEDIA AUTOMATION */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-rule">
            <Sliders className="w-4 h-4 text-accent-terracotta" />
            <h2 className="font-serif font-medium text-base text-ink-primary">
              Media Adaptation & Format Defaults
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-paper-canvas border border-border-rule rounded-editorial cursor-pointer hover:border-border-strong transition-colors">
              <input
                type="checkbox"
                checked={autoFrameStories}
                onChange={(e) => setAutoFrameStories(e.target.checked)}
                className="mt-0.5 rounded text-accent-terracotta focus:ring-accent-terracotta"
              />
              <div>
                <span className="font-semibold text-ink-primary block">
                  Automatic 9:16 Canvas Padding for 24h Stories
                </span>
                <span className="text-[11px] text-ink-secondary block mt-0.5">
                  When a horizontal (16:9) or square (1:1) photo is dispatched to Instagram/Facebook Stories, automatically generate an editorial canvas border with color extraction to prevent awkward platform cropping.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-paper-canvas border border-border-rule rounded-editorial cursor-pointer hover:border-border-strong transition-colors">
              <input
                type="checkbox"
                checked={emailAlertsOnFailure}
                onChange={(e) => setEmailAlertsOnFailure(e.target.checked)}
                className="mt-0.5 rounded text-brand-indigo focus:ring-brand-indigo"
              />
              <div>
                <span className="font-semibold text-ink-primary block">
                  Failure Telemetry & Incident Alerts
                </span>
                <span className="text-[11px] text-ink-secondary block mt-0.5">
                  Notify editors immediately if a dispatch batch enters `FAILED_RETRYABLE` or `FAILED_FINAL` state.
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* SECTION 3: TOKEN VAULT SECURITY */}
        <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-border-rule">
            <ShieldCheck className="w-4 h-4 text-semantic-success" />
            <h2 className="font-serif font-medium text-base text-ink-primary">
              Security & Token Vault (AES-256-GCM)
            </h2>
          </div>

          <div className="flex items-center justify-between p-3 bg-paper-canvas border border-border-rule rounded-editorial">
            <div>
              <p className="font-semibold text-ink-primary">Master Vault Encryption Status</p>
              <p className="text-[11px] font-mono text-ink-secondary mt-0.5">
                Application-level AES-256-GCM authenticated cipher with 96-bit unique IVs.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-semantic-success/10 text-semantic-success border border-semantic-success/20 font-semibold">
              ✓ Active & Guarded
            </span>
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-medium text-xs rounded-editorial shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
