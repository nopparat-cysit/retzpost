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
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Smartphone,
  LayoutGrid,
  Link2
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

export default function CreatePostPage() {
  // Placement State per Channel: 1-click pills
  const [placements, setPlacements] = useState({
    igFeed: true,
    igStory: true, // Both enabled by default
    fbFeed: true,
    fbStory: false,
    ytVideo: false,
    ttVideo: false,
  });

  // Media Gallery (Photos or Video)
  const [images, setImages] = useState<Array<{ id: string; name: string; size: string }>>([
    { id: 'img-1', name: 'editorial_hero_cover_01.jpg', size: '3.8 MB' },
    { id: 'img-2', name: 'diagram_architecture_flow_02.png', size: '2.4 MB' },
  ]);

  // Content Fields
  const [workingTitle, setWorkingTitle] = useState('New Editorial Dispatch: Multi-Placement Architecture');
  const [sharedCaption, setSharedCaption] = useState(
    'Architecture over aesthetics. In this issue we break down our modular publishing pipeline designed for simultaneous Feed Posts and 24h Stories.\n\nSwipe to explore the full stack diagrams.'
  );
  const [sharedTags, setSharedTags] = useState('architecture, publishing, tech, design-system');
  const [storyLinkUrl, setStoryLinkUrl] = useState('https://retzpost.com/announcement');

  // Preview Mode in Right Rail: Feed vs Story
  const [previewTab, setPreviewTab] = useState<'FEED' | 'STORY'>('FEED');

  // Cadence
  const [publishMode, setPublishMode] = useState<'NOW' | 'SCHEDULED'>('NOW');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:15');

  // Active Placements Calculation
  const isAnyStoryActive = placements.igStory || placements.fbStory;
  const isAnyFeedActive = placements.igFeed || placements.fbFeed;
  const isAnyVideoActive = placements.ytVideo || placements.ttVideo;

  const totalActivePlacements = Object.values(placements).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="COMPOSER / DISPATCH DESK"
        editionDate="MULTI-PLACEMENT STUDIO"
        title="Universal Content Composer"
        subtitle="Upload once. Dispatch simultaneously across Feed Posts, 24h Stories, and Videos in a single unified workflow."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-brand-indigo font-semibold px-2.5 py-1 bg-brand-indigo/10 rounded-editorial border border-brand-indigo/20">
              {totalActivePlacements} Active Placements
            </span>
          </div>
        }
      />

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Form) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 01: MASTER VISUALS */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 01]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">
                  Master Visuals ({images.length} Photos)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                Auto-adapts to Carousel & 9:16 Story
              </span>
            </div>

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
                <div className="aspect-square border-2 border-dashed border-border-rule rounded-editorial flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:border-brand-indigo/60 transition-colors bg-paper-canvas/40">
                  <Plus className="w-5 h-5 text-brand-indigo mb-1" />
                  <span className="text-xs font-serif font-medium text-ink-primary">Add Visual</span>
                  <span className="text-[10px] font-mono text-ink-secondary">JPG, PNG, WebP</span>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 02: DESTINATIONS & PLACEMENTS (CLEAN 1-CLICK PILLS, NO REDUNDANCY) */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 02]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">
                  Channels & Format Placements
                </h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                Click pills to toggle destinations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Instagram Card */}
              <div className={`p-3.5 bg-paper-canvas border rounded-editorial flex items-center justify-between transition-all ${
                placements.igFeed || placements.igStory
                  ? 'border-border-strong shadow-2xs'
                  : 'border-border-rule opacity-60'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-editorial bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    IG
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary leading-tight">Instagram</h3>
                    <p className="text-[10px] font-mono text-ink-secondary">@alexrivera_official</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPlacements({ ...placements, igFeed: !placements.igFeed })}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                      placements.igFeed
                        ? 'bg-brand-indigo text-white shadow-2xs'
                        : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                    }`}
                  >
                    {placements.igFeed ? '✓ Feed' : '+ Feed'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlacements({ ...placements, igStory: !placements.igStory })}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                      placements.igStory
                        ? 'bg-accent-terracotta text-white shadow-2xs'
                        : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                    }`}
                  >
                    {placements.igStory ? '✓ Story' : '+ Story'}
                  </button>
                </div>
              </div>

              {/* Facebook Card */}
              <div className={`p-3.5 bg-paper-canvas border rounded-editorial flex items-center justify-between transition-all ${
                placements.fbFeed || placements.fbStory
                  ? 'border-border-strong shadow-2xs'
                  : 'border-border-rule opacity-60'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-editorial bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    FB
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary leading-tight">Facebook Page</h3>
                    <p className="text-[10px] font-mono text-ink-secondary">Alex Rivera Media</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPlacements({ ...placements, fbFeed: !placements.fbFeed })}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                      placements.fbFeed
                        ? 'bg-brand-indigo text-white shadow-2xs'
                        : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                    }`}
                  >
                    {placements.fbFeed ? '✓ Feed' : '+ Feed'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlacements({ ...placements, fbStory: !placements.fbStory })}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                      placements.fbStory
                        ? 'bg-accent-terracotta text-white shadow-2xs'
                        : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                    }`}
                  >
                    {placements.fbStory ? '✓ Story' : '+ Story'}
                  </button>
                </div>
              </div>

              {/* YouTube Card */}
              <div className={`p-3.5 bg-paper-canvas border rounded-editorial flex items-center justify-between transition-all ${
                placements.ytVideo
                  ? 'border-border-strong shadow-2xs'
                  : 'border-border-rule opacity-60'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-editorial bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    YT
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary leading-tight">YouTube</h3>
                    <p className="text-[10px] font-mono text-ink-secondary">@AlexRiveraStudio</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPlacements({ ...placements, ytVideo: !placements.ytVideo })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                    placements.ytVideo
                      ? 'bg-semantic-info text-white shadow-2xs'
                      : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                  }`}
                >
                  {placements.ytVideo ? '✓ Shorts' : '+ Shorts'}
                </button>
              </div>

              {/* TikTok Card */}
              <div className={`p-3.5 bg-paper-canvas border rounded-editorial flex items-center justify-between transition-all ${
                placements.ttVideo
                  ? 'border-border-strong shadow-2xs'
                  : 'border-border-rule opacity-60'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-editorial bg-ink-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    TT
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-ink-primary leading-tight">TikTok</h3>
                    <p className="text-[10px] font-mono text-ink-secondary">@alexrivera_official</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPlacements({ ...placements, ttVideo: !placements.ttVideo })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
                    placements.ttVideo
                      ? 'bg-ink-primary text-white shadow-2xs'
                      : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule'
                  }`}
                >
                  {placements.ttVideo ? '✓ Video' : '+ Video'}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 03: POST COPY & NARRATIVE */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 03]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">Post Copy & Narrative</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                {sharedCaption.length} characters
              </span>
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
                  placeholder="e.g. Product Launch: Universal Publishing Release"
                />
              </div>

              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Master Caption / Copy
                </label>
                <textarea
                  rows={4}
                  value={sharedCaption}
                  onChange={(e) => setSharedCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary focus:outline-none focus:border-brand-indigo leading-relaxed font-sans"
                  placeholder="Compose your post text here..."
                />
              </div>

              <div>
                <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={sharedTags}
                  onChange={(e) => setSharedTags(e.target.value)}
                  className="w-full px-3 py-2 bg-paper-canvas border border-border-rule rounded-editorial text-ink-primary font-mono focus:outline-none focus:border-brand-indigo"
                  placeholder="comma separated tags"
                />
              </div>

              {/* Contextual Story Link Field (Only shown when Story is active) */}
              {isAnyStoryActive && (
                <div className="pt-3 border-t border-border-rule/80">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Link2 className="w-3.5 h-3.5 text-accent-terracotta" />
                    <label className="text-[11px] font-mono uppercase font-semibold text-accent-terracotta">
                      Story Interactive Link Sticker (Instagram & Facebook Stories)
                    </label>
                  </div>
                  <input
                    type="url"
                    value={storyLinkUrl}
                    onChange={(e) => setStoryLinkUrl(e.target.value)}
                    placeholder="https://yourbrand.com/landing-page"
                    className="w-full px-3 py-2 bg-paper-canvas border border-accent-terracotta/40 rounded-editorial font-mono text-ink-primary focus:outline-none focus:border-accent-terracotta text-xs"
                  />
                  <p className="text-[10px] text-ink-secondary mt-1">
                    Direct tap link sticker rendered on your 24h vertical Story screen.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 04: CADENCE */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 04]</span>
                <h2 className="font-serif font-medium text-base text-ink-primary">Publishing Cadence</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Timezone: Asia/Bangkok (UTC+7)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPublishMode('NOW')}
                className={`flex-1 py-2 text-xs font-medium rounded-editorial border transition-colors ${
                  publishMode === 'NOW'
                    ? 'bg-brand-indigo text-white border-brand-indigo font-semibold shadow-2xs'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                Publish Immediately
              </button>
              <button
                type="button"
                onClick={() => setPublishMode('SCHEDULED')}
                className={`flex-1 py-2 text-xs font-medium rounded-editorial border transition-colors ${
                  publishMode === 'SCHEDULED'
                    ? 'bg-brand-indigo text-white border-brand-indigo font-semibold shadow-2xs'
                    : 'bg-paper-subtle text-ink-secondary border-border-rule hover:text-ink-primary'
                }`}
              >
                Schedule Dispatch
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

        {/* Right Column: Pre-Flight Review & Live Multi-Format Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-rule">
              <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 05] Live Multi-Placement Preview</span>
              <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            </div>

            {/* Preview Switcher Tabs */}
            <div className="flex items-center p-1 bg-paper-subtle border border-border-rule rounded-editorial mb-4">
              <button
                type="button"
                onClick={() => setPreviewTab('FEED')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded transition-colors ${
                  previewTab === 'FEED'
                    ? 'bg-paper-canvas text-brand-indigo shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Feed Post</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('STORY')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded transition-colors ${
                  previewTab === 'STORY'
                    ? 'bg-paper-canvas text-accent-terracotta shadow-xs font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>24h Story</span>
              </button>
            </div>

            {/* TAB 1: FEED POST PREVIEW */}
            {previewTab === 'FEED' && (
              <div className="bg-paper-canvas border border-border-rule rounded-editorial overflow-hidden mb-4 shadow-2xs">
                {/* Simulated Feed Header */}
                <div className="p-3 flex items-center justify-between border-b border-border-rule/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[10px] font-bold">
                      AR
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink-primary leading-none">alexrivera_official</p>
                      <p className="text-[9px] font-mono text-ink-secondary">Feed Post • Carousel ({images.length})</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-ink-secondary">•••</span>
                </div>

                {/* Media Canvas Mock */}
                <div className="aspect-[4/3] bg-paper-subtle relative flex items-center justify-center border-b border-border-rule/60">
                  <ImageIcon className="w-10 h-10 text-brand-indigo/40" />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-ink-primary/75 text-white font-mono text-[9px]">
                    1/{images.length}
                  </span>
                </div>

                {/* Feed Action Bar */}
                <div className="px-3 pt-2 pb-1 flex items-center justify-between text-ink-secondary">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 hover:text-semantic-error cursor-pointer" />
                    <MessageCircle className="w-4 h-4 cursor-pointer" />
                    <Send className="w-4 h-4 cursor-pointer" />
                  </div>
                  <Bookmark className="w-4 h-4 cursor-pointer" />
                </div>

                {/* Caption Snippet */}
                <div className="p-3 pt-1 text-xs">
                  <p className="font-semibold text-ink-primary text-xs mb-1 line-clamp-1">
                    {workingTitle}
                  </p>
                  <p className="text-ink-secondary text-[11px] line-clamp-2 leading-relaxed">
                    <span className="font-semibold text-ink-primary mr-1">alexrivera_official</span>
                    {sharedCaption}
                  </p>
                  {sharedTags && (
                    <p className="text-[10px] font-mono text-brand-indigo mt-1 truncate">
                      {sharedTags.split(',').map(t => `#${t.trim()}`).join(' ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: STORY PREVIEW (9:16 VERTICAL PHONE MOCK) */}
            {previewTab === 'STORY' && (
              <div className="w-full max-w-[240px] mx-auto aspect-[9/16] bg-gradient-to-b from-[#2a2d3e] to-[#12131a] rounded-[24px] p-3 text-white flex flex-col justify-between shadow-md relative overflow-hidden mb-4 border border-border-rule">
                {/* Story Top Bar */}
                <div>
                  {/* Progress Segments */}
                  <div className="flex gap-1 mb-2">
                    <div className="h-0.5 flex-1 bg-white rounded-full"></div>
                    <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                  </div>

                  {/* Author Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-terracotta text-white flex items-center justify-center text-[8px] font-bold ring-1 ring-white">
                      AR
                    </div>
                    <span className="text-[10px] font-semibold text-white/90">alexrivera_official</span>
                    <span className="text-[9px] text-white/50">24h</span>
                  </div>
                </div>

                {/* Center Visual Mock */}
                <div className="my-auto text-center px-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-2 backdrop-blur-xs">
                    <ImageIcon className="w-7 h-7 text-white/80" />
                  </div>
                  <p className="text-[11px] font-medium text-white/90 line-clamp-2">
                    {workingTitle}
                  </p>
                </div>

                {/* Story Bottom Link Sticker & Footer */}
                <div className="space-y-2">
                  {/* Interactive Sticker Pill */}
                  {storyLinkUrl ? (
                    <div className="mx-auto w-fit px-3 py-1 bg-white text-ink-primary rounded-full shadow-lg flex items-center gap-1.5 transform active:scale-95 transition-transform">
                      <Link2 className="w-3 h-3 text-brand-indigo" />
                      <span className="text-[10px] font-mono font-bold uppercase truncate max-w-[120px]">
                        {storyLinkUrl.replace(/^https?:\/\//, '')}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </div>
                  ) : (
                    <div className="text-center text-[9px] font-mono text-white/40">
                      (No Link Sticker Added)
                    </div>
                  )}

                  {/* Send Message Input */}
                  <div className="h-7 rounded-full border border-white/20 px-3 flex items-center justify-between text-[10px] text-white/40 bg-black/20">
                    <span>Send message...</span>
                    <Heart className="w-3.5 h-3.5 text-white/50" />
                  </div>
                </div>
              </div>
            )}

            {/* Distribution Plan Summary */}
            <div className="p-3 bg-paper-subtle rounded-editorial mb-4 border border-border-rule text-xs space-y-2">
              <span className="text-[10px] font-mono text-ink-secondary uppercase block font-semibold">
                Active Destinations ({totalActivePlacements})
              </span>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {placements.igFeed && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-indigo text-white font-medium">
                    IG Feed ({images.length})
                  </span>
                )}
                {placements.igStory && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-terracotta text-white font-medium">
                    IG Story (24h)
                  </span>
                )}
                {placements.fbFeed && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-indigo text-white font-medium">
                    FB Page Feed
                  </span>
                )}
                {placements.fbStory && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-terracotta text-white font-medium">
                    FB Page Story
                  </span>
                )}
                {placements.ytVideo && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-semantic-info text-white font-medium">
                    YT Shorts
                  </span>
                )}
                {placements.ttVideo && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ink-primary text-white font-medium">
                    TikTok Direct
                  </span>
                )}
                {totalActivePlacements === 0 && (
                  <span className="text-[10px] font-mono text-ink-secondary italic">
                    No destinations selected. Enable Feed or Story above.
                  </span>
                )}
              </div>
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
                  ? `Publish to ${totalActivePlacements} Destinations`
                  : `Schedule Dispatch (${totalActivePlacements} Destinations)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
