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
  platform: 'YOUTUBE' | 'TIKTOK';
  handle: string;
  storyTitle: string;
  duration: string;
  status: JobStatus;
  attemptCount: number;
  maxAttempts: number;
  scheduledOrExecutedAt: string;
  liveUrl?: string;
  errorSafeMessage?: string;
}

const SAMPLE_QUEUE_JOBS: QueueJobItem[] = [
  {
    id: 'MP-JOB-1049',
    platform: 'YOUTUBE',
    handle: '@AlexRiveraStudio',
    storyTitle: 'Behind the Scenes: Studio Redesign Tour',
    duration: '00:58',
    status: 'PUBLISHED',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 09:15 AM',
    liveUrl: 'https://youtu.be/dQw4w9WgXcQ',
  },
  {
    id: 'MP-JOB-1050',
    platform: 'TIKTOK',
    handle: '@alexrivera_official',
    storyTitle: 'Behind the Scenes: Studio Redesign Tour',
    duration: '00:58',
    status: 'FAILED_RETRYABLE',
    attemptCount: 2,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 09:16 AM',
    errorSafeMessage: 'TikTok returned rate limit. Scheduled retry in 5 minutes.',
  },
  {
    id: 'MP-JOB-1051',
    platform: 'YOUTUBE',
    handle: '@AlexRiveraStudio',
    storyTitle: 'The Modern Creator Ledger: How We Produce 83 Dispatches',
    duration: '00:58',
    status: 'PROCESSING',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Just now',
  },
  {
    id: 'MP-JOB-1052',
    platform: 'YOUTUBE',
    handle: '@AlexRiveraStudio',
    storyTitle: '3 Hooks That Stop the Scroll in 2026',
    duration: '00:45',
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="OPERATIONAL QUEUE / TELEMETRY DESK"
        editionDate="DISPATCH FEED"
        title="Publishing Queue & Job Telemetry"
        subtitle="Inspect active chunked upload sessions, pending schedules, and remote platform reconciliation records."
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border-rule text-xs font-mono">
        <div className="flex items-center gap-2">
          {(['ALL', 'IN_FLIGHT', 'COMPLETED', 'FAILED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-editorial transition-colors ${
                filterTab === tab
                  ? 'bg-paper-raised text-brand-indigo font-bold border border-border-rule shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-ink-secondary">
          {jobs.length} Monitored Jobs
        </span>
      </div>

      {/* Queue Table */}
      <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-subtle border-b border-border-rule font-mono text-[10px] text-ink-secondary uppercase">
              <tr>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Payload Story</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4 text-right">Result & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-rule">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-paper-subtle/50 transition-colors">
                  {/* Job ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-ink-secondary text-[11px]">
                    {job.id}
                  </td>

                  {/* Destination */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-editorial flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${
                          job.platform === 'YOUTUBE' ? 'bg-[#FF0000]' : 'bg-ink-primary'
                        }`}
                      >
                        {job.platform === 'YOUTUBE' ? 'YT' : 'TT'}
                      </div>
                      <span className="font-mono text-ink-primary text-xs truncate max-w-[140px]">
                        {job.handle}
                      </span>
                    </div>
                  </td>

                  {/* Master Story Title */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-serif font-medium text-ink-primary text-xs truncate">
                      {job.storyTitle}
                    </p>
                    <span className="text-[10px] font-mono text-ink-secondary">
                      {job.duration} • {job.scheduledOrExecutedAt}
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-paper-canvas text-brand-indigo font-semibold rounded-editorial border border-border-rule hover:bg-paper-subtle text-xs"
                      >
                        <span>Open Video</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {job.status === 'FAILED_RETRYABLE' && (
                      <button
                        onClick={() => handleRetry(job.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-indigo text-white font-medium rounded-editorial hover:bg-brand-indigo-hover text-xs shadow-xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}

                    {job.status === 'PROCESSING' && (
                      <span className="text-[11px] font-mono text-semantic-warning flex items-center justify-end gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Processing</span>
                      </span>
                    )}

                    {job.status === 'SCHEDULED' && (
                      <span className="text-[11px] font-mono text-ink-secondary">
                        Waiting Due Time
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
