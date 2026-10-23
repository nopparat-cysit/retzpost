import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  UploadCloud, 
  RefreshCw, 
  Inbox,
  Ban
} from 'lucide-react';
import { JobStatus, BatchAggregateStatus } from '@/modules/publishing/state-machine';

interface StatusTagProps {
  status: JobStatus | BatchAggregateStatus | 'CONNECTED' | 'EXPIRING' | 'REVOKED';
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, className = '' }) => {
  let bg = 'bg-paper-subtle';
  let text = 'text-ink-secondary';
  let border = 'border-border-rule';
  let label = status.replace(/_/g, ' ');
  let Icon = Clock;

  switch (status) {
    case 'PUBLISHED':
    case 'CONNECTED':
      bg = 'bg-semantic-success-bg';
      text = 'text-semantic-success';
      border = 'border-semantic-success/20';
      Icon = CheckCircle2;
      break;

    case 'SENT_TO_INBOX':
      bg = 'bg-semantic-info-bg';
      text = 'text-semantic-info';
      border = 'border-semantic-info/20';
      label = 'Sent to TikTok Inbox';
      Icon = Inbox;
      break;

    case 'PARTIALLY_PUBLISHED':
    case 'EXPIRING':
    case 'PROCESSING':
      bg = 'bg-semantic-warning-bg';
      text = 'text-semantic-warning';
      border = 'border-semantic-warning/20';
      Icon = RefreshCw;
      break;

    case 'FAILED':
    case 'FAILED_FINAL':
    case 'REVOKED':
      bg = 'bg-semantic-error-bg';
      text = 'text-semantic-error';
      border = 'border-semantic-error/20';
      Icon = XCircle;
      break;

    case 'FAILED_RETRYABLE':
      bg = 'bg-semantic-warning-bg';
      text = 'text-semantic-warning';
      border = 'border-semantic-warning/20';
      label = 'Failed (Retryable)';
      Icon = AlertTriangle;
      break;

    case 'UPLOADING':
      bg = 'bg-semantic-info-bg';
      text = 'text-semantic-info';
      border = 'border-semantic-info/20';
      Icon = UploadCloud;
      break;

    case 'CANCELLED':
      bg = 'bg-paper-subtle';
      text = 'text-ink-secondary';
      border = 'border-border-rule';
      Icon = Ban;
      break;

    case 'UNKNOWN_RECONCILE':
      bg = 'bg-semantic-warning-bg';
      text = 'text-semantic-warning';
      border = 'border-semantic-warning/30';
      label = 'Verifying with Platform...';
      Icon = RefreshCw;
      break;

    default:
      // QUEUED, SCHEDULED, PENDING
      bg = 'bg-paper-subtle';
      text = 'text-ink-secondary';
      border = 'border-border-rule';
      Icon = Clock;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-editorial text-xs font-mono font-medium border ${bg} ${text} ${border} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
};
