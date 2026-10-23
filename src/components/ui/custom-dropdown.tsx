'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  description?: string;
  category?: string;
  disabled?: boolean;
}

export interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  prefixIcon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  fullWidth?: boolean;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'เลือกรายการ...',
  label,
  helperText,
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'ค้นหา...',
  clearable = false,
  prefixIcon,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  size = 'md',
  align = 'left',
  fullWidth = true,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Selected Option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Filtered Options
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)) ||
        (opt.category && opt.category.toLowerCase().includes(q))
    );
  }, [options, searchable, searchQuery]);

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
          const idx = filteredOptions.findIndex((opt) => opt.value === value);
          setHighlightedIndex(idx >= 0 ? idx : 0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
            return next;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
            return next;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            const opt = filteredOptions[highlightedIndex];
            if (!opt.disabled) {
              onChange(opt.value);
              setIsOpen(false);
              setSearchQuery('');
              setHighlightedIndex(-1);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
          break;
        case 'Tab':
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
          break;
      }
    },
    [disabled, isOpen, filteredOptions, value, highlightedIndex, onChange]
  );

  // Size styling
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-2.5 py-1.5 text-xs gap-2',
    lg: 'px-3.5 py-2 text-sm gap-2.5',
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${fullWidth ? 'w-full' : ''} ${className}`}
      onKeyDown={handleKeyDown}
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
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              const idx = filteredOptions.findIndex((opt) => opt.value === value);
              setHighlightedIndex(idx >= 0 ? idx : 0);
            }
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between bg-paper-canvas border rounded-editorial transition-all shadow-2xs font-sans text-left ${
          sizeStyles[size]
        } ${
          error
            ? 'border-semantic-error text-semantic-error focus:ring-1 focus:ring-semantic-error'
            : isOpen
            ? 'border-brand-indigo ring-1 ring-brand-indigo/30'
            : 'border-border-rule hover:border-brand-indigo/60'
        } ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-paper-subtle/50'
            : 'cursor-pointer hover:bg-paper-raised'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {prefixIcon && <span className="shrink-0 text-ink-secondary">{prefixIcon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span className="font-medium text-ink-primary truncate">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold shrink-0 ${
                    selectedOption.badgeColor || 'bg-brand-indigo/10 text-brand-indigo'
                  }`}
                >
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-ink-secondary/60 truncate font-mono text-[11px]">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1.5">
          {clearable && selectedOption && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 hover:bg-paper-subtle rounded text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-ink-secondary transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-brand-indigo' : ''
            }`}
          />
        </div>
      </button>

      {/* Helper text or Error */}
      {error ? (
        <p className="mt-1 text-[10px] font-mono text-semantic-error">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[10px] font-mono text-ink-secondary">{helperText}</p>
      ) : null}

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          className={`absolute mt-1 bg-paper-raised border border-border-strong rounded-editorial shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${
            fullWidth ? 'left-0 right-0' : align === 'right' ? 'right-0 min-w-[220px]' : 'left-0 min-w-[220px]'
          } ${menuClassName}`}
        >
          {/* Optional Search Input */}
          {searchable && (
            <div className="p-1.5 pb-2 border-b border-border-rule mb-1">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2 text-ink-secondary pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full pl-7 pr-7 py-1 text-xs bg-paper-canvas border border-border-rule rounded text-ink-primary placeholder:text-ink-secondary/50 focus:outline-hidden focus:border-brand-indigo font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-ink-secondary hover:text-ink-primary"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs font-mono text-ink-secondary">
                ไม่พบข้อมูลที่ค้นหา
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchQuery('');
                        setHighlightedIndex(-1);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors text-xs ${
                      isSelected
                        ? 'bg-paper-canvas text-brand-indigo font-semibold border border-brand-indigo/20 shadow-2xs'
                        : isHighlighted
                        ? 'bg-paper-subtle text-ink-primary'
                        : 'text-ink-primary hover:bg-paper-subtle'
                    } ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                        : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate">{opt.label}</span>
                          {opt.badge && (
                            <span
                              className={`px-1 py-0.2 rounded text-[9px] font-mono shrink-0 font-medium ${
                                opt.badgeColor || 'bg-brand-indigo/10 text-brand-indigo'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.description && (
                          <p className="text-[10px] font-mono text-ink-secondary leading-tight mt-0.5 truncate">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-brand-indigo shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
