'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Masthead 
} from '@/components/ui/masthead';
import { 
  StatusTag 
} from '@/components/ui/status-tag';
import { 
  ArrowRight, 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Calendar, 
  Library, 
  Film, 
  Camera, 
  TrendingUp, 
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-7">
      <Masthead
        title="Editorial Dispatch Desk"
        subtitle="Upload once. Adapt and publish everywhere across Feed Posts, 24h Stories, and Reels/Shorts."
        folio="SYSTEM DESK / V2.2 STUDIO"
        editionDate="OCTOBER 2026 EDITION"
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Compose New Dispatch</span>
            </Link>
          </div>
        }
      />

      {/* TOP ROW: 4 OPERATIONAL METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Active Channels</span>
            <div className="w-2 h-2 rounded-full bg-semantic-success" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-ink-primary">10</p>
            <span className="text-[10px] font-mono text-semantic-success font-medium">4 Platforms</span>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono">
            IG (2) • FB (3) • YT (2) • TT (2)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Published This Month</span>
            <TrendingUp className="w-3.5 h-3.5 text-brand-indigo" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-ink-primary">28</p>
            <span className="text-[10px] font-mono text-brand-indigo font-semibold">+14% vs Sep</span>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono">
            74 Total Placements Dispatched
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Upcoming in Queue</span>
            <Clock className="w-3.5 h-3.5 text-semantic-info" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-ink-primary">4</p>
            <span className="text-[10px] font-mono text-semantic-info font-medium">Next: 09:15 AM</span>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono">
            Timezone: Asia/Bangkok
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs">
          <div className="flex items-center justify-between text-ink-secondary mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Needs Attention</span>
            <AlertTriangle className="w-3.5 h-3.5 text-accent-terracotta" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif font-bold text-2xl text-accent-terracotta">1</p>
            <Link 
              href="/publishing/queue" 
              className="text-[10px] font-mono text-accent-terracotta hover:underline font-semibold"
            >
              Resolve & Retry →
            </Link>
          </div>
          <p className="text-[10px] text-ink-secondary mt-1 font-mono truncate">
            TikTok 429 Rate Limit (Retry ready)
          </p>
        </div>
      </section>

      {/* 2-COLUMN MAIN BODY: RECENT DISPATCHES + FORMAT MIX */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Multi-Format Dispatches */}
        <div className="lg:col-span-8 bg-paper-raised p-5 rounded-card border border-border-rule shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-rule">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-indigo">[TELEMETRY]</span>
              <h2 className="font-serif font-medium text-base text-ink-primary">Recent Publication Batches</h2>
            </div>
            <Link 
              href="/publishing/queue"
              className="text-xs font-mono text-brand-indigo hover:underline font-medium flex items-center gap-1"
            >
              <span>View Full Queue (4 Jobs)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-border-rule">
            {/* Batch Item 1 */}
            <div className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-medium text-sm text-ink-primary">
                    Behind the Scenes: Studio Redesign Tour
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary">MP-BATCH-892</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-brand-indigo text-white">
                    IG Feed (3 Photos)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent-terracotta text-white">
                    IG Story (24h)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-brand-indigo text-white">
                    FB Page Album
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-semantic-info text-white">
                    YT Shorts (00:58)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <StatusTag status="PARTIALLY_PUBLISHED" />
                <Link
                  href="/publishing/queue"
                  className="text-xs font-mono px-2.5 py-1 bg-paper-subtle hover:bg-paper-canvas text-ink-primary border border-border-rule rounded-editorial transition-colors"
                >
                  Inspect
                </Link>
              </div>
            </div>

            {/* Batch Item 2 */}
            <div className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-medium text-sm text-ink-primary">
                    3 Hooks That Stop the Scroll in 2026
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary">MP-BATCH-890</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-semantic-info text-white">
                    IG Reels (9:16)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent-terracotta text-white">
                    FB Story
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-ink-primary text-white">
                    TikTok Direct
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <StatusTag status="SCHEDULED" />
                <span className="text-[10px] font-mono text-ink-secondary">
                  Today 09:15 AM
                </span>
              </div>
            </div>

            {/* Batch Item 3 */}
            <div className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-medium text-sm text-ink-primary">
                    SaaS Launch Breakdown: Zero to $100k ARR
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary">MP-BATCH-884</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-semantic-info text-white">
                    YouTube Main (14.8k)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-brand-indigo text-white">
                    Facebook Video
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <StatusTag status="PUBLISHED" />
                <a
                  href="https://youtu.be/dQw4w9WgXcQ"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono px-2 py-1 bg-paper-subtle hover:bg-paper-canvas text-ink-primary border border-border-rule rounded-editorial inline-flex items-center gap-1 transition-colors"
                >
                  <span>Live</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Format Distribution Mix */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-paper-raised p-5 rounded-card border border-border-rule shadow-xs space-y-4">
            <div className="pb-2 border-b border-border-rule">
              <span className="font-mono text-xs font-bold text-brand-indigo">[FORMAT ANALYTICS]</span>
              <h2 className="font-serif font-medium text-sm text-ink-primary mt-0.5">
                Multi-Placement Distribution Mix
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-indigo" />
                    Feed Posts & Carousels
                  </span>
                  <span className="font-semibold text-brand-indigo">45% (33 jobs)</span>
                </div>
                <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-brand-indigo rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-terracotta" />
                    24h Ephemeral Stories
                  </span>
                  <span className="font-semibold text-accent-terracotta">35% (26 jobs)</span>
                </div>
                <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-accent-terracotta rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-ink-primary flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-semantic-info" />
                    Reels, Shorts & Video
                  </span>
                  <span className="font-semibold text-semantic-info">20% (15 jobs)</span>
                </div>
                <div className="w-full h-2 bg-paper-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-semantic-info rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-ink-secondary font-mono pt-2 border-t border-border-rule">
              Simultaneous multi-placement active: 78% of image assets published to both Feed and Story.
            </p>
          </div>

          {/* Quick Studio Shortcuts */}
          <div className="bg-paper-raised p-4 rounded-card border border-border-rule shadow-2xs space-y-2">
            <span className="text-[10px] font-mono uppercase text-ink-secondary font-bold block mb-2">
              Studio Quick Jump
            </span>

            <Link
              href="/create"
              className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2 text-ink-primary">
                <Plus className="w-4 h-4 text-brand-indigo" />
                <span>Create New Post / Story</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-ink-secondary" />
            </Link>

            <Link
              href="/calendar"
              className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2 text-ink-primary">
                <Calendar className="w-4 h-4 text-accent-terracotta" />
                <span>Editorial Calendar</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-ink-secondary" />
            </Link>

            <Link
              href="/accounts"
              className="flex items-center justify-between p-2.5 bg-paper-canvas hover:bg-paper-subtle border border-border-rule rounded-editorial text-xs font-medium transition-colors"
            >
              <div className="flex items-center gap-2 text-ink-primary">
                <Share2 className="w-4 h-4 text-semantic-info" />
                <span>Connected Channels (10)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-ink-secondary" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
