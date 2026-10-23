'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  UploadCloud, 
  Filter, 
  Search 
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { StatusTag } from '@/components/ui/status-tag';
import { JobStatus } from '@/modules/publishing/state-machine';

interface QueueJobItem {
  id: string;
  platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
  format: 'FEED_POST' | 'STORY' | 'VIDEO_REEL';
  handle: string;
  storyTitle: string;
  durationOrFormatText: string;
  status: JobStatus;
  attemptCount: number;
  maxAttempts: number;
  scheduledOrExecutedAt: string;
  liveUrl?: string;
  errorSafeMessage?: string;
}

const SAMPLE_QUEUE_JOBS: QueueJobItem[] = [
  {
    id: 'MP-JOB-1053',
    platform: 'INSTAGRAM',
    format: 'FEED_POST',
    handle: '@alexrivera_official',
    storyTitle: 'Omni-Format Publishing: Simultaneous Feed & Story',
    durationOrFormatText: 'Carousel (2 Photos)',
    status: 'PUBLISHED',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Just now',
    liveUrl: 'https://instagram.com/p/example-carousel',
  },
  {
    id: 'MP-JOB-1054',
    platform: 'INSTAGRAM',
    format: 'STORY',
    handle: '@alexrivera_official',
    storyTitle: 'Omni-Format Publishing: Simultaneous Feed & Story',
    durationOrFormatText: '24h Ephemeral + Link Sticker',
    status: 'PUBLISHED',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Just now',
    liveUrl: 'https://instagram.com/stories/alexrivera_official',
  },
  {
    id: 'MP-JOB-1049',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    handle: '@AlexRiveraStudio',
    storyTitle: 'Behind the Scenes: Studio Redesign Tour',
    durationOrFormatText: 'Shorts • 00:58',
    status: 'PUBLISHED',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 09:15 AM',
    liveUrl: 'https://youtu.be/dQw4w9WgXcQ',
  },
  {
    id: 'MP-JOB-1050',
    platform: 'TIKTOK',
    format: 'VIDEO_REEL',
    handle: '@alexrivera_official',
    storyTitle: 'Behind the Scenes: Studio Redesign Tour',
    durationOrFormatText: 'Direct Post • 00:58',
    status: 'FAILED_RETRYABLE',
    attemptCount: 2,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 09:16 AM',
    errorSafeMessage: 'TikTok returned rate limit. Scheduled auto-retry in 5 minutes.',
  },
  {
    id: 'MP-JOB-1051',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    handle: 'Alex Rivera Studio',
    storyTitle: 'The Modern Creator Ledger: How We Produce 83 Dispatches',
    durationOrFormatText: 'Photo Album (4)',
    status: 'PROCESSING',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Just now',
  },
  {
    id: 'MP-JOB-1052',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    handle: '@AlexClips',
    storyTitle: '3 Hooks That Stop the Scroll in 2026',
    durationOrFormatText: 'Shorts • 00:45',
    status: 'SCHEDULED',
    attemptCount: 0,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Tomorrow 09:00 AM (UTC+7)',
  },
];

export default function PublishingQueuePage() {
  const [filterTab, setFilterTab] = useState<'ALL' | 'IN_FLIGHT' | 'COMPLETED' | 'FAILED'>('ALL');
  const [jobs, setJobs] = useState<QueueJobItem[]>(SAMPLE_QUEUE_JOBS);

  const handleRetry = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'QUEUED', attemptCount: j.attemptCount + 1 } : j))
    );
  };

  const filteredJobs = jobs.filter((j) => {
    if (filterTab === 'IN_FLIGHT') return ['QUEUED', 'UPLOADING', 'PROCESSING'].includes(j.status);
    if (filterTab === 'COMPLETED') return ['PUBLISHED', 'SENT_TO_INBOX'].includes(j.status);
    if (filterTab === 'FAILED') return ['FAILED_RETRYABLE', 'FAILED_FINAL', 'REVOKED'].includes(j.status);
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="OPERATIONAL QUEUE / TELEMETRY DESK"
        editionDate="DISPATCH FEED"
        title="Publishing Queue & Job Telemetry"
        subtitle="Inspect active multi-placement dispatches across Feed, Stories, and Reels/Shorts with real-time retry engine."
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border-rule text-xs">
        <div className="flex items-center gap-1 bg-paper-subtle p-1 rounded-editorial border border-border-rule">
          {(['ALL', 'IN_FLIGHT', 'COMPLETED', 'FAILED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
                filterTab === tab
                  ? 'bg-paper-canvas text-brand-indigo shadow-xs font-semibold'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-ink-secondary">
          {filteredJobs.length} Monitored Jobs
        </span>
      </div>

      {/* Queue Table */}
      <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-subtle border-b border-border-rule font-mono text-[10px] text-ink-secondary uppercase">
              <tr>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Destination & Format</th>
                <th className="py-3 px-4">Payload Story</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4 text-right">Result & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-rule">
              {filteredJobs.map((job) => {
                let badgeBg = 'bg-brand-indigo';
                let badgeText = 'Feed';
                if (job.format === 'STORY') {
                  badgeBg = 'bg-accent-terracotta';
                  badgeText = 'Story';
                } else if (job.format === 'VIDEO_REEL') {
                  badgeBg = 'bg-semantic-info';
                  badgeText = 'Reel/Shorts';
                }

                return (
                  <tr key={job.id} className="hover:bg-paper-subtle/50 transition-colors">
                    {/* Job ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-ink-secondary text-[11px]">
                      {job.id}
                    </td>

                    {/* Destination & Format */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-editorial flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${
                            job.platform === 'INSTAGRAM'
                              ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
                              : job.platform === 'FACEBOOK'
                              ? 'bg-[#1877F2]'
                              : job.platform === 'YOUTUBE'
                              ? 'bg-[#FF0000]'
                              : 'bg-ink-primary'
                          }`}
                        >
                          {job.platform === 'INSTAGRAM' ? 'IG' : job.platform === 'FACEBOOK' ? 'FB' : job.platform === 'YOUTUBE' ? 'YT' : 'TT'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-ink-primary text-xs truncate max-w-[140px] font-semibold">
                              {job.handle}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono text-white font-medium ${badgeBg}`}>
                              {badgeText}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-ink-secondary block">
                            {job.durationOrFormatText}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Master Story Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-serif font-medium text-ink-primary text-xs truncate">
                        {job.storyTitle}
                      </p>
                      <span className="text-[10px] font-mono text-ink-secondary">
                        {job.scheduledOrExecutedAt}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusTag status={job.status} />
                      {job.errorSafeMessage && (
                        <p className="mt-1 text-[10px] text-semantic-warning font-sans leading-tight max-w-xs">
                          {job.errorSafeMessage}
                        </p>
                      )}
                    </td>

                    {/* Attempts */}
                    <td className="py-3.5 px-4 font-mono text-ink-secondary text-xs">
                      {job.attemptCount} / {job.maxAttempts}
                    </td>

                    {/* Actions / Live Links */}
                    <td className="py-3.5 px-4 text-right">
                      {job.status === 'PUBLISHED' && job.liveUrl && (
                        <a
                          href={job.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-brand-indigo hover:text-brand-indigo-hover hover:underline"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {job.status === 'FAILED_RETRYABLE' && (
                        <button
                          onClick={() => handleRetry(job.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-accent-terracotta hover:bg-accent-terracotta/10 rounded border border-accent-terracotta/30 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry Now</span>
                        </button>
                      )}

                      {job.status === 'SCHEDULED' && (
                        <span className="font-mono text-ink-secondary text-[11px]">
                          Pending Clock
                        </span>
                      )}

                      {job.status === 'PROCESSING' && (
                        <span className="inline-flex items-center gap-1 font-mono text-semantic-info text-[11px]">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Streaming</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
