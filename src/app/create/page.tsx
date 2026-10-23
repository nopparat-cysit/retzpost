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
  Layers,
  Sparkles,
  Share2, 
  Calendar as CalendarIcon, 
  Eye,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

export type PostFormatType = 'FEED_POST' | 'STORY' | 'VIDEO_REEL';

export default function CreatePostPage() {
  // Format Switcher State (Core Feature)
  const [postFormat, setPostFormat] = useState<PostFormatType>('FEED_POST');

  // Media Gallery State (Supports single or multiple images for Carousel or video)
  const [images, setImages] = useState<Array<{ id: string; name: string; size: string; url?: string }>>([
    { id: 'img-1', name: 'editorial_hero_cover_01.jpg', size: '3.4 MB' },
    { id: 'img-2', name: 'diagram_architecture_flow_02.png', size: '2.1 MB' },
    { id: 'img-3', name: 'studio_workspace_setup_03.jpg', size: '4.8 MB' },
  ]);

  const [videoAsset, setVideoAsset] = useState({
    filename: 'v2026_creator_workflow_1080_find_cut_master.mp4',
    duration: '00:58',
    aspectRatio: '9:16 Vertical Master',
    resolution: '1080 x 1920 Pixels',
    size: '69.2 MB',
  });

  // Target Channels Selection
  const [selectedChannels, setSelectedChannels] = useState<{
    instagram: boolean;
    facebook: boolean;
    youtube: boolean;
    tiktok: boolean;
  }>({
    instagram: true,
    facebook: true,
    youtube: false,
    tiktok: false,
  });

  // Shared Story Fields
  const [workingTitle, setWorkingTitle] = useState('New Editorial Dispatch: Architecture Breakdown');
  const [sharedCaption, setSharedCaption] = useState(
    'Architecture over aesthetics. In this issue we break down our modular publishing pipeline designed for multi-format content.\n\nSwipe to explore the system diagrams and full stack schema.'
  );
  const [sharedTags, setSharedTags] = useState('architecture, publishing, tech, design-system');

  // Platform Overrides Accordion
  const [openAccordion, setOpenAccordion] = useState<string | null>('INSTAGRAM');

  // Instagram Specific Options
  const [igPlacement, setIgPlacement] = useState<'FEED_CAROUSEL' | 'STORY' | 'REEL'>('FEED_CAROUSEL');
  const [igStoryLinkUrl, setIgStoryLinkUrl] = useState('');

  // Facebook Specific Options
  const [fbPostAsAlbum, setFbPostAsAlbum] = useState(true);

  // Cadence
  const [publishMode, setPublishMode] = useState<'NOW' | 'SCHEDULED'>('NOW');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('09:15');
  const [timezone, setTimezone] = useState('Asia/Bangkok (UTC+7)');

  // Dynamic eligibility calculation
  const isChannelEligible = (platform: 'instagram' | 'facebook' | 'youtube' | 'tiktok') => {
    if (postFormat === 'STORY') {
      return platform === 'instagram' || platform === 'facebook';
    }
    if (postFormat === 'FEED_POST') {
      return platform === 'instagram' || platform === 'facebook';
    }
    return true; // VIDEO_REEL supports all 4
  };

  const activeSelectedCount = Object.entries(selectedChannels).filter(
    ([platform, isSelected]) => isSelected && isChannelEligible(platform as any)
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="UNIVERSAL PUBLISHING DESK / V2.0"
        editionDate="MULTI-FORMAT ENGINE"
        title="Universal Content Composer"
        subtitle="Publish Feed Posts (single & carousels), 24h Stories, and Short/Long Videos across Meta, YouTube, and TikTok."
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink-secondary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-semantic-success" />
              <span>Multi-Format Ready</span>
            </span>
          </div>
        }
      />

      {/* CORE FEATURE: POST FORMAT SWITCHER TABS */}
      <div className="mb-8 p-1.5 bg-paper-raised border border-border-rule rounded-card grid grid-cols-1 md:grid-cols-3 gap-2 shadow-xs">
        <button
          onClick={() => {
            setPostFormat('FEED_POST');
            setSelectedChannels({ instagram: true, facebook: true, youtube: false, tiktok: false });
          }}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-editorial transition-all text-xs font-serif ${
            postFormat === 'FEED_POST'
              ? 'bg-paper-canvas text-brand-indigo font-bold border border-border-rule shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-brand-indigo" />
          <div className="text-left">
            <p className="font-semibold text-sm">โพสต์ฟีดปกติ (Feed Post)</p>
            <p className="text-[10px] font-mono text-ink-secondary">รูปเดี่ยว • อัลบั้ม Carousel • ข้อความ</p>
          </div>
        </button>

        <button
          onClick={() => {
            setPostFormat('STORY');
            setSelectedChannels({ instagram: true, facebook: true, youtube: false, tiktok: false });
          }}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-editorial transition-all text-xs font-serif ${
            postFormat === 'STORY'
              ? 'bg-paper-canvas text-brand-indigo font-bold border border-border-rule shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
          }`}
        >
          <Sparkles className="w-4 h-4 text-accent-terracotta" />
          <div className="text-left">
            <p className="font-semibold text-sm">สตอรี่ 24 ชั่วโมง (Story)</p>
            <p className="text-[10px] font-mono text-ink-secondary">เต็มจอ 9:16 • รูป / คลิปสั้น Instagram & FB</p>
          </div>
        </button>

        <button
          onClick={() => {
            setPostFormat('VIDEO_REEL');
            setSelectedChannels({ instagram: true, facebook: true, youtube: true, tiktok: true });
          }}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-editorial transition-all text-xs font-serif ${
            postFormat === 'VIDEO_REEL'
              ? 'bg-paper-canvas text-brand-indigo font-bold border border-border-rule shadow-xs'
              : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
          }`}
        >
          <Video className="w-4 h-4 text-semantic-info" />
          <div className="text-left">
            <p className="font-semibold text-sm">คลิปสั้น & วิดีโอ (Reels / Shorts)</p>
            <p className="text-[10px] font-mono text-ink-secondary">YouTube Shorts • TikTok • IG Reels</p>
          </div>
        </button>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (60%) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 01: MEDIA INTAKE ACCORDING TO FORMAT */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 01]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">
                  {postFormat === 'FEED_POST' && 'Media Gallery (Single or Carousel Album)'}
                  {postFormat === 'STORY' && 'Story Visual Asset (9:16 Full Screen)'}
                  {postFormat === 'VIDEO_REEL' && 'Master Video Intake & Telemetry'}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                {postFormat === 'FEED_POST' && `${images.length} Photos Attached (Max 10)`}
                {postFormat === 'STORY' && 'Ephemeral (Expires in 24 Hours)'}
                {postFormat === 'VIDEO_REEL' && '9:16 Vertical Master'}
              </span>
            </div>

            {/* FEED POST: MULTI-IMAGE CAROUSEL DROPZONE */}
            {postFormat === 'FEED_POST' && (
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
                      <span className="text-xs font-serif font-medium text-ink-primary">Add Photo</span>
                      <span className="text-[10px] font-mono text-ink-secondary">JPG, PNG, WebP</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-ink-secondary font-mono">
                  💡 Tip: Images are published as a multi-card Carousel Album on Instagram and Facebook Feed.
                </p>
              </div>
            )}

            {/* STORY: 9:16 FULL SCREEN VISUAL */}
            {postFormat === 'STORY' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative aspect-[9/16] max-h-56 bg-paper-subtle border border-border-rule rounded-editorial flex items-center justify-center overflow-hidden">
                  <div className="text-center p-3">
                    <Sparkles className="w-8 h-8 text-accent-terracotta mx-auto mb-1 opacity-80" />
                    <p className="text-[10px] font-mono text-ink-secondary">9:16 Story Frame</p>
                  </div>
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-paper-raised/90 text-ink-primary text-[10px] font-mono rounded">
                    24h Story
                  </span>
                </div>

                <div className="md:col-span-2 space-y-2 text-xs">
                  <div className="p-3 bg-paper-subtle rounded-editorial font-mono text-[11px] text-ink-primary">
                    story_hero_announcement_916.jpg
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                      <span className="text-ink-secondary text-[10px] block">TARGET FORMAT</span>
                      <span className="font-semibold">Instagram & FB Story</span>
                    </div>
                    <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                      <span className="text-ink-secondary text-[10px] block">ASPECT RATIO</span>
                      <span className="font-semibold">9:16 (Auto-padded)</span>
                    </div>
                  </div>
                  <button className="text-[11px] text-brand-indigo hover:underline font-mono inline-flex items-center gap-1 mt-1">
                    <span>Upload New Story Media</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* VIDEO / REEL: VIDEO INTAKE */}
            {postFormat === 'VIDEO_REEL' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="relative aspect-[9/16] max-h-52 bg-paper-subtle border border-border-rule rounded-editorial flex items-center justify-center overflow-hidden">
                  <div className="text-center p-3">
                    <Video className="w-8 h-8 text-brand-indigo mx-auto mb-1 opacity-80" />
                    <p className="text-[10px] font-mono text-ink-secondary">Reels/Shorts Preview</p>
                  </div>
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-paper-raised/90 text-ink-primary text-[10px] font-mono rounded">
                    00:58
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2 text-xs">
                  <div className="p-2.5 bg-paper-subtle rounded-editorial font-mono text-[11px] truncate text-ink-primary">
                    {videoAsset.filename}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                      <span className="text-ink-secondary text-[10px] block">DURATION</span>
                      <span className="font-semibold">{videoAsset.duration}</span>
                    </div>
                    <div className="p-2 bg-paper-canvas rounded border border-border-rule">
                      <span className="text-ink-secondary text-[10px] block">RATIO</span>
                      <span className="font-semibold">9:16 Vertical</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 02: DYNAMIC CHANNELS SELECTOR */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 02]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Target Publication Endpoints</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">
                {activeSelectedCount} Channels Selected for this Format
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Instagram Card */}
              <div
                onClick={() =>
                  setSelectedChannels({ ...selectedChannels, instagram: !selectedChannels.instagram })
                }
                className={`p-4 rounded-card border cursor-pointer transition-all ${
                  selectedChannels.instagram
                    ? 'border-brand-indigo bg-paper-canvas shadow-xs'
                    : 'border-border-rule bg-paper-subtle/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-editorial bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center font-bold text-xs">
                      IG
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink-primary">Instagram Professional</p>
                      <p className="text-[10px] font-mono text-ink-secondary">@alexrivera_official</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.instagram}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-indigo rounded focus:ring-0"
                  />
                </div>
                <div className="text-[10px] font-mono text-semantic-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                  <span>
                    {postFormat === 'STORY' && 'Supports 24h Instagram Stories'}
                    {postFormat === 'FEED_POST' && 'Supports Single Photos & Carousels'}
                    {postFormat === 'VIDEO_REEL' && 'Supports Instagram Reels'}
                  </span>
                </div>
              </div>

              {/* Facebook Page Card */}
              <div
                onClick={() =>
                  setSelectedChannels({ ...selectedChannels, facebook: !selectedChannels.facebook })
                }
                className={`p-4 rounded-card border cursor-pointer transition-all ${
                  selectedChannels.facebook
                    ? 'border-brand-indigo bg-paper-canvas shadow-xs'
                    : 'border-border-rule bg-paper-subtle/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-editorial bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">
                      FB
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink-primary">Facebook Page</p>
                      <p className="text-[10px] font-mono text-ink-secondary">Alex Rivera Media Studio</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedChannels.facebook}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-indigo rounded focus:ring-0"
                  />
                </div>
                <div className="text-[10px] font-mono text-semantic-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                  <span>
                    {postFormat === 'STORY' && 'Supports Facebook Page Stories'}
                    {postFormat === 'FEED_POST' && 'Supports Photo Album & Status'}
                    {postFormat === 'VIDEO_REEL' && 'Supports Page Video & Reels'}
                  </span>
                </div>
              </div>

              {/* YouTube Card (Disabled if Story or Feed Post) */}
              <div
                onClick={() => {
                  if (isChannelEligible('youtube')) {
                    setSelectedChannels({ ...selectedChannels, youtube: !selectedChannels.youtube });
                  }
                }}
                className={`p-4 rounded-card border transition-all ${
                  !isChannelEligible('youtube')
                    ? 'border-border-rule bg-paper-subtle/40 opacity-40 cursor-not-allowed'
                    : selectedChannels.youtube
                    ? 'border-brand-indigo bg-paper-canvas shadow-xs cursor-pointer'
                    : 'border-border-rule bg-paper-subtle/50 opacity-60 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-editorial bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs">
                      YT
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink-primary">YouTube Channel</p>
                      <p className="text-[10px] font-mono text-ink-secondary">@AlexRiveraStudio</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!isChannelEligible('youtube')}
                    checked={selectedChannels.youtube && isChannelEligible('youtube')}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-indigo rounded focus:ring-0"
                  />
                </div>
                <div className="text-[10px] font-mono text-ink-secondary">
                  {!isChannelEligible('youtube')
                    ? '⚠️ YouTube API does not support Stories or Image Feed'
                    : 'Supports Shorts & Video Uploads'}
                </div>
              </div>

              {/* TikTok Card (Disabled if Story) */}
              <div
                onClick={() => {
                  if (isChannelEligible('tiktok')) {
                    setSelectedChannels({ ...selectedChannels, tiktok: !selectedChannels.tiktok });
                  }
                }}
                className={`p-4 rounded-card border transition-all ${
                  !isChannelEligible('tiktok')
                    ? 'border-border-rule bg-paper-subtle/40 opacity-40 cursor-not-allowed'
                    : selectedChannels.tiktok
                    ? 'border-brand-indigo bg-paper-canvas shadow-xs cursor-pointer'
                    : 'border-border-rule bg-paper-subtle/50 opacity-60 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-editorial bg-ink-primary text-white flex items-center justify-center font-bold text-xs">
                      TT
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-ink-primary">TikTok Account</p>
                      <p className="text-[10px] font-mono text-ink-secondary">@alexrivera_official</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    disabled={!isChannelEligible('tiktok')}
                    checked={selectedChannels.tiktok && isChannelEligible('tiktok')}
                    onChange={() => {}}
                    className="w-4 h-4 text-brand-indigo rounded focus:ring-0"
                  />
                </div>
                <div className="text-[10px] font-mono text-ink-secondary">
                  {!isChannelEligible('tiktok')
                    ? '⚠️ TikTok does not support 24h Stories via API'
                    : 'Supports Direct Post & Video Upload'}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 03: SHARED STORY (HIDDEN IF STORY FORMAT) */}
          {postFormat !== 'STORY' && (
            <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
              <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 03]</span>
                  <h2 className="font-serif font-medium text-lg text-ink-primary">Shared Story & Caption</h2>
                </div>
                <span className="text-[11px] font-mono text-ink-secondary">Cascades to Facebook & Instagram</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                    Master Caption / Text
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
                    Hashtags & Topics
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
          )}

          {/* SECTION 04: PLATFORM EDITIONS ACCORDION */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 04]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Platform Specific Adjustments</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Meta Editions</span>
            </div>

            <div className="space-y-3">
              {/* Instagram Edition Accordion */}
              {selectedChannels.instagram && (
                <div className="border border-border-rule rounded-card overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'INSTAGRAM' ? null : 'INSTAGRAM')}
                    className="w-full p-4 bg-paper-subtle flex items-center justify-between text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-primary">Instagram Settings</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-indigo/10 text-brand-indigo font-semibold">
                        {postFormat === 'STORY' ? 'Story Mode' : 'Feed Carousel'}
                      </span>
                    </div>
                    {openAccordion === 'INSTAGRAM' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {openAccordion === 'INSTAGRAM' && (
                    <div className="p-4 space-y-4 bg-paper-canvas text-xs border-t border-border-rule">
                      {postFormat === 'STORY' ? (
                        <div>
                          <label className="block text-ink-secondary text-[11px] font-mono uppercase mb-1">
                            Optional Story Swipe-up / Link Sticker URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://yourbrand.com/special-article"
                            value={igStoryLinkUrl}
                            onChange={(e) => setIgStoryLinkUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-paper-raised border border-border-rule rounded-editorial font-mono focus:outline-none focus:border-brand-indigo"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-ink-secondary text-[11px] font-mono leading-relaxed">
                            ✓ Published as an Instagram Carousel Album with {images.length} photos.
                            <br />✓ Square/Portrait crops are verified.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Facebook Edition Accordion */}
              {selectedChannels.facebook && (
                <div className="border border-border-rule rounded-card overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'FACEBOOK' ? null : 'FACEBOOK')}
                    className="w-full p-4 bg-paper-subtle flex items-center justify-between text-left text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-primary">Facebook Page Settings</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-paper-canvas text-ink-secondary border border-border-rule">
                        Default Page Feed
                      </span>
                    </div>
                    {openAccordion === 'FACEBOOK' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {openAccordion === 'FACEBOOK' && (
                    <div className="p-4 space-y-3 bg-paper-canvas text-xs border-t border-border-rule">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fbPostAsAlbum}
                          onChange={(e) => setFbPostAsAlbum(e.target.checked)}
                          className="rounded text-brand-indigo"
                        />
                        <span>Publish attached photos as a grouped Photo Album on Page timeline</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 05: CADENCE */}
          <section className="bg-paper-raised border border-border-rule rounded-card p-6 shadow-xs">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border-rule">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 05]</span>
                <h2 className="font-serif font-medium text-lg text-ink-primary">Publishing Cadence & Timing</h2>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">Timezone: {timezone}</span>
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

        {/* Right Sticky Review Rail (40%) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="bg-paper-raised border border-border-rule rounded-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-rule">
              <span className="font-mono text-xs font-bold text-brand-indigo">[SEC. 06] Pre-Flight Review</span>
              <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            </div>

            {/* Content Snapshot Card */}
            <div className="p-3 bg-paper-subtle rounded-editorial mb-4 border border-border-rule text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-ink-secondary uppercase">Format Type</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-indigo text-white">
                  {postFormat.replace('_', ' ')}
                </span>
              </div>
              <p className="font-serif font-bold text-ink-primary text-sm line-clamp-2">
                {postFormat === 'STORY' ? 'Instagram & Facebook 24h Story' : workingTitle}
              </p>
              <p className="text-[11px] font-mono text-ink-secondary">
                {postFormat === 'FEED_POST' && `${images.length} Photos for Carousel Album`}
                {postFormat === 'STORY' && '9:16 Full Screen Vertical'}
                {postFormat === 'VIDEO_REEL' && '58s Video Reel'}
              </p>
            </div>

            {/* Targeted Endpoints Readiness */}
            <div className="space-y-2 mb-5">
              <span className="text-[11px] font-mono uppercase text-ink-secondary block font-semibold">
                Active Destinations ({activeSelectedCount})
              </span>

              {selectedChannels.instagram && isChannelEligible('instagram') && (
                <div className="p-2.5 bg-paper-canvas rounded-editorial border border-border-rule flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-semantic-success" />
                    <span className="font-medium">
                      Instagram {postFormat === 'STORY' ? 'Story' : 'Feed'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-ink-secondary">Active Token</span>
                </div>
              )}

              {selectedChannels.facebook && isChannelEligible('facebook') && (
                <div className="p-2.5 bg-paper-canvas rounded-editorial border border-border-rule flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-semantic-success" />
                    <span className="font-medium">
                      Facebook {postFormat === 'STORY' ? 'Story' : 'Page Feed'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-ink-secondary">Page Admin</span>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              disabled={activeSelectedCount === 0}
              className={`w-full py-3 px-4 text-xs font-semibold rounded-editorial flex items-center justify-center gap-2 shadow-xs transition-all ${
                activeSelectedCount > 0
                  ? 'bg-brand-indigo hover:bg-brand-indigo-hover text-white cursor-pointer'
                  : 'bg-paper-subtle text-ink-secondary border border-border-rule cursor-not-allowed opacity-60'
              }`}
            >
              <span>
                {publishMode === 'NOW'
                  ? `Publish ${postFormat === 'STORY' ? 'Story' : 'Post'} to ${activeSelectedCount} Channels`
                  : `Schedule Dispatch (${activeSelectedCount} Channels)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
