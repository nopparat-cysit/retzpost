'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  ExternalLink 
} from 'lucide-react';
import { Masthead } from '@/components/ui/masthead';

export type PostFormat = 'FEED_POST' | 'STORY' | 'VIDEO_REEL';

interface CalendarEventItem {
  id: string;
  dayOfMonth: number;
  timeStr: string;
  title: string;
  platform: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';
  format: PostFormat;
  handle: string;
  durationOrPhotos: string;
  status: 'SCHEDULED' | 'PUBLISHED';
}

const SAMPLE_EVENTS: CalendarEventItem[] = [
  {
    id: 'ev-1',
    dayOfMonth: 24,
    timeStr: '09:00 AM',
    title: '3 Hooks That Stop the Scroll in 2026',
    platform: 'INSTAGRAM',
    format: 'FEED_POST',
    handle: '@alexrivera_official',
    durationOrPhotos: '3 Photos',
    status: 'SCHEDULED',
  },
  {
    id: 'ev-2',
    dayOfMonth: 24,
    timeStr: '10:30 AM',
    title: 'Live Workshop Behind the Scenes Flash',
    platform: 'INSTAGRAM',
    format: 'STORY',
    handle: '@alexrivera_official',
    durationOrPhotos: '24h Story',
    status: 'SCHEDULED',
  },
  {
    id: 'ev-3',
    dayOfMonth: 24,
    timeStr: '09:00 AM',
    title: '3 Hooks That Stop the Scroll in 2026',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    handle: '@AlexRiveraStudio',
    durationOrPhotos: '00:45',
    status: 'SCHEDULED',
  },
  {
    id: 'ev-4',
    dayOfMonth: 26,
    timeStr: '14:30 PM',
    title: 'Behind the Scenes: Editing Workflow V2',
    platform: 'FACEBOOK',
    format: 'FEED_POST',
    handle: 'Alex Rivera Studio',
    durationOrPhotos: 'Album (4)',
    status: 'SCHEDULED',
  },
  {
    id: 'ev-5',
    dayOfMonth: 22,
    timeStr: '09:15 AM',
    title: 'Studio Redesign Tour Master Cut',
    platform: 'YOUTUBE',
    format: 'VIDEO_REEL',
    handle: '@AlexRiveraStudio',
    durationOrPhotos: '00:58',
    status: 'PUBLISHED',
  },
];

export default function EditorialCalendarPage() {
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TIKTOK'>('ALL');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'FEED_POST' | 'STORY' | 'VIDEO_REEL'>('ALL');
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: 3 }, (_, i) => i);

  const filteredEvents = SAMPLE_EVENTS.filter((ev) => {
    const matchesPlatform = platformFilter === 'ALL' || ev.platform === platformFilter;
    const matchesFormat = formatFilter === 'ALL' || ev.format === formatFilter;
    return matchesPlatform && matchesFormat;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="EDITORIAL CADENCE / TIMELINE DESK"
        editionDate="OCTOBER 2026"
        title="Editorial Calendar & Cadence"
        subtitle="Timezone-synchronized schedule of Feed Posts, 24h Stories, and Video Releases across Meta, YouTube, and TikTok."
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white text-xs font-semibold rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Post</span>
            </Link>
          </div>
        }
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 p-4 bg-paper-raised border border-border-rule rounded-card text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-border-rule rounded-editorial bg-paper-canvas p-1">
            <button className="p-1 hover:bg-paper-subtle rounded text-ink-secondary">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-serif font-bold text-sm px-2 text-ink-primary">{currentMonth}</span>
            <button className="p-1 hover:bg-paper-subtle rounded text-ink-secondary">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-ink-secondary">
            <span className="w-2 h-2 rounded-full bg-semantic-success" />
            <span>Timezone: Asia/Bangkok (UTC+7)</span>
          </div>
        </div>

        {/* Format & Platform Filters */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Format Tabs */}
          <div className="flex items-center gap-1 border border-border-rule rounded-editorial p-0.5 bg-paper-subtle">
            {(['ALL', 'FEED_POST', 'STORY', 'VIDEO_REEL'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  formatFilter === fmt
                    ? 'bg-paper-canvas text-brand-indigo font-bold shadow-xs'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {fmt === 'ALL' ? 'All Formats' : fmt === 'FEED_POST' ? 'Feed' : fmt === 'STORY' ? 'Story' : 'Video'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
        <div className="grid grid-cols-7 border-b border-border-rule bg-paper-subtle font-mono text-[11px] text-ink-secondary uppercase text-center py-2.5">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-border-rule">
          {leadingBlanks.map((b) => (
            <div key={`blank-${b}`} className="min-h-[115px] bg-paper-canvas/30 p-2" />
          ))}

          {daysInMonth.map((day) => {
            const dayEvents = filteredEvents.filter((e) => e.dayOfMonth === day);
            const isToday = day === 23;

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[115px] p-2 transition-colors hover:bg-paper-subtle/30 ${
                  isToday ? 'bg-brand-indigo/5' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-serif text-sm font-semibold ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs'
                        : 'text-ink-primary'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[9px] font-mono text-ink-secondary">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-1.5 rounded bg-paper-canvas border border-border-rule hover:border-brand-indigo/50 transition-colors cursor-pointer text-[10px]"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono font-bold text-ink-secondary flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ev.platform === 'INSTAGRAM'
                                ? 'bg-[#DD2A7B]'
                                : ev.platform === 'FACEBOOK'
                                ? 'bg-[#1877F2]'
                                : ev.platform === 'YOUTUBE'
                                ? 'bg-[#FF0000]'
                                : 'bg-ink-primary'
                            }`}
                          />
                          {ev.timeStr}
                        </span>
                        <span
                          className={`px-1 py-0.2 rounded text-[8px] font-mono font-bold uppercase ${
                            ev.format === 'STORY'
                              ? 'bg-accent-terracotta/10 text-accent-terracotta'
                              : ev.format === 'FEED_POST'
                              ? 'bg-brand-indigo/10 text-brand-indigo'
                              : 'bg-semantic-info/10 text-semantic-info'
                          }`}
                        >
                          {ev.format === 'STORY' ? 'Story' : ev.format === 'FEED_POST' ? 'Feed' : 'Reel'}
                        </span>
                      </div>
                      <p className="font-serif font-medium text-ink-primary line-clamp-1 leading-tight">
                        {ev.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
