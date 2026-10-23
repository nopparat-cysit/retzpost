'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Filter } from 'lucide-react';

export interface SmartFilterItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  badgeColor?: string;
  category?: string;
}

export interface SmartFilterBarProps {
  label?: React.ReactNode;
  items: SmartFilterItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  maxVisiblePills?: number;
  searchPlaceholder?: string;
  moreButtonText?: string;
  className?: string;
  pillClassName?: string;
  activePillClassName?: string;
}

export function SmartFilterBar({
  label,
  items,
  selectedId,
  onSelect,
  maxVisiblePills = 4,
  searchPlaceholder = 'ค้นหารายการ...',
  moreButtonText,
  className = '',
  pillClassName = '',
  activePillClassName = '',
}: SmartFilterBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Determine visible pills vs overflow items
  // Smart rule: If selected item is beyond maxVisiblePills, bring it into visible pills so active state is always visible!
  const { visiblePills, overflowItems } = useMemo(() => {
    if (items.length <= maxVisiblePills) {
      return { visiblePills: items, overflowItems: [] };
    }

    const firstChunk = items.slice(0, maxVisiblePills);
    const selectedItem = items.find((i) => i.id === selectedId);

    // If selected item is already in first chunk or is not found, keep standard split
    if (!selectedItem || firstChunk.some((i) => i.id === selectedId)) {
      return {
        visiblePills: firstChunk,
        overflowItems: items.slice(maxVisiblePills),
      };
    }

    // Selected item is in overflow: swap the last item in visible chunk with the selected item
    const customVisible = [...firstChunk.slice(0, maxVisiblePills - 1), selectedItem];
    const customOverflow = items.filter((i) => !customVisible.some((v) => v.id === i.id));

    return {
      visiblePills: customVisible,
      overflowItems: customOverflow,
    };
  }, [items, selectedId, maxVisiblePills]);

  // Filter overflow items based on search query
  const filteredOverflowItems = useMemo(() => {
    if (!searchQuery.trim()) return overflowItems;
    const q = searchQuery.toLowerCase().trim();
    return overflowItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [overflowItems, searchQuery]);

  // Check if selected item is currently in overflow
  const isSelectedInOverflow = overflowItems.some((i) => i.id === selectedId);

  return (
    <div className={`flex items-center gap-1.5 flex-wrap sm:flex-nowrap ${className}`}>
      {/* Optional Leading Label */}
      {label && <div className="shrink-0 flex items-center">{label}</div>}

      {/* Main Visible Pills */}
      <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap shrink-0">
        {visiblePills.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isSelected
                  ? activePillClassName || 'bg-brand-indigo text-white font-semibold shadow-2xs'
                  : pillClassName ||
                    'bg-paper-subtle text-ink-secondary hover:text-ink-primary border border-border-rule hover:bg-paper-canvas'
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="truncate max-w-[170px] sm:max-w-[210px]">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-paper-raised text-ink-muted border border-border-rule'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Overflow "+N More" Smart Popover Trigger */}
        {overflowItems.length > 0 && (
          <div className="relative shrink-0" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDropdownOpen || isSelectedInOverflow
                  ? 'bg-paper-canvas text-brand-indigo border-brand-indigo font-bold shadow-2xs ring-1 ring-brand-indigo/30'
                  : 'bg-paper-subtle text-ink-secondary hover:text-ink-primary border-border-rule hover:bg-paper-canvas'
              }`}
              title={`ดูอีก ${overflowItems.length} รายการ`}
            >
              <Filter className="w-3 h-3 text-brand-indigo" />
              <span>
                {moreButtonText
                  ? `${moreButtonText} (${overflowItems.length})`
                  : `+${overflowItems.length} more`}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180 text-brand-indigo' : 'text-ink-muted'}`}
              />
            </button>

            {/* Smart Dropdown Popover */}
            {isDropdownOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-72 sm:w-80 bg-paper-canvas border border-border-rule rounded-card shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                {/* Search Bar inside popover */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-7 py-1.5 bg-paper-subtle border border-border-rule rounded-editorial text-xs font-mono text-ink-primary placeholder:text-ink-muted focus:outline-hidden focus:border-brand-indigo"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Items List */}
                <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
                  {filteredOverflowItems.length === 0 ? (
                    <div className="py-4 text-center text-xs font-mono text-ink-muted">
                      ไม่พบรายการที่ตรงกับ &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    filteredOverflowItems.map((item) => {
                      const isSelected = item.id === selectedId;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelect(item.id);
                            setIsDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-editorial text-xs font-mono transition-colors flex items-center justify-between text-left cursor-pointer ${
                            isSelected
                              ? 'bg-brand-indigo/10 text-brand-indigo font-bold border border-brand-indigo/30'
                              : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-subtle'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {item.icon && <span className="shrink-0">{item.icon}</span>}
                            <span className="truncate">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {item.count !== undefined && (
                              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-paper-subtle border border-border-rule text-ink-muted">
                                {item.count}
                              </span>
                            )}
                            {isSelected && <Check className="w-3.5 h-3.5 text-brand-indigo" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Popover Footer summary */}
                <div className="pt-1.5 border-t border-border-rule flex items-center justify-between text-[10px] font-mono text-ink-muted">
                  <span>ทั้งหมด {items.length} รายการ</span>
                  <span className="text-ink-secondary">กด ESC เพื่อปิด</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
