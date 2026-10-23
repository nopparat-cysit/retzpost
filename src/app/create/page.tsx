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
  Image as ImageIcon,
  Sparkles,
  Share2, 
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

export default function CreatePostPage() {
  // Multi-Placement Selector: Users can enable BOTH Feed and Story simultaneously!
  const [enabledPlacements, setEnabledPlacements] = useState<{
    feed: boolean;
    story: boolean;
    videoReel: boolean;
  }>({
    feed: true,
    story: true, // Both Feed and Story enabled by default!
    videoReel: false,
  });

  // Granular Channel Placements Selection
  const [channelPlacements, setChannelPlacements] = useState<{
    igFeed: boolean;
    igStory: boolean;
    fbFeed: boolean;
    fbStory: boolean;
    ytVideo: boolean;
    ttVideo: boolean;
  }>({
    igFeed: true,
    igStory: true,
    fbFeed: true,
    fbStory: true,
    ytVideo: false,
    ttVideo: false,
  });

  // Media Gallery (Images or Video)
  const [images, setImages] = useState<Array<{ id: string; name: string; size: string }>>([
    { id: 'img-1', name: 'key_visual_launch_promo.jpg', size: '3.8 MB' },
    { id: 'img-2', name: 'product_feature_breakdown.png', size: '2.4 MB' },
  ]);

  const [storyVisualNotice, setStoryVisualNotice] = useState(
    'Auto-padding enabled: Visuals will be framed for 9:16 vertical full-screen on Instagram & Facebook Stories.'
  );

  // Content Fields
  const [workingTitle, setWorkingTitle] = useState('Product Launch: Universal Publishing Release');
  const [sharedCaption, setSharedCaption] = useState(
    'Everything you need to distribute content efficiently. Now supporting simultaneous Feed Posts and 24h Stories across Instagram and Facebook in a single dispatch.'
  );
  const [sharedTags, setSharedTags] = useState('launch, architecture, socialmedia, multipost');
  const [storyLinkUrl, setStoryLinkUrl] = useState('https://retzpost.com/announcement');

  // Accordion
  const [openAccordion, setOpenAccordion] = useState<string | null>('META_STORY');

  // Cadence
  const [publishMode, setPublishMode] = useState<'NOW' | 'SCHEDULED'>('NOW');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:15');

  // Count active placements
  const totalActivePlacements = Object.values(channelPlacements).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="SIMULTANEOUS MULTI-PLACEMENT / V2.1"
        editionDate="OMNI-DISTRIBUTION ENGINE"
        title="Universal Content Composer"
        subtitle="Upload once. Publish simultaneously across Feed Posts, 24h Stories, and Video Reels in a single unified dispatch."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-indigo font-semibold px-2.5 py-1 bg-brand-indigo/10 rounded-editorial border border-brand-indigo/20">
              {totalActivePlacements} Placements Active
            </span>
          </div>
        }
      />

      {/* MASTER MULTI-PLACEMENT TOGGLE BAR */}
      <div className="mb-8 p-4 bg-paper-raised border border-border-rule rounded-card shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-rule">
          <div>
            <span className="font-mono text-xs font-bold text-brand-indigo">[MASTER PLACEMENT TOGGLES]</span>
            <h2 className="font-serif font-medium text-base text-ink-primary">
              Where should this content be published?
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-secondary">
            Select one or multiple formats simultaneously
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Feed Post Toggle */}
          <div
            onClick={() => {
              const next = !enabledPlacements.feed;
              setEnabledPlacements({ ...enabledPlacements, feed: next });
              setChannelPlacements((prev) => ({
                ...prev,
                igFeed: next,
                fbFeed: next,
              }));
            }}
            className={`p-3 rounded-editorial border cursor-pointer transition-all flex items-start gap-3 ${
              enabledPlacements.feed
                ? 'border-brand-indigo bg-paper-canvas shadow-xs'
                : 'border-border-rule bg-paper-subtle/40 opacity-60'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                enabledPlacements.feed ? 'bg-brand-indigo border-brand-indigo text-white' : 'border-border-rule bg-paper-raised'
              }`}
            >
              {enabledPlacements.feed && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-ink-primary">
                <ImageIcon className="w-4 h-4 text-brand-indigo" />
                <span>โพสต์ลงฟีดปกติ (Feed Post)</span>
              </div>
              <p className="text-[11px] font-mono text-ink-secondary mt-0.5">
                รูปเดี่ยว / อัลบั้ม Carousel + แคปชั่นยาว
              </p>
            </div>
          </div>

          {/* Story Toggle (Can be active simultaneously!) */}
          <div
            onClick={() => {
              const next = !enabledPlacements.story;
              setEnabledPlacements({ ...enabledPlacements, story: next });
              setChannelPlacements((prev) => ({
                ...prev,
                igStory: next,
                fbStory: next,
              }));
            }}
            className={`p-3 rounded-editorial border cursor-pointer transition-all flex items-start gap-3 ${
              enabledPlacements.story
                ? 'border-accent-terracotta bg-paper-canvas shadow-xs'
                : 'border-border-rule bg-paper-subtle/40 opacity-60'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                enabledPlacements.story ? 'bg-accent-terracotta border-accent-terracotta text-white' : 'border-border-rule bg-paper-raised'
              }`}
            >
              {enabledPlacements.story && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-ink-primary">
                <Sparkles className="w-4 h-4 text-accent-terracotta" />
                <span>สตอรี่ 24 ชม. (Story)</span>
              </div>
              <p className="text-[11px] font-mono text-ink-secondary mt-0.5">
                เต็มจอแนวตั้ง 9:16 + สติกเกอร์ลิงก์ IG & FB
              </p>
            </div>
          </div>

          {/* Video Reel / Shorts Toggle */}
          <div
            onClick={() => {
              const next = !enabledPlacements.videoReel;
              setEnabledPlacements({ ...enabledPlacements, videoReel: next });
              setChannelPlacements((prev) => ({
                ...prev,
                ytVideo: next,
                ttVideo: next,
              }));
            }}
            className={`p-3 rounded-editorial border cursor-pointer transition-all flex items-start gap-3 ${
              enabledPlacements.videoReel
                ? 'border-semantic-info bg-paper-canvas shadow-xs'
                : 'border-border-rule bg-paper-subtle/40 opacity-60'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                enabledPlacements.videoReel ? 'bg-semantic-info border-semantic-info text-white' : 'border-border-rule bg-paper-raised'
              }`}
            >
              {enabledPlacements.videoReel && <Check className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-ink-primary">
                <Video className="w-4 h-4 text-semantic-info" />
                <span>วิดีโอ & Reels / Shorts</span>
              </div>
              <p className="text-[11px] font-mono text-ink-secondary mt-0.5">
                คลิปสั้น YouTube, TikTok, IG/FB Reels
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (60%) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 01: MEDIA INTAKE & SIMULTANEOUS PREVIEW */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 01]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">
                  Master Visual Media
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                {enabledPlacements.feed && <span className="px-2 py-0.5 bg-brand-indigo/10 text-brand-indigo rounded">Feed Ready</span>}
                {enabledPlacements.story && <span className="px-2 py-0.5 bg-accent-terracotta/10 text-accent-terracotta rounded">Story 9:16 Ready</span>}
              </div>
            </div>

            {/* Multi-Image Gallery */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative aspect-square bg-paper-subtle border border-border-rule rounded-editorial p-2 flex flex-col justify-between group overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-brand-indigo text-white flex items-center justify-center font-mono text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <button
                        onClick={() => setImages(images.filter((i) => i.id !== img.id))}
                        className="p-1 text-ink-secondary hover:text-semantic-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-center my-auto">
                      <ImageIcon className="w-6 h-6 text-brand-indigo mx-auto opacity-70 mb-1" />
                      <p className="text-[10px] font-mono text-ink-secondary truncate">{img.name}</p>
                    </div>
                    <span className="text-[9px] font-mono text-ink-secondary">{img.size}</span>
                  </div>
                ))}

                {images.length < 10 && (
                  <div className="aspect-square border-2 border-dashed border-border-rule rounded-editorial flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-brand-indigo/60 transition-colors">
                    <Plus className="w-5 h-5 text-brand-indigo mb-1" />
                    <span className="text-xs font-serif font-medium text-ink-primary">Add Visual</span>
                    <span className="text-[10px] font-mono text-ink-secondary">JPG, PNG, MP4</span>
                  </div>
                )}
              </div>

              {enabledPlacements.story && (
                <div className="p-3 bg-accent-terracotta/5 border border-accent-terracotta/20 rounded-editorial text-xs flex items-center gap-2 text-ink-secondary">
                  <Sparkles className="w-4 h-4 text-accent-terracotta shrink-0" />
                  <span className="text-[11px] font-mono">{storyVisualNotice}</span>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 02: GRANULAR CHANNELS & PLACEMENT MATRIX */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 02]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">
                  Channels & Placement Matrix
                </h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                {totalActivePlacements} active destinations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram Card with Sub-toggles for Feed and Story */}
              <div className="p-4 rounded-card border border-border-rule bg-paper-canvas shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border-rule">
                  <div className="w-7 h-7 rounded-editorial bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    IG
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary">Instagram Professional</h3>
                    <p className="text-[10px] font-mono text-ink-secondary">@alexrivera_official</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded bg-paper-raised border border-border-rule cursor-pointer hover:bg-paper-subtle transition-colors">
                    <span className="font-medium text-ink-primary">Post to Instagram Feed</span>
                    <input
                      type="checkbox"
                      checked={channelPlacements.igFeed}
                      onChange={(e) => setChannelPlacements({ ...channelPlacements, igFeed: e.target.checked })}
                      className="rounded text-brand-indigo"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-paper-raised border border-border-rule cursor-pointer hover:bg-paper-subtle transition-colors">
                    <span className="font-medium text-ink-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent-terracotta" />
                      <span>Post to Instagram Story (24h)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={channelPlacements.igStory}
                      onChange={(e) => setChannelPlacements({ ...channelPlacements, igStory: e.target.checked })}
                      className="rounded text-accent-terracotta"
                    />
                  </label>
                </div>
              </div>

              {/* Facebook Card with Sub-toggles for Feed and Story */}
              <div className="p-4 rounded-card border border-border-rule bg-paper-canvas shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border-rule">
                  <div className="w-7 h-7 rounded-editorial bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    FB
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary">Facebook Page</h3>
                    <p className="text-[10px] font-mono text-ink-secondary">Alex Rivera Media Studio</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded bg-paper-raised border border-border-rule cursor-pointer hover:bg-paper-subtle transition-colors">
                    <span className="font-medium text-ink-primary">Post to Page Timeline Feed</span>
                    <input
                      type="checkbox"
                      checked={channelPlacements.fbFeed}
                      onChange={(e) => setChannelPlacements({ ...channelPlacements, fbFeed: e.target.checked })}
                      className="rounded text-brand-indigo"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded bg-paper-raised border border-border-rule cursor-pointer hover:bg-paper-subtle transition-colors">
                    <span className="font-medium text-ink-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent-terracotta" />
                      <span>Post to Facebook Page Story</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={channelPlacements.fbStory}
                      onChange={(e) => setChannelPlacements({ ...channelPlacements, fbStory: e.target.checked })}
                      className="rounded text-accent-terracotta"
                    />
                  </label>
                </div>
              </div>

              {/* YouTube Card */}
              <div className={`p-4 rounded-card border bg-paper-canvas shadow-xs space-y-3 ${!enabledPlacements.videoReel ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between pb-2 border-b border-border-rule">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-editorial bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      YT
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-ink-primary">YouTube Shorts & Video</h3>
                      <p className="text-[10px] font-mono text-ink-secondary">@AlexRiveraStudio</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channelPlacements.ytVideo}
                    onChange={(e) => setChannelPlacements({ ...channelPlacements, ytVideo: e.target.checked })}
                    className="rounded text-brand-indigo"
                  />
                </div>
                <p className="text-[11px] font-mono text-ink-secondary">
                  Eligible when video asset is attached. (YouTube has no Story or Feed Photo API).
                </p>
              </div>

              {/* TikTok Card */}
              <div className={`p-4 rounded-card border bg-paper-canvas shadow-xs space-y-3 ${!enabledPlacements.videoReel ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between pb-2 border-b border-border-rule">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-editorial bg-ink-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                      TT
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-ink-primary">TikTok Account</h3>
                      <p className="text-[10px] font-mono text-ink-secondary">@alexrivera_official</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={channelPlacements.ttVideo}
                    onChange={(e) => setChannelPlacements({ ...channelPlacements, ttVideo: e.target.checked })}
                    className="rounded text-brand-indigo"
                  />
                </div>
                <p className="text-[11px] font-mono text-ink-secondary">
                  Direct Post or Inbox Draft for video formats.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 03: SHARED STORY & CAPTION */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 03]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Shared Story & Caption</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Used for Feed Posts</span>
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
                  Master Caption / Narrative
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
                  Hashtags (Comma Separated)
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

          {/* SECTION 04: STORY ADJUSTMENTS (IF STORY IS ACTIVE) */}
          {(channelPlacements.igStory || channelPlacements.fbStory) && (
            <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
              <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-bold text-accent-terracotta">[SEC. 04]</span>
                  <h2 className="font-serif font-medium text-lg text-ink-primary">24h Story Configuration</h2>
                </div>
                <span className="text-[11px] font-mono text-accent-terracotta font-semibold">Active Story Placements</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                    Instagram Story Link Sticker / Swipe-up URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com/learn-more"
                    value={storyLinkUrl}
                    onChange={(e) => setStoryLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial font-mono focus:outline-none focus:border-brand-indigo"
                  />
                  <p className="text-[10px] text-ink-secondary mt-1">
                    This link sticker will be attached to the Instagram Story for direct swipe-up or link tap.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 05: CADENCE */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 05]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Publishing Cadence & Timing</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Timezone: Asia/Bangkok (UTC+7)</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
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
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Pre-Flight Review Rail */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-rule">
              <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 06] Pre-Flight Review</span>
              <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            </div>

            {/* Active Placements Breakdown */}
            <div className="p-3 bg-paper-subtle rounded-editorial mb-4 border border-border-rule text-xs space-y-2">
              <span className="text-[10px] font-mono text-ink-secondary uppercase block font-semibold">
                Distribution Plan ({totalActivePlacements} Placements)
              </span>

              <div className="space-y-1 text-[11px] font-mono">
                {channelPlacements.igFeed && (
                  <div className="flex items-center justify-between text-ink-primary">
                    <span>• Instagram Feed</span>
                    <span className="text-brand-indigo font-bold">Carousel ({images.length})</span>
                  </div>
                )}
                {channelPlacements.igStory && (
                  <div className="flex items-center justify-between text-accent-terracotta">
                    <span>• Instagram Story</span>
                    <span className="font-bold">24h Ephemeral</span>
                  </div>
                )}
                {channelPlacements.fbFeed && (
                  <div className="flex items-center justify-between text-ink-primary">
                    <span>• Facebook Page Feed</span>
                    <span className="text-brand-indigo font-bold">Photo Album</span>
                  </div>
                )}
                {channelPlacements.fbStory && (
                  <div className="flex items-center justify-between text-accent-terracotta">
                    <span>• Facebook Story</span>
                    <span className="font-bold">24h Page Story</span>
                  </div>
                )}
                {channelPlacements.ytVideo && (
                  <div className="flex items-center justify-between text-semantic-info">
                    <span>• YouTube Shorts</span>
                    <span>Video</span>
                  </div>
                )}
                {channelPlacements.ttVideo && (
                  <div className="flex items-center justify-between text-semantic-info">
                    <span>• TikTok Direct</span>
                    <span>Video</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Snapshot Card */}
            <div className="p-3 bg-paper-canvas rounded-editorial mb-4 border border-border-rule text-xs space-y-1">
              <p className="font-serif font-bold text-ink-primary text-sm line-clamp-2">
                {workingTitle}
              </p>
              <p className="text-[11px] font-mono text-ink-secondary line-clamp-2">
                {sharedCaption}
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              disabled={totalActivePlacements === 0}
              className={`w-full py-3 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 shadow-xs transition-all ${
                totalActivePlacements > 0
                  ? 'bg-brand-indigo hover:bg-brand-indigo-hover text-white cursor-pointer'
                  : 'bg-paper-subtle text-ink-secondary border border-border-rule cursor-not-allowed opacity-60'
              }`}
            >
              <span>
                {publishMode === 'NOW'
                  ? `Publish Simultaneously to ${totalActivePlacements} Placements`
                  : `Schedule Dispatch (${totalActivePlacements} Placements)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-ink-secondary text-center mt-2 font-mono">
              Creates independent asynchronous jobs per placement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
