import React from 'react';

interface MastheadProps {
  folio?: string;
  editionDate?: string;
  sectionNumber?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Masthead: React.FC<MastheadProps> = ({
  folio = 'DISPATCH DESK / VOL. 01',
  editionDate = 'AUTUMN 2026',
  sectionNumber,
  title,
  subtitle,
  actions,
}) => {
  return (
    <header className="w-full pb-5 mb-6 editorial-rule">
      {/* Top Folio Strip */}
      <div className="flex items-center justify-between text-xs font-mono text-ink-secondary uppercase tracking-wider mb-2">
        <div className="flex items-center gap-3">
          <span>{folio}</span>
          <span className="text-border-rule">|</span>
          <span>{editionDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          <span className="text-[11px]">System Ready</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1">
        <div>
          <div className="flex items-baseline gap-3">
            {sectionNumber && (
              <span className="font-mono text-sm text-brand-indigo font-bold tracking-tight">
                [{sectionNumber}]
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-ink-primary tracking-tight">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="mt-1.5 text-sm md:text-base text-ink-secondary max-w-2xl font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </header>
  );
};
