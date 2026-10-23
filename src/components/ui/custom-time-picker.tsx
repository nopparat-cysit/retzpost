'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Sparkles, 
  Flame,
  Check
} from 'lucide-react';

export interface TimePeakSlot {
  time: string; // e.g. '08:30 AM' or '19:30 PM'
  label: string; // e.g. 'เช้าคอนโด & อสังหาฯ'
  badge?: string;
  isPeak?: boolean;
}

export interface CustomTimePickerProps {
  value: string; // e.g. '09:30 AM' or '09:30'
  onChange: (timeStr: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  format24?: boolean; // false = 12h with AM/PM (default), true = 24h
  helperText?: string;
  error?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  fullWidth?: boolean;
  showPeakSlots?: boolean;
}

export const BANGKOK_PEAK_SLOTS: TimePeakSlot[] = [
  { time: '08:30 AM', label: 'ช่วงเช้า: คอนโด & ผู้บริหาร', badge: '🔥 Prime', isPeak: true },
  { time: '11:30 AM', label: 'พักเที่ยง: Story & โปรโมชั่น', badge: '📱 Swipes', isPeak: false },
  { time: '14:00 PM', label: 'ช่วงบ่าย: คาเฟ่ & SME', badge: '☕ Active', isPeak: false },
  { time: '19:30 PM', label: 'หัวค่ำ: ยอด Reach & Engagement สูงสุด', badge: '🔥 Peak Window', isPeak: true },
  { time: '21:00 PM', label: 'รอบดึก: Reels & TikTok สบายๆ', badge: '🌙 Viral', isPeak: false },
];

// Helper to parse time string
export function parseTimeString(timeStr: string): { hour: number; minute: number; period: 'AM' | 'PM' } {
  if (!timeStr) return { hour: 9, minute: 0, period: 'AM' };

  // Format: '09:30 AM' or '09:30 PM'
  const match12 = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    const p = match12[3] ? (match12[3].toUpperCase() as 'AM' | 'PM') : h >= 12 ? 'PM' : 'AM';
    if (h > 12) h = h - 12;
    if (h === 0) h = 12;
    return { hour: h, minute: m, period: p };
  }

  // Format: '19:30' (24-hour)
  const match24 = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const rawH = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    const p = rawH >= 12 ? 'PM' : 'AM';
    let h = rawH % 12;
    if (h === 0) h = 12;
    return { hour: h, minute: m, period: p };
  }

  return { hour: 9, minute: 0, period: 'AM' };
}

// Helper to format output
export function formatTimeOutput(hour: number, minute: number, period: 'AM' | 'PM', format24: boolean): string {
  const padH = String(hour).padStart(2, '0');
  const padM = String(minute).padStart(2, '0');

  if (format24) {
    let h24 = hour;
    if (period === 'PM' && hour < 12) h24 = hour + 12;
    if (period === 'AM' && hour === 12) h24 = 0;
    return `${String(h24).padStart(2, '0')}:${padM}`;
  }

  return `${padH}:${padM} ${period}`;
}

export function CustomTimePicker({
  value,
  onChange,
  label,
  placeholder = 'เลือกเวลา...',
  disabled = false,
  clearable = false,
  format24 = false,
  helperText,
  error,
  className = '',
  size = 'md',
  align = 'left',
  fullWidth = true,
  showPeakSlots = true,
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseTimeString(value), [value]);

  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  // Sync internal state when prop value changes
  useEffect(() => {
    const p = parseTimeString(value);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update change handler
  const commitTime = (h: number, m: number, p: 'AM' | 'PM') => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedPeriod(p);
    const formatted = formatTimeOutput(h, m, p, format24);
    onChange(formatted);
  };

  // Stepper adjustments
  const handleStepMinute = (delta: number) => {
    let newM = selectedMinute + delta;
    let newH = selectedHour;
    let newP = selectedPeriod;

    if (newM >= 60) {
      newM = newM % 60;
      newH = newH === 12 ? 1 : newH + 1;
      if (newH === 12) newP = newP === 'AM' ? 'PM' : 'AM';
    } else if (newM < 0) {
      newM = 60 + newM;
      newH = newH === 1 ? 12 : newH - 1;
      if (newH === 11) newP = newP === 'AM' ? 'PM' : 'AM';
    }

    commitTime(newH, newM, newP);
  };

  // Hours list (1 to 12)
  const hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // Common minutes list
  const minutesList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-2.5 py-1.5 text-xs gap-2',
    lg: 'px-3.5 py-2 text-sm gap-2.5',
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {label && (
        <label className="block text-[11px] font-mono uppercase text-ink-secondary font-semibold mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between bg-paper-canvas border rounded-editorial transition-all shadow-2xs font-sans text-left ${
          sizeStyles[size]
        } ${
          error
            ? 'border-semantic-error text-semantic-error'
            : isOpen
            ? 'border-brand-indigo ring-1 ring-brand-indigo/30'
            : 'border-border-rule hover:border-brand-indigo/60'
        } ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-paper-subtle/50'
            : 'cursor-pointer hover:bg-paper-raised'
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          <Clock className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
          {value ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-ink-primary font-mono text-xs">
                {value}
              </span>
              <span className="text-[10px] font-mono text-ink-secondary">
                (BKK UTC+7)
              </span>
            </div>
          ) : (
            <span className="text-ink-secondary/60 truncate font-mono text-[11px]">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1.5">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 hover:bg-paper-subtle rounded text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              title="Clear time"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </button>

      {/* Helper or Error */}
      {error ? (
        <p className="mt-1 text-[10px] font-mono text-semantic-error">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[10px] font-mono text-ink-secondary">{helperText}</p>
      ) : null}

      {/* Popover Time Modal */}
      {isOpen && (
        <div
          role="dialog"
          className={`absolute mt-1.5 bg-paper-raised border border-border-strong rounded-card shadow-xl p-3 z-50 w-[300px] animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border-rule">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-indigo" />
              <span className="text-xs font-bold text-ink-primary font-sans">
                Dispatch Time Picker
              </span>
            </div>
            <span className="text-[10px] font-mono text-ink-secondary">
              Asia/Bangkok (UTC+7)
            </span>
          </div>

          {/* AI Peak Hour Quick Picks */}
          {showPeakSlots && (
            <div className="mb-3 space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-mono text-ink-secondary uppercase font-bold">
                <Flame className="w-3 h-3 text-accent-terracotta" />
                <span>Peak Engagement Presets:</span>
              </div>
              <div className="space-y-1">
                {BANGKOK_PEAK_SLOTS.map((slot) => {
                  const isSlotActive = value === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => {
                        onChange(slot.time);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors text-[11px] ${
                        isSlotActive
                          ? 'bg-brand-indigo text-white font-semibold shadow-2xs'
                          : 'bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold">{slot.time}</span>
                        <span className="text-[10px] opacity-80 truncate">{slot.label}</span>
                      </div>
                      {slot.badge && (
                        <span
                          className={`px-1 py-0.2 rounded text-[9px] font-mono font-semibold shrink-0 ${
                            isSlotActive
                              ? 'bg-white/20 text-white'
                              : slot.isPeak
                              ? 'bg-accent-terracotta/15 text-accent-terracotta'
                              : 'bg-brand-indigo/10 text-brand-indigo'
                          }`}
                        >
                          {slot.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Manual Interactive Time Adjustment */}
          <div className="p-2.5 bg-paper-canvas rounded-editorial border border-border-rule space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-ink-secondary uppercase font-bold">
              <span>Manual Time Selector:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStepMinute(-15)}
                  className="px-1.5 py-0.5 rounded bg-paper-subtle hover:bg-paper-raised text-ink-primary border border-border-rule transition-colors cursor-pointer"
                  title="Minus 15 minutes"
                >
                  -15m
                </button>
                <button
                  type="button"
                  onClick={() => handleStepMinute(+15)}
                  className="px-1.5 py-0.5 rounded bg-paper-subtle hover:bg-paper-raised text-ink-primary border border-border-rule transition-colors cursor-pointer"
                  title="Plus 15 minutes"
                >
                  +15m
                </button>
              </div>
            </div>

            {/* Wheels / Grid: Hours, Minutes, AM/PM */}
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Hour Dropdown / Wheel */}
              <div className="col-span-4">
                <label className="block text-[9px] font-mono text-ink-secondary mb-0.5 text-center">
                  Hour (ชม.)
                </label>
                <select
                  value={selectedHour}
                  onChange={(e) => commitTime(Number(e.target.value), selectedMinute, selectedPeriod)}
                  className="w-full text-center py-1.5 bg-paper-raised border border-border-rule rounded text-xs font-mono font-bold text-ink-primary focus:outline-hidden focus:border-brand-indigo cursor-pointer shadow-2xs"
                >
                  {hoursList.map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 text-center font-bold text-ink-secondary text-sm">
                :
              </div>

              {/* Minute Dropdown / Wheel */}
              <div className="col-span-4">
                <label className="block text-[9px] font-mono text-ink-secondary mb-0.5 text-center">
                  Minute (นาที)
                </label>
                <select
                  value={selectedMinute}
                  onChange={(e) => commitTime(selectedHour, Number(e.target.value), selectedPeriod)}
                  className="w-full text-center py-1.5 bg-paper-raised border border-border-rule rounded text-xs font-mono font-bold text-ink-primary focus:outline-hidden focus:border-brand-indigo cursor-pointer shadow-2xs"
                >
                  {minutesList.map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              {/* AM / PM Toggle */}
              <div className="col-span-3">
                <label className="block text-[9px] font-mono text-ink-secondary mb-0.5 text-center">
                  Period
                </label>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => commitTime(selectedHour, selectedMinute, 'AM')}
                    className={`py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
                      selectedPeriod === 'AM'
                        ? 'bg-brand-indigo text-white shadow-2xs'
                        : 'bg-paper-raised border border-border-rule text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => commitTime(selectedHour, selectedMinute, 'PM')}
                    className={`py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
                      selectedPeriod === 'PM'
                        ? 'bg-brand-indigo text-white shadow-2xs'
                        : 'bg-paper-raised border border-border-rule text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-2.5 pt-2 border-t border-border-rule flex items-center justify-between">
            <span className="text-[10px] font-mono text-ink-secondary">
              เลือกเวลา: <strong className="text-brand-indigo font-bold">{formatTimeOutput(selectedHour, selectedMinute, selectedPeriod, format24)}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-brand-indigo text-white text-xs font-mono font-semibold rounded hover:bg-brand-indigo-hover transition-colors shadow-2xs cursor-pointer"
            >
              ยืนยันเวลา
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
