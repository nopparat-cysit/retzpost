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
  Search,
  Download,
  FileSpreadsheet,
  Copy,
  Check,
  X,
  Eye,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';
import { StatusTag } from '@/components/ui/status-tag';
import { 
  SocialPlatformIcon, 
  SocialMediaLiveButton, 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  TikTokLogo 
} from '@/components/ui/social-icons';
import { JobStatus } from '@/modules/publishing/state-machine';
import { 
  generateErrorLogCsv, 
  generateAllDispatchesCsv, 
  downloadCsvFile,
  ExportableJob 
} from '@/modules/publishing/export-csv';

interface QueueJobItem extends ExportableJob {
  id: string;
  platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
  format: 'FEED_POST' | 'STORY' | 'VIDEO_REEL';
  handle: string;
  storyTitle: string;
  durationOrFormatText: string;
  status: JobStatus | 'PENDING_REVIEW' | 'NEEDS_REVISION';
  attemptCount: number;
  maxAttempts: number;
  scheduledOrExecutedAt: string;
  liveUrl?: string;
  errorSafeMessage?: string;
  errorCode?: string;
  submittedBy?: string;
  stickyFeedback?: string;
}

const INITIAL_QUEUE_JOBS: QueueJobItem[] = [
  {
    id: 'MP-JOB-1060',
    platform: 'TIKTOK',
    format: 'VIDEO_REEL',
    handle: '@alexrivera_official',
    storyTitle: 'Behind The Scenes: Ultra-Wide Loft Renovation Tour',
    durationOrFormatText: '9:16 Video (00:48)',
    status: 'PENDING_REVIEW',
    attemptCount: 0,
    maxAttempts: 3,
    scheduledOrExecutedAt: 'Today 07:30 PM (Peak)',
    submittedBy: 'Nicha (Content Intern)',
  },
  {
    id: 'MP-JOB-1061',
    platform: 'INSTAGRAM',
    format: 'STORY',
    handle: '@capitalonerealestate',
    storyTitle: 'Weekend Open House VIP Registration Promo',
    durationOrFormatText: '24h Story + Link',
    status: 'NEEDS_REVISION',
    attemptCount: 0,
    maxAttempts: 3,
    scheduledOrExecutedAt: 'Tomorrow 12:15 PM',
    submittedBy: 'Pete (Junior Creator)',
    stickyFeedback: 'ภาพสไลด์แรกตัวหนังสือกลืนกับพื้นหลัง โปรดใส่แถบสีทึบหรือขยายขนาดฟอนต์ให้อ่านง่ายบนมือถือ',
  },
  {
    id: 'MP-JOB-1055',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    handle: 'Oknus Real Estate',
    storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    durationOrFormatText: 'Photo Album (6)',
    status: 'FAILED_FINAL',
    attemptCount: 4,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 08:30 AM',
    errorCode: 'OAUTH_190_463',
    errorSafeMessage: 'Facebook Graph API OAuthException: Session has expired or user changed password (Code: 190, Subcode: 463). Re-authentication required for Oknus Real Estate.',
  },
  {
    id: 'MP-JOB-1056',
    platform: 'INSTAGRAM',
    format: 'STORY',
    handle: 'thailandprop.c1',
    storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    durationOrFormatText: '24h Story + Link',
    status: 'FAILED_RETRYABLE',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 08:30 AM',
    errorCode: 'META_ASPECT_RATIO_INVALID',
    errorSafeMessage: 'Meta Media Upload API: Invalid aspect ratio for Story sticker. Media was delivered in 1:1 square instead of vertical 9:16.',
  },
  {
    id: 'MP-JOB-1057',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    handle: 'Capital One Real Estate Thailand',
    storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    durationOrFormatText: 'Photo Album (6)',
    status: 'PUBLISHED',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 08:30 AM',
    liveUrl: 'https://facebook.com/capitalonethailand/posts/991283',
  },
  {
    id: 'MP-JOB-1058',
    platform: 'INSTAGRAM',
    format: 'FEED_POST',
    handle: 'capitalonerealestate',
    storyTitle: 'The Rich Rama 9-Srinakarin Luxury 2-Bed Unit',
    durationOrFormatText: 'Carousel (6)',
    status: 'PUBLISHED',
    attemptCount: 1,
    maxAttempts: 4,
    scheduledOrExecutedAt: 'Today 08:30 AM',
    liveUrl: 'https://instagram.com/p/C1RichRama9',
  },
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
    scheduledOrExecutedAt: 'Today 09:00 AM',
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
    scheduledOrExecutedAt: 'Today 09:00 AM',
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
    errorCode: 'TIKTOK_RATE_LIMIT_429',
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
  const [filterTab, setFilterTab] = useState<'ALL' | 'REVIEW' | 'IN_FLIGHT' | 'COMPLETED' | 'FAILED'>('ALL');
  const [jobs, setJobs] = useState<QueueJobItem[]>(INITIAL_QUEUE_JOBS);
  const [selectedErrorJob, setSelectedErrorJob] = useState<QueueJobItem | null>(null);
  const [selectedReviewJob, setSelectedReviewJob] = useState<QueueJobItem | null>(null);
  const [managerNoteInput, setManagerNoteInput] = useState<string>('');
  const [managerActionNotice, setManagerActionNotice] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleRetry = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'QUEUED', attemptCount: j.attemptCount + 1 } : j))
    );
  };

  const handleRetryAllFailed = () => {
    setJobs((prev) =>
      prev.map((j) =>
        ['FAILED_RETRYABLE', 'FAILED_FINAL'].includes(j.status)
          ? { ...j, status: 'QUEUED', attemptCount: j.attemptCount + 1 }
          : j
      )
    );
  };

  const handleApproveJob = (jobId: string) => {
    const target = jobs.find((j) => j.id === jobId);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'SCHEDULED', stickyFeedback: undefined } : j))
    );
    setSelectedReviewJob(null);
    setManagerActionNotice(`✓ อนุมัติโพสต์ "${target?.storyTitle || jobId}" และจัดคิวเผยแพร่เรียบร้อยแล้ว`);
    setTimeout(() => setManagerActionNotice(null), 4000);
  };

  const handleRequestChanges = (jobId: string) => {
    const target = jobs.find((j) => j.id === jobId);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'NEEDS_REVISION', stickyFeedback: managerNoteInput } : j))
    );
    setSelectedReviewJob(null);
    setManagerActionNotice(`↩ ส่งโพสต์ "${target?.storyTitle || jobId}" กลับให้ครีเอเตอร์แก้ไขพร้อมแนบโน้ตแล้ว`);
    setTimeout(() => setManagerActionNotice(null), 4000);
  };

  const reviewCount = jobs.filter((j) => ['PENDING_REVIEW', 'NEEDS_REVISION'].includes(j.status)).length;
  const failedJobsCount = jobs.filter((j) =>
    ['FAILED_RETRYABLE', 'FAILED_FINAL', 'REVOKED'].includes(j.status) || Boolean(j.errorSafeMessage)
  ).length;

  const inFlightCount = jobs.filter((j) => ['QUEUED', 'UPLOADING', 'PROCESSING', 'SCHEDULED'].includes(j.status)).length;
  const completedCount = jobs.filter((j) => ['PUBLISHED', 'SENT_TO_INBOX'].includes(j.status)).length;

  const filteredJobs = jobs.filter((j) => {
    if (filterTab === 'REVIEW') return ['PENDING_REVIEW', 'NEEDS_REVISION'].includes(j.status);
    if (filterTab === 'IN_FLIGHT') return ['QUEUED', 'UPLOADING', 'PROCESSING', 'SCHEDULED'].includes(j.status);
    if (filterTab === 'COMPLETED') return ['PUBLISHED', 'SENT_TO_INBOX'].includes(j.status);
    if (filterTab === 'FAILED') return ['FAILED_RETRYABLE', 'FAILED_FINAL', 'REVOKED'].includes(j.status);
    return true;
  });

  const handleExportErrorCsv = () => {
    const csvContent = generateErrorLogCsv(jobs);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `RetzPost_Error_Log_${dateStr}.csv`;
    downloadCsvFile(csvContent, filename);
    setDownloadNotice(`Exported ${failedJobsCount} error records to ${filename}`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleExportAllCsv = () => {
    const csvContent = generateAllDispatchesCsv(jobs);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `RetzPost_All_Dispatches_${dateStr}.csv`;
    downloadCsvFile(csvContent, filename);
    setDownloadNotice(`Exported all ${jobs.length} dispatch jobs to ${filename}`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const handleCopyErrorDetails = (job: QueueJobItem) => {
    const text = `[RetzPost Dispatch Error Diagnostic]\nJob ID: ${job.id}\nPlatform: ${job.platform} (${job.format})\nHandle: ${job.handle}\nTitle: ${job.storyTitle}\nStatus: ${job.status}\nError Code: ${job.errorCode || 'N/A'}\nMessage: ${job.errorSafeMessage}\nAttempts: ${job.attemptCount}/${job.maxAttempts}\nTimestamp: ${job.scheduledOrExecutedAt}`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <Masthead
        folio="OPERATIONAL QUEUE / TELEMETRY DESK"
        editionDate="DISPATCH FEED"
        title="Publishing Queue & Job Telemetry"
        subtitle="Inspect active multi-placement dispatches across Feed, Stories, and Reels/Shorts with real-time retry engine and error auditing."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportErrorCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-terracotta/10 hover:bg-accent-terracotta/20 text-accent-terracotta border border-accent-terracotta/30 text-xs font-mono font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Error Log (CSV)</span>
              {failedJobsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-[9px] font-bold">
                  {failedJobsCount}
                </span>
              )}
            </button>
            <button
              onClick={handleExportAllCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary border border-border-rule text-xs font-mono font-medium rounded-editorial transition-colors shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-ink-secondary" />
              <span>Export All Jobs</span>
            </button>
          </div>
        }
      />

      {/* MANAGER ACTION NOTICE */}
      {managerActionNotice && (
        <div className="bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo px-4 py-2.5 rounded-editorial flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-indigo" />
            <span>{managerActionNotice}</span>
          </div>
          <button onClick={() => setManagerActionNotice(null)} className="hover:opacity-75 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* DOWNLOAD TOAST / NOTIFICATION */}
      {downloadNotice && (
        <div className="bg-semantic-success/10 border border-semantic-success/30 text-semantic-success px-4 py-2.5 rounded-editorial flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button onClick={() => setDownloadNotice(null)} className="hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* OPERATIONAL ATTENTION BANNER */}
      {failedJobsCount > 0 && (
        <div className="bg-paper-raised border-l-4 border-accent-terracotta p-4 rounded-card border-r border-t border-b border-border-rule shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-medium text-sm text-ink-primary">
                  {failedJobsCount} Dispatches Require Operational Attention
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-terracotta/15 text-accent-terracotta font-semibold">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5 font-sans leading-relaxed">
                Token revokation on Facebook (<span className="font-mono text-ink-primary font-medium">Oknus Real Estate</span>) & aspect ratio mismatch on Instagram Story (<span className="font-mono text-ink-primary font-medium">thailandprop.c1</span>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={handleExportErrorCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-canvas hover:bg-paper-subtle text-accent-terracotta border border-accent-terracotta/40 rounded-editorial text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Error CSV</span>
            </button>
            <button
              onClick={handleRetryAllFailed}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-terracotta text-white hover:bg-accent-terracotta/90 rounded-editorial text-xs font-mono font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry All Failed</span>
            </button>
          </div>
        </div>
      )}

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border-rule text-xs">
        <div className="flex items-center gap-1 bg-paper-subtle p-1 rounded-editorial border border-border-rule overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Jobs', count: jobs.length },
            { id: 'REVIEW', label: 'Needs Review', count: reviewCount },
            { id: 'IN_FLIGHT', label: 'In-Flight', count: inFlightCount },
            { id: 'COMPLETED', label: 'Completed', count: completedCount },
            { id: 'FAILED', label: 'Failed / Needs Attention', count: failedJobsCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors shrink-0 cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-paper-canvas text-brand-indigo shadow-xs font-semibold'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] ${
                  filterTab === tab.id
                    ? tab.id === 'FAILED'
                      ? 'bg-accent-terracotta text-white'
                      : tab.id === 'REVIEW'
                      ? 'bg-accent-terracotta text-white'
                      : 'bg-brand-indigo text-white'
                    : 'bg-border-rule text-ink-secondary'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-ink-secondary">
          <span>Showing {filteredJobs.length} of {jobs.length} Monitored Dispatches</span>
        </div>
      </div>

      {/* QUEUE TABLE */}
      <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-subtle border-b border-border-rule font-mono text-[10px] text-ink-secondary uppercase">
              <tr>
                <th className="py-3 px-4 min-w-[105px]">Job ID</th>
                <th className="py-3 px-4 min-w-[200px]">Destination & Format</th>
                <th className="py-3 px-4 min-w-[240px]">Payload Story</th>
                <th className="py-3 px-4 min-w-[170px]">Status & Diagnostics</th>
                <th className="py-3 px-4 min-w-[85px]">Attempts</th>
                <th className="py-3 px-4 min-w-[190px] text-right">Result & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-rule">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-secondary font-mono text-xs">
                    No dispatches matching filter "{filterTab}".
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  let badgeBg = 'bg-brand-indigo';
                  let badgeText = 'Feed';
                  if (job.format === 'STORY') {
                    badgeBg = 'bg-accent-terracotta';
                    badgeText = '24h Story';
                  } else if (job.format === 'VIDEO_REEL') {
                    badgeBg = 'bg-semantic-info';
                    badgeText = 'Reel/Shorts';
                  }

                  const isFailed = ['FAILED_RETRYABLE', 'FAILED_FINAL', 'REVOKED'].includes(job.status);

                  return (
                    <tr 
                      key={job.id} 
                      className={`hover:bg-paper-subtle/50 transition-colors ${isFailed ? 'bg-accent-terracotta/[0.02]' : ''}`}
                    >
                      {/* Job ID */}
                      <td className="py-3.5 px-4 font-mono font-medium text-ink-secondary text-[11px] align-top">
                        <span>{job.id}</span>
                        {job.errorCode && (
                          <span className="block text-[9px] text-accent-terracotta font-mono mt-0.5">
                            {job.errorCode}
                          </span>
                        )}
                      </td>

                      {/* Destination & Format */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-start gap-2.5">
                          <SocialPlatformIcon platform={job.platform} format={job.format} size={24} className="mt-0.5 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-ink-primary text-xs truncate max-w-[150px] font-semibold">
                                {job.handle}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono text-white font-medium ${badgeBg}`}>
                                {badgeText}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
                              {job.durationOrFormatText}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Master Story Title */}
                      <td className="py-3.5 px-4 max-w-xs align-top">
                        <p className="font-serif font-medium text-ink-primary text-xs truncate">
                          {job.storyTitle}
                        </p>
                        <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
                          {job.scheduledOrExecutedAt}
                        </span>
                        {job.stickyFeedback && (
                          <div className="mt-2 p-2.5 bg-[#FFFDE7] border border-[#FBC02D]/70 rounded-editorial text-[10px] text-[#4A4000] font-sans flex items-start gap-1.5 shadow-2xs">
                            <span className="shrink-0 text-xs">📌</span>
                            <span className="leading-relaxed"><strong>โน้ตแก้ไข:</strong> {job.stickyFeedback}</span>
                          </div>
                        )}
                      </td>

                      {/* Status & Error Diagnostics */}
                      <td className="py-3.5 px-4 max-w-sm align-top">
                        <StatusTag status={job.status} />
                        {job.errorSafeMessage && (
                          <div className="mt-1.5 p-2 bg-paper-canvas border border-accent-terracotta/20 rounded text-[10px] text-ink-primary leading-tight font-sans">
                            <p className="text-accent-terracotta font-medium line-clamp-2">
                              {job.errorSafeMessage}
                            </p>
                            <button
                              onClick={() => setSelectedErrorJob(job)}
                              className="inline-flex items-center gap-1 mt-1 font-mono text-[9px] text-brand-indigo hover:underline font-semibold cursor-pointer"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              <span>Inspect Details</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Attempts */}
                      <td className="py-3.5 px-4 font-mono text-ink-secondary text-xs align-top">
                        {job.attemptCount} / {job.maxAttempts}
                      </td>

                      {/* Actions / Live Links */}
                      <td className="py-3.5 px-4 text-right align-top min-w-[190px]">
                        {(job.status === 'PENDING_REVIEW' || job.status === 'NEEDS_REVISION') && (
                          <div className="flex flex-col items-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedReviewJob(job);
                                setManagerNoteInput(job.stickyFeedback || '');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial transition-all shadow-2xs cursor-pointer whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>ตรวจงาน (Review)</span>
                            </button>
                            {job.submittedBy && (
                              <span className="text-[9px] font-mono text-ink-secondary whitespace-nowrap">
                                By {job.submittedBy}
                              </span>
                            )}
                          </div>
                        )}

                        {job.status === 'PUBLISHED' && job.liveUrl && (
                          <div className="flex flex-col items-end gap-1">
                            <a
                              href={job.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-brand-indigo hover:text-white hover:bg-brand-indigo bg-paper-canvas border border-brand-indigo/30 rounded-editorial transition-all shadow-2xs group cursor-pointer whitespace-nowrap"
                              title={`เปิดดูโพสต์จริงบน ${job.platform}`}
                            >
                              <SocialPlatformIcon platform={job.platform} format={job.format} size={15} />
                              <span>ดูบน {job.platform === 'FACEBOOK' ? 'Facebook' : job.platform === 'INSTAGRAM' ? 'Instagram' : job.platform === 'YOUTUBE' ? 'YouTube' : 'TikTok'}</span>
                              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                            <span className="text-[9px] font-mono text-semantic-success flex items-center gap-1 font-medium whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                              <span>Live on Web</span>
                            </span>
                          </div>
                        )}

                        {job.status === 'FAILED_RETRYABLE' && (
                          <button
                            onClick={() => handleRetry(job.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-accent-terracotta hover:bg-accent-terracotta/10 rounded border border-accent-terracotta/30 transition-colors shadow-2xs cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        )}

                        {job.status === 'FAILED_FINAL' && (
                          <button
                            onClick={() => setSelectedErrorJob(job)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle rounded border border-border-rule transition-colors cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3 text-accent-terracotta" />
                            <span>Remediate</span>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ERROR DIAGNOSTIC MODAL */}
      {selectedErrorJob && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper-raised border border-border-rule rounded-card max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center font-bold text-xs">
                  !
                </div>
                <div>
                  <h3 className="font-serif font-medium text-base text-ink-primary">
                    Dispatch Fault Inspector
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary block">
                    {selectedErrorJob.id} • {selectedErrorJob.platform} ({selectedErrorJob.format})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedErrorJob(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-secondary block">
                  Account Destination
                </span>
                <p className="font-mono font-semibold text-ink-primary mt-0.5">
                  {selectedErrorJob.handle}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-secondary block">
                  Post Story Title
                </span>
                <p className="font-serif text-ink-primary mt-0.5">
                  {selectedErrorJob.storyTitle}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-secondary block">
                  Raw API Error & Diagnostics
                </span>
                <div className="mt-1 p-3 bg-paper-canvas border border-accent-terracotta/30 rounded-editorial font-mono text-[11px] text-accent-terracotta whitespace-pre-wrap break-all leading-relaxed">
                  {selectedErrorJob.errorSafeMessage}
                </div>
              </div>

              <div className="p-3 bg-paper-subtle border border-border-rule rounded-editorial text-[11px] space-y-1">
                <span className="font-mono uppercase font-bold text-ink-primary block text-[10px]">
                  💡 Recommended Remediation
                </span>
                <p className="text-ink-secondary font-sans leading-relaxed">
                  {selectedErrorJob.errorSafeMessage?.includes('OAuth')
                    ? 'Go to Accounts Settings (/accounts) and click "Re-connect Meta Account" to refresh the access token with full page permissions.'
                    : selectedErrorJob.errorSafeMessage?.includes('aspect ratio')
                    ? 'Re-render or upload a vertical 9:16 asset (1080x1920) before republishing to Instagram Stories.'
                    : 'Check rate limit quotas or platform API status.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-border-rule">
              <button
                onClick={() => handleCopyErrorDetails(selectedErrorJob)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper-subtle hover:bg-paper-canvas text-ink-primary border border-border-rule rounded-editorial text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                {copiedNotification ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotification ? 'Copied Diagnostic!' : 'Copy for IT / Developer'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedErrorJob(null)}
                  className="px-3 py-1.5 text-ink-secondary hover:text-ink-primary text-xs font-mono cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleRetry(selectedErrorJob.id);
                    setSelectedErrorJob(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-indigo hover:bg-brand-indigo-hover text-white rounded-editorial text-xs font-mono font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGER APPROVAL & STICKY FEEDBACK MODAL */}
      {selectedReviewJob && (
        <div 
          onClick={() => setSelectedReviewJob(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-paper-canvas border border-border-rule rounded-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-rule">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-base text-ink-primary">
                    Manager Review & Approval Desk
                  </h3>
                  <span className="text-[10px] font-mono text-ink-secondary block">
                    {selectedReviewJob.id} • {selectedReviewJob.platform} ({selectedReviewJob.format})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReviewJob(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Post Specs */}
            <div className="p-3.5 bg-paper-subtle border border-border-rule rounded-editorial space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-ink-secondary">
                  Account Destination
                </span>
                <StatusTag status={selectedReviewJob.status} />
              </div>
              <p className="font-mono font-bold text-ink-primary">
                {selectedReviewJob.handle}
              </p>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-secondary block mt-1">
                  Story Title
                </span>
                <p className="font-serif text-sm font-semibold text-ink-primary">
                  {selectedReviewJob.storyTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border-rule/60 text-[11px] font-mono">
                <div>
                  <span className="text-ink-secondary block text-[10px]">Submitted By</span>
                  <span className="font-semibold text-ink-primary">
                    {selectedReviewJob.submittedBy || 'Team Contributor'}
                  </span>
                </div>
                <div>
                  <span className="text-ink-secondary block text-[10px]">Target Time</span>
                  <span className="font-semibold text-ink-primary">
                    {selectedReviewJob.scheduledOrExecutedAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Sticky Feedback Note (Yellow Post-It Memo) */}
            <div className="p-4 bg-[#FFF9C4] border border-[#FBC02D] rounded-editorial shadow-xs text-xs space-y-2 text-[#4A4A20]">
              <div className="flex items-center justify-between font-mono font-bold text-[11px] uppercase tracking-wider text-[#F57F17]">
                <span className="flex items-center gap-1.5">
                  <span>📌</span>
                  <span>Sticky Feedback Memo (ข้อเสนอแนะสั่งแก้ไข)</span>
                </span>
                <span className="text-[9px] font-normal lowercase opacity-80">
                  ทีมครีเอเตอร์จะเห็นโน้ตนี้ทันที
                </span>
              </div>
              <textarea
                rows={3}
                value={managerNoteInput}
                onChange={(e) => setManagerNoteInput(e.target.value)}
                placeholder="พิมพ์ข้อเสนอแนะ เช่น โปรดปรับขนาดตัวหนังสือในรูป หรือเพิ่มแฮชแท็กโครงการ..."
                className="w-full p-2.5 bg-white/80 border border-[#FBC02D]/60 rounded font-sans text-xs text-ink-primary placeholder:text-ink-muted/80 focus:outline-none focus:border-[#F57F17] focus:bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-border-rule flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedReviewJob(null)}
                className="px-4 py-2 border border-border-rule rounded-editorial text-xs font-mono text-ink-secondary hover:text-ink-primary cursor-pointer"
              >
                ยกเลิก
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRequestChanges(selectedReviewJob.id)}
                  className="px-4 py-2 bg-paper-canvas hover:bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/40 rounded-editorial text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>↩ ส่งกลับแก้ไข (Request Changes)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveJob(selectedReviewJob.id)}
                  className="px-5 py-2 bg-semantic-success hover:bg-semantic-success/90 text-white rounded-editorial text-xs font-mono font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>✓ อนุมัติ & จัดคิว (Approve)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
