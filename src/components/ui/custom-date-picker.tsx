'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export interface DateMarker {
  dots?: string[]; // Array of tailwind color classes e.g. ['bg-brand-indigo', 'bg-accent-terracotta']
  badge?: string;  // e.g. '🔥 Peak'
  isPeak?: boolean;
}

export interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  clearable?: boolean;
  markedDates?: Record<string, DateMarker>; // e.g. { '2026-10-24': { isPeak: true } }
  helperText?: string;
  error?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  fullWidth?: boolean;
  showPresets?: boolean;
}

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const SHORT_MONTHS_TH = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const WEEKDAY_NAMES = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
const SHORT_WEEKDAYS = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];

// Helper to pad single digits
function pad(num: number): string {
  return String(num).padStart(2, '0');
}

// Format YYYY-MM-DD to friendly string
export function formatDateDisplay(dateStr: string, locale: 'th' | 'en' = 'th'): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);

  if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;

  if (locale === 'th') {
    return `${d} ${SHORT_MONTHS_TH[m] || ''} ${y}`;
  }
  return `${MONTH_NAMES_EN[m]?.substring(0, 3)} ${d}, ${y}`;
}

export function CustomDatePicker({
  value,
  onChange,
  label,
  placeholder = 'เลือกวันที่...',
  minDate,
  maxDate,
  disabled = false,
  clearable = false,
  markedDates = {},
  helperText,
  error,
  className = '',
  size = 'md',
  align = 'left',
  fullWidth = true,
  showPresets = true,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected or fallback to today
  const parsedDate = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return { year: y, month: m - 1, day: d };
    }
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
  }, [value]);

  // View state for month/year browsing
  const [viewYear, setViewYear] = useState(parsedDate.year);
  const [viewMonth, setViewMonth] = useState(parsedDate.month);

  // Sync view when value changes from outside
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value]);

  // Today string
  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  }, []);

  // Close when clicking outside
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

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Quick Preset Actions
  const handleQuickPreset = (preset: 'TODAY' | 'TOMORROW' | 'WEEKEND' | 'NEXT_MON') => {
    const d = new Date();
    if (preset === 'TODAY') {
      // today
    } else if (preset === 'TOMORROW') {
      d.setDate(d.getDate() + 1);
    } else if (preset === 'WEEKEND') {
      const day = d.getDay(); // 0 is Sun, 6 is Sat
      const daysUntilSaturday = day === 6 ? 0 : (6 - day + 7) % 7;
      d.setDate(d.getDate() + daysUntilSaturday);
    } else if (preset === 'NEXT_MON') {
      const day = d.getDay();
      const daysUntilMonday = ((1 - day + 7) % 7) || 7;
      d.setDate(d.getDate() + daysUntilMonday);
    }

    const res = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    onChange(res);
    setIsOpen(false);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon
    // Convert to Monday = 0
    const startOffset = (firstDayIndex + 6) % 7;

    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
      marker?: DateMarker;
    }> = [];

    // Prev month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = viewMonth === 0 ? 12 : viewMonth;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dStr = `${prevY}-${pad(prevM)}-${pad(d)}`;
      days.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: false,
        isToday: dStr === todayStr,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(i)}`;
      const isDisabled = Boolean(
        (minDate && dStr < minDate) || (maxDate && dStr > maxDate)
      );
      days.push({
        dateStr: dStr,
        dayNumber: i,
        isCurrentMonth: true,
        isDisabled,
        isSelected: dStr === value,
        isToday: dStr === todayStr,
        marker: markedDates[dStr],
      });
    }

    // Next month padding to fill complete weeks (up to 42 cells)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextM = viewMonth === 11 ? 1 : viewMonth + 2;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dStr = `${nextY}-${pad(nextM)}-${pad(i)}`;
      days.push({
        dateStr: dStr,
        dayNumber: i,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: false,
        isToday: dStr === todayStr,
      });
    }

    return days;
  }, [viewYear, viewMonth, todayStr, value, minDate, maxDate, markedDates]);

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
          <CalendarIcon className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
          {value ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-ink-primary font-mono text-xs">
                {value}
              </span>
              <span className="text-[11px] text-ink-secondary truncate">
                ({formatDateDisplay(value, 'th')})
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
              title="Clear date"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </button>

      {/* Error or Helper text */}
      {error ? (
        <p className="mt-1 text-[10px] font-mono text-semantic-error">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[10px] font-mono text-ink-secondary">{helperText}</p>
      ) : null}

      {/* Popover Calendar Modal */}
      {isOpen && (
        <div
          role="dialog"
          className={`absolute mt-1.5 bg-paper-raised border border-border-strong rounded-card shadow-xl p-3 z-50 w-[290px] animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Quick Presets Bar */}
          {showPresets && (
            <div className="flex items-center gap-1 pb-2.5 mb-2.5 border-b border-border-rule overflow-x-auto text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handleQuickPreset('TODAY')}
                className="px-2 py-0.5 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary whitespace-nowrap transition-colors cursor-pointer"
              >
                วันนี้
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('TOMORROW')}
                className="px-2 py-0.5 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary whitespace-nowrap transition-colors cursor-pointer"
              >
                พรุ่งนี้
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('WEEKEND')}
                className="px-2 py-0.5 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-brand-indigo font-semibold whitespace-nowrap transition-colors cursor-pointer"
              >
                สุดสัปดาห์ 🔥
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('NEXT_MON')}
                className="px-2 py-0.5 rounded bg-paper-canvas hover:bg-paper-subtle border border-border-rule text-ink-primary whitespace-nowrap transition-colors cursor-pointer"
              >
                จันทร์หน้า
              </button>
            </div>
          )}

          {/* Month / Year Header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center font-sans">
              <span className="text-xs font-bold text-ink-primary">
                {MONTH_NAMES_TH[viewMonth]} {viewYear}
              </span>
              <span className="text-[10px] font-mono text-ink-secondary block">
                {MONTH_NAMES_EN[viewMonth]}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {SHORT_WEEKDAYS.map((wd, i) => (
              <span
                key={wd}
                className={`text-[10px] font-mono font-semibold ${
                  i >= 5 ? 'text-accent-terracotta' : 'text-ink-secondary'
                }`}
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cd, index) => {
              return (
                <button
                  key={`${cd.dateStr}-${index}`}
                  type="button"
                  disabled={cd.isDisabled}
                  onClick={() => {
                    if (!cd.isDisabled) {
                      onChange(cd.dateStr);
                      setIsOpen(false);
                    }
                  }}
                  className={`relative h-7 w-full flex flex-col items-center justify-center rounded text-xs font-mono transition-all ${
                    cd.isSelected
                      ? 'bg-brand-indigo text-white font-bold shadow-xs'
                      : cd.isToday
                      ? 'border border-brand-indigo/60 text-brand-indigo font-bold bg-brand-indigo/5'
                      : cd.isCurrentMonth
                      ? 'text-ink-primary hover:bg-paper-subtle cursor-pointer'
                      : 'text-ink-secondary/30 hover:bg-transparent cursor-not-allowed'
                  } ${
                    cd.isDisabled && cd.isCurrentMonth
                      ? 'opacity-30 cursor-not-allowed line-through hover:bg-transparent'
                      : ''
                  }`}
                >
                  <span className="leading-none">{cd.dayNumber}</span>

                  {/* Marker Dots or Peak Indicator */}
                  {cd.marker && (
                    <div className="absolute bottom-0.5 flex items-center justify-center gap-0.5">
                      {cd.marker.isPeak && (
                        <span className="w-1 h-1 rounded-full bg-accent-terracotta" />
                      )}
                      {cd.marker.dots?.map((c, i) => (
                        <span key={i} className={`w-1 h-1 rounded-full ${c}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Today Indicator */}
          <div className="mt-2.5 pt-2 border-t border-border-rule flex items-center justify-between text-[10px] font-mono text-ink-secondary">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta" />
              <span>ช่วงเวลา Peak วันเสาร์-อาทิตย์</span>
            </span>
            <button
              type="button"
              onClick={() => {
                onChange(todayStr);
                setIsOpen(false);
              }}
              className="text-brand-indigo hover:underline font-semibold cursor-pointer"
            >
              เลือกวันนี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
