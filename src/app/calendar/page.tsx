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

interface CalendarEventItem {
  id: string;
  dayOfMonth: number;
  timeStr: string;
  title: string;
  platform: 'YOUTUBE' | 'TIKTOK';
  handle: string;
  duration: string;
  status: 'SCHEDULED' | 'PUBLISHED';
}

const SAMPLE_EVENTS: CalendarEventItem[] = [
  {
    id: 'ev-1',
    dayOfMonth: 24,
    timeStr: '09:00 AM',
    title: '3 Hooks That Stop the Scroll in 2026',
    platform: 'YOUTUBE',
    handle: '@AlexRiveraStudio',
    duration: '00:45',
    status: 'SCHEDULED',
  },
  {
    id: 'ev-2',
    dayOfMonth: 24,
    timeStr: '09:00 AM',
    title: '3 Hooks That Stop the Scroll in 2026',
    platform: 'TIKTOK',
    handle: '@alexrivera_official',
    duration: '00:45',
    status: 'SCHEDULED',
  },
  {
    id: 'ev-3',
    dayOfMonth: 26,
    timeStr: '14:30 PM',
    title: 'Behind the Scenes: Editing Workflow V2',
    platform: 'YOUTUBE',
    handle: '@AlexRiveraStudio',
    duration: '01:15',
    status: 'SCHEDULED',
  },
  {
    id: 'ev-4',
    dayOfMonth: 22,
    timeStr: '09:15 AM',
    title: 'Studio Redesign Tour Master Cut',
    platform: 'YOUTUBE',
    handle: '@AlexRiveraStudio',
    duration: '00:58',
    status: 'PUBLISHED',
  },
];

export default function EditorialCalendarPage() {
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'YOUTUBE' | 'TIKTOK'>('ALL');
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  // Days of the month: October 2026 has 31 days (starts on Thursday Oct 1)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: 3 }, (_, i) => i); // Thu starts at index 3 (0=Mon, 1=Tue, 2=Wed, 3=Thu)

  const filteredEvents = SAMPLE_EVENTS.filter(
    (ev) => platformFilter === 'ALL' || ev.platform === platformFilter
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Masthead
        folio="EDITORIAL CADENCE / TIMELINE DESK"
        editionDate="OCTOBER 2026"
        title="Editorial Calendar & Cadence"
        subtitle="Timezone-synchronized schedule of multi-platform releases, scheduled dispatches, and embargo timelines."
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

      {/* Timezone & Navigation Header */}
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

        {/* Platform Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['ALL', 'YOUTUBE', 'TIKTOK'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1 rounded-editorial transition-colors ${
                platformFilter === p
                  ? 'bg-paper-subtle text-brand-indigo font-bold border border-border-rule'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid (Newspaper Editorial Layout) */}
      <div className="bg-paper-raised border border-border-rule rounded-card overflow-hidden shadow-xs">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-border-rule bg-paper-subtle font-mono text-[11px] text-ink-secondary uppercase text-center py-2.5">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border-rule">
          {/* Leading blank slots */}
          {leadingBlanks.map((b) => (
            <div key={`blank-${b}`} className="min-h-[110px] bg-paper-canvas/30 p-2" />
          ))}

          {/* Month Days */}
          {daysInMonth.map((day) => {
            const dayEvents = filteredEvents.filter((e) => e.dayOfMonth === day);
            const isToday = day === 23;

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[110px] p-2 transition-colors hover:bg-paper-subtle/30 ${
                  isToday ? 'bg-brand-indigo/5' : ''
                }`}
              >
                {/* Day Header */}
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
                      {dayEvents.length} post{dayEvents.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Day Events Pill List */}
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
                              ev.platform === 'YOUTUBE' ? 'bg-[#FF0000]' : 'bg-ink-primary'
                            }`}
                          />
                          {ev.timeStr}
                        </span>
                        <span className="font-mono text-[9px] text-ink-secondary">{ev.duration}</span>
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
