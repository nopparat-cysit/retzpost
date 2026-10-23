'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  Share2, 
  Calendar as CalendarIcon, 
  Eye,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

export default function CreatePostPage() {
  // Section 01: Media State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(100);
  const [mediaAsset, setMediaAsset] = useState({
    filename: 'v2026_creator_workflow_1080_find_cut_master.mp4',
    duration: '00:58',
    aspectRatio: '9:16 Vertical Master',
    resolution: '1080 x 1920 Pixels',
    size: '69.2 MB',
    isVerified: true,
  });

  // Section 02: Distribution Accounts
  const [selectedChannels, setSelectedChannels] = useState<{
    youtube: boolean;
    tiktok: boolean;
  }>({
    youtube: true,
    tiktok: true,
  });

  // Section 03: Shared Story
  const [workingTitle, setWorkingTitle] = useState('The Modern Creator Ledger: How We Produce 83 Dispatches');
  const [sharedCaption, setSharedCaption] = useState(
    'Stop treating syndication like an afterthought. High-velocity publishing requires the discipline of mechanical broadcast protocols combined with automated distribution logic.\n\nIn this comprehensive workflow breakdown we inspect our end-to-end architecture from initial cut to multi-channel dispatch.'
  );
  const [sharedTags, setSharedTags] = useState('architecture, workflow, engineering, creator-economy');
  const [autosaveStatus, setAutosaveStatus] = useState<'SAVED' | 'SAVING'>('SAVED');

  // Section 04: Platform Editions Accordion
  const [openAccordion, setOpenAccordion] = useState<'YOUTUBE' | 'TIKTOK' | null>('YOUTUBE');

  // YouTube Specific Overrides
  const [ytCustomized, setYtCustomized] = useState(true);
  const [ytTitle, setYtTitle] = useState('How We Dispatch 83 Pieces of Content Weekly (Modern OS)');
  const [ytPrivacy, setYtPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');
  const [ytMadeForKids, setYtMadeForKids] = useState<boolean>(false);

  // TikTok Specific Overrides
  const [ttCustomized, setTtCustomized] = useState(false);
  const [ttCaption, setTtCaption] = useState(
    'Stop treating multi-posting like an afterthought. The 2026 dispatch architecture is live #creator #workflow #tech'
  );
  const [ttPrivacy, setTtPrivacy] = useState<'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY'>('PUBLIC_TO_EVERYONE');
  const [ttAllowComments, setTtAllowComments] = useState(true);
  const [ttAllowDuet, setTtAllowDuet] = useState(true);
  const [ttAllowStitch, setTtAllowStitch] = useState(true);
  const [ttConsentGiven, setTtConsentGiven] = useState(true);

  // Section 05: Cadence
  const [publishMode, setPublishMode] = useState<'NOW' | 'SCHEDULED'>('SCHEDULED');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:15');
  const [timezone, setTimezone] = useState('Asia/Bangkok (UTC+7)');

  const selectedCount = (selectedChannels.youtube ? 1 : 0) + (selectedChannels.tiktok ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="DISPATCH COMPOSER / WORKFLOW 2026"
        editionDate="VOL. IV"
        title="Editorial Post & Dispatch Composer"
        subtitle="Synthesize master content, adapt multi-format platform editions, and execute automated syndication across active press endpoints."
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink-secondary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-semantic-success" />
              <span>Draft Saved Automatically</span>
            </span>
          </div>
        }
      />

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column (60%) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 01: MEDIA INTAKE */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 01]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Master Media Intake & Telemetry</h2>
              </div>
              <span className="text-[11px] font-mono text-semantic-success flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by Media Probe</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Video Thumbnail Box */}
              <div className="relative aspect-[9/16] max-h-52 bg-paper-subtle border border-border-rule rounded-editorial flex items-center justify-center overflow-hidden">
                <div className="text-center p-3">
                  <Video className="w-8 h-8 text-brand-indigo mx-auto mb-1 opacity-80" />
                  <p className="text-[10px] font-mono text-ink-secondary">9:16 Master Preview</p>
                </div>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-paper-raised/90 text-ink-primary text-[10px] font-mono rounded">
                  00:58
                </div>
              </div>

              {/* Media Specs Table */}
              <div className="md:col-span-2 space-y-2 text-xs">
                <div className="p-2.5 bg-paper-subtle rounded-editorial font-mono text-[11px] truncate text-ink-primary">
                  {mediaAsset.filename}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                    <span className="text-ink-secondary text-[10px] block">DURATION</span>
                    <span className="font-semibold">{mediaAsset.duration} (Eligible)</span>
                  </div>
                  <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                    <span className="text-ink-secondary text-[10px] block">RATIO</span>
                    <span className="font-semibold">{mediaAsset.aspectRatio}</span>
                  </div>
                  <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                    <span className="text-ink-secondary text-[10px] block">DIMENSIONS</span>
                    <span className="font-semibold">{mediaAsset.resolution}</span>
                  </div>
                  <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                    <span className="text-ink-secondary text-[10px] block">FILE SIZE</span>
                    <span className="font-semibold">{mediaAsset.size}</span>
                  </div>
                </div>

                <button className="text-[11px] text-brand-indigo hover:underline font-mono inline-flex items-center gap-1 mt-1">
                  <span>Replace Video Asset</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 02: TARGET CHANNELS */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 02]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Target Publication Endpoints</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                {selectedCount} of 2 Channels Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* YouTube Card */}
              <div
                onClick={() => setSelectedChannels({ ...selectedChannels, youtube: !selectedChannels.youtube })}
                className={`p-4 rounded-card border cursor-pointer transition-all ${
                  selectedChannels.youtube
                    ? 'border-brand-indigo bg-paper-canvas shadow-xs'
                    : 'border-border-rule bg-paper-subtle/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-editorial bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs">
                      YT
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink-primary">YouTube Shorts & Long</p>
                      <p className="text-[10px] font-mono text-ink-secondary">@AlexRiveraStudio</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.youtube}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-indigo rounded focus:ring-0"
                  />
                </div>
                <div className="text-[10px] font-mono text-semantic-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                  <span>Channel Quota Active (Healthy)</span>
                </div>
              </div>

              {/* TikTok Card */}
              <div
                onClick={() => setSelectedChannels({ ...selectedChannels, tiktok: !selectedChannels.tiktok })}
                className={`p-4 rounded-card border cursor-pointer transition-all ${
                  selectedChannels.tiktok
                    ? 'border-brand-indigo bg-paper-canvas shadow-xs'
                    : 'border-border-rule bg-paper-subtle/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-editorial bg-ink-primary text-white flex items-center justify-center font-bold text-xs">
                      TT
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink-primary">TikTok Direct Post</p>
                      <p className="text-[10px] font-mono text-ink-secondary">@alexrivera_official</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.tiktok}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-indigo rounded focus:ring-0"
                  />
                </div>
                <div className="text-[10px] font-mono text-semantic-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                  <span>Max Duration: 600s (Eligible)</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 03: SHARED STORY */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 03]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Shared Story & Editorial Baseline</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Cascades to Selected Channels</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Master Headline / Working Title
                </label>
                <input
                  type="text"
                  value={workingTitle}
                  onChange={(e) => setWorkingTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-medium focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Master Caption / Story Narrative
                </label>
                <textarea
                  rows={4}
                  value={sharedCaption}
                  onChange={(e) => setSharedCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary focus:outline-none focus:border-brand-indigo leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Shared Tags & Topics (Comma Separated)
                </label>
                <input
                  type="text"
                  value={sharedTags}
                  onChange={(e) => setSharedTags(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo"
                />
              </div>
            </div>
          </section>

          {/* SECTION 04: PLATFORM EDITIONS ACCORDION */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 04]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Platform Editions & Channel Overrides</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Single-Active Accordion</span>
            </div>

            {/* Accordion Tabs */}
            <div className="space-y-3">
              {/* YouTube Tab */}
              {selectedChannels.youtube && (
                <div className="border border-border-rule rounded-card overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'YOUTUBE' ? null : 'YOUTUBE')}
                    className="w-full p-4 bg-paper-subtle flex items-center justify-between text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-primary">YouTube Edition</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-indigo/10 text-brand-indigo font-semibold">
                        Customized (1 Override)
                      </span>
                    </div>
                    {openAccordion === 'YOUTUBE' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {openAccordion === 'YOUTUBE' && (
                    <div className="p-4 space-y-4 bg-paper-canvas text-xs border-t border-border-rule">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-ink-secondary text-[11px] font-mono uppercase">
                            YouTube Optimized Title (Max 100 Characters)
                          </label>
                          <span className="text-[10px] font-mono text-ink-secondary">{ytTitle.length} / 100</span>
                        </div>
                        <input
                          type="text"
                          value={ytTitle}
                          onChange={(e) => setYtTitle(e.target.value)}
                          maxLength={100}
                          className="w-full px-3 py-2 bg-paper-raised border border-border-rule rounded-editorial font-medium focus:outline-none focus:border-brand-indigo"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                            Privacy Level
                          </label>
                          <select
                            value={ytPrivacy}
                            onChange={(e) => setYtPrivacy(e.target.value as any)}
                            className="w-full px-3 py-2 bg-paper-raised border border-border-rule rounded-editorial focus:outline-none focus:border-brand-indigo"
                          >
                            <option value="public">Public (Standard)</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="private">Private</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                            COPPA Child Audience Protection
                          </label>
                          <select
                            value={ytMadeForKids ? 'yes' : 'no'}
                            onChange={(e) => setYtMadeForKids(e.target.value === 'yes')}
                            className="w-full px-3 py-2 bg-paper-raised border border-border-rule rounded-editorial focus:outline-none focus:border-brand-indigo"
                          >
                            <option value="no">No, Not Made for Kids (Required)</option>
                            <option value="yes">Yes, Made for Kids</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TikTok Tab */}
              {selectedChannels.tiktok && (
                <div className="border border-border-rule rounded-card overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'TIKTOK' ? null : 'TIKTOK')}
                    className="w-full p-4 bg-paper-subtle flex items-center justify-between text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-primary">TikTok Edition</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-canvas text-ink-secondary border border-border-rule">
                        Inherited from Story
                      </span>
                    </div>
                    {openAccordion === 'TIKTOK' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {openAccordion === 'TIKTOK' && (
                    <div className="p-4 space-y-4 bg-paper-canvas text-xs border-t border-border-rule">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-ink-secondary text-[11px] font-mono uppercase">
                            TikTok Caption & Hashtags (Max 2,200 Runes)
                          </label>
                          <span className="text-[10px] font-mono text-ink-secondary">{ttCaption.length} / 2200</span>
                        </div>
                        <textarea
                          rows={3}
                          value={ttCaption}
                          onChange={(e) => setTtCaption(e.target.value)}
                          className="w-full px-3 py-2 bg-paper-raised border border-border-rule rounded-editorial focus:outline-none focus:border-brand-indigo"
                        />
                      </div>

                      <div>
                        <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                          Privacy Level (Fetched from Creator Profile — No Default)
                        </label>
                        <select
                          value={ttPrivacy}
                          onChange={(e) => setTtPrivacy(e.target.value as any)}
                          className="w-full px-3 py-2 bg-paper-raised border border-border-rule rounded-editorial focus:outline-none focus:border-brand-indigo"
                        >
                          <option value="PUBLIC_TO_EVERYONE">Public to Everyone</option>
                          <option value="MUTUAL_FOLLOW_FRIENDS">Mutual Follow Friends Only</option>
                          <option value="SELF_ONLY">Private (Only Me)</option>
                        </select>
                      </div>

                      {/* Interaction Controls */}
                      <div className="p-3 bg-paper-raised border border-border-rule rounded-editorial space-y-2">
                        <span className="text-[11px] font-mono uppercase text-ink-secondary block font-semibold">
                          Interaction Controls
                        </span>
                        <div className="flex flex-wrap items-center gap-6 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ttAllowComments}
                              onChange={(e) => setTtAllowComments(e.target.checked)}
                              className="rounded text-brand-indigo"
                            />
                            <span>Allow Comments</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ttAllowDuet}
                              onChange={(e) => setTtAllowDuet(e.target.checked)}
                              className="rounded text-brand-indigo"
                            />
                            <span>Allow Duet</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ttAllowStitch}
                              onChange={(e) => setTtAllowStitch(e.target.checked)}
                              className="rounded text-brand-indigo"
                            />
                            <span>Allow Stitch</span>
                          </label>
                        </div>
                      </div>

                      {/* TikTok Explicit User Consent */}
                      <div className="p-3 bg-paper-subtle rounded-editorial text-[11px] text-ink-secondary leading-relaxed border border-border-rule">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ttConsentGiven}
                            onChange={(e) => setTtConsentGiven(e.target.checked)}
                            className="mt-0.5 rounded text-brand-indigo"
                          />
                          <span>
                            I confirm this media complies with TikTok Content Sharing Guidelines. I acknowledge that direct public posting will enter TikTok processing and moderation before becoming visible.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 05: CADENCE & SCHEDULING */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 05]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Publishing Cadence & Timing</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Timezone Enforced: {timezone}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setPublishMode('NOW')}
                className={`flex-1 py-2 text-xs font-medium rounded-editorial border transition-colors ${
                  publishMode === 'NOW'
                    ? 'bg-brand-indigo text-white border-brand-indigo font-semibold'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                Publish Immediately
              </button>
              <button
                onClick={() => setPublishMode('SCHEDULED')}
                className={`flex-1 py-2 text-xs font-medium rounded-editorial border transition-colors ${
                  publishMode === 'SCHEDULED'
                    ? 'bg-brand-indigo text-white border-brand-indigo font-semibold'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                Schedule Dispatch (Timezone-Aware)
              </button>
            </div>

            {publishMode === 'SCHEDULED' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">Target Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">Target Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono focus:outline-none focus:border-brand-indigo"
                  >
                    <option value="Asia/Bangkok (UTC+7)">Asia/Bangkok (UTC+7)</option>
                    <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                    <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                    <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Sticky Review Rail (40%) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-rule">
              <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 06] Pre-Flight Review</span>
              <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for Queue</span>
              </span>
            </div>

            {/* Content Snapshot Card */}
            <div className="p-3 bg-paper-subtle rounded-editorial mb-4 border border-border-rule text-xs space-y-1.5">
              <span className="text-[10px] font-mono text-ink-secondary uppercase block">Primary Payload</span>
              <p className="font-serif font-bold text-ink-primary text-sm line-clamp-2">
                {workingTitle}
              </p>
              <p className="text-[11px] font-mono text-ink-secondary">
                Duration: {mediaAsset.duration} • Ratio: 9:16
              </p>
            </div>

            {/* Targeted Endpoints Readiness */}
            <div className="space-y-2 mb-5">
              <span className="text-[11px] font-mono uppercase text-ink-secondary block font-semibold">
                Target Channels ({selectedCount})
              </span>

              {selectedChannels.youtube && (
                <div className="p-2.5 bg-paper-canvas rounded-editorial border border-border-rule flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-semantic-success" />
                    <span className="font-medium">YouTube Shorts</span>
                  </div>
                  <span className="text-[10px] font-mono text-ink-secondary">Title: 59c</span>
                </div>
              )}

              {selectedChannels.tiktok && (
                <div className="p-2.5 bg-paper-canvas rounded-editorial border border-border-rule flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-semantic-success" />
                    <span className="font-medium">TikTok Direct</span>
                  </div>
                  <span className="text-[10px] font-mono text-ink-secondary">Public</span>
                </div>
              )}
            </div>

            {/* Pre-flight Checks */}
            <div className="space-y-1.5 text-[11px] font-mono text-ink-secondary mb-6 pt-3 border-t border-border-rule">
              <div className="flex items-center gap-2 text-semantic-success">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Video validated & ready in storage</span>
              </div>
              <div className="flex items-center gap-2 text-semantic-success">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>OAuth tokens active for {selectedCount} channels</span>
              </div>
              <div className="flex items-center gap-2 text-semantic-success">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Duration eligible across destinations</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              disabled={selectedCount === 0 || !ttConsentGiven}
              className={`w-full py-3 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 shadow-xs transition-all ${
                selectedCount > 0 && ttConsentGiven
                  ? 'bg-brand-indigo hover:bg-brand-indigo-hover text-white cursor-pointer'
                  : 'bg-paper-subtle text-ink-secondary border border-border-rule cursor-not-allowed opacity-60'
              }`}
            >
              <span>
                {publishMode === 'NOW'
                  ? `Publish Immediately to ${selectedCount} Channels`
                  : `Schedule Dispatch (${selectedCount} Channels)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button className="w-full mt-2 py-2 text-xs font-medium text-ink-secondary hover:text-ink-primary text-center">
              Save Draft Folio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
