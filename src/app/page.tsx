import React from 'react';
import { Masthead } from '@/components/ui/masthead';
import { StatusTag } from '@/components/ui/status-tag';
import { Layers, ShieldCheck, Database, Cpu, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <Masthead
        title="MULTIPOST / Dream Press"
        subtitle="Upload once. Adapt and publish everywhere. Multi-platform video publishing engine for creators and content teams."
        folio="SYSTEM DISPATCH / ARCHITECTURE READY"
        editionDate="OCTOBER 2026"
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white text-sm font-medium rounded-editorial hover:bg-brand-indigo-hover transition-colors shadow-sm">
            <span>Compose Dispatch</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        }
      />

      {/* Grid of Modules */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-paper-raised p-6 rounded-card border border-border-rule shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-paper-subtle rounded-editorial text-brand-indigo">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-medium">Prisma ORM Schema</h2>
          </div>
          <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
            Schema พร้อมใช้งานครบ 13 ตาราง: Workspace, Memberships, Encrypted Connections, MediaAssets, Drafts, PublishBatches, และ PublishJobs
          </p>
          <div className="flex items-center justify-between text-xs font-mono text-ink-secondary pt-3 border-t border-border-rule">
            <span>Model Count</span>
            <span className="font-semibold text-ink-primary">13 Entities</span>
          </div>
        </div>

        <div className="bg-paper-raised p-6 rounded-card border border-border-rule shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-paper-subtle rounded-editorial text-semantic-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-medium">Token Vault Service</h2>
          </div>
          <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
            ระบบเข้ารหัส AES-256-GCM สำหรับเก็บ OAuth Access/Refresh Tokens ปลอดภัยที่ระดับ Application พร้อมรองรับ Key Rotation แบบอัตโนมัติ
          </p>
          <div className="flex items-center justify-between text-xs font-mono text-ink-secondary pt-3 border-t border-border-rule">
            <span>Encryption Standard</span>
            <span className="font-semibold text-ink-primary">AES-256-GCM</span>
          </div>
        </div>

        <div className="bg-paper-raised p-6 rounded-card border border-border-rule shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-paper-subtle rounded-editorial text-accent-terracotta">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-medium">Publishing State Machine</h2>
          </div>
          <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
            ตัวคำนวณสถานะรวมของ Batch ป้องกันการสรุปผิดพลาดเมื่อเกิด Partial Failure (เช่น YouTube สำเร็จแต่ TikTok ล้มเหลว)
          </p>
          <div className="flex items-center justify-between text-xs font-mono text-ink-secondary pt-3 border-t border-border-rule">
            <span>Invariants Protected</span>
            <span className="font-semibold text-ink-primary">100% Guarded</span>
          </div>
        </div>
      </section>

      {/* Dream Press Status & Visual Tokens Showcase */}
      <section className="bg-paper-raised p-6 rounded-card border border-border-rule mb-10">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-rule">
          <h3 className="font-serif text-base font-medium">Dream Press Status Indicators (WCAG 2.2 AA)</h3>
          <span className="text-xs font-mono text-ink-secondary">Accessibility Ready</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusTag status="PUBLISHED" />
          <StatusTag status="SENT_TO_INBOX" />
          <StatusTag status="PARTIALLY_PUBLISHED" />
          <StatusTag status="PROCESSING" />
          <StatusTag status="UPLOADING" />
          <StatusTag status="QUEUED" />
          <StatusTag status="FAILED_RETRYABLE" />
          <StatusTag status="FAILED_FINAL" />
          <StatusTag status="UNKNOWN_RECONCILE" />
          <StatusTag status="CANCELLED" />
        </div>
      </section>
    </main>
  );
}
