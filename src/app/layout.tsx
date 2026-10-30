import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { LanguageProvider } from '@/modules/i18n/i18n-context';

export const metadata: Metadata = {
  title: 'RETZPOST — Dream Press Publishing Desk',
  description: 'Upload once. Adapt and publish everywhere. Multi-platform video publishing engine for creators and teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-paper-canvas text-ink-primary antialiased selection:bg-brand-indigo selection:text-white">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
