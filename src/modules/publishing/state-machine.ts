export type JobStatus =
  | 'SCHEDULED'
  | 'QUEUED'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'PUBLISHED'
  | 'SENT_TO_INBOX'
  | 'FAILED_RETRYABLE'
  | 'FAILED_FINAL'
  | 'UNKNOWN_RECONCILE'
  | 'CANCELLED';

export type BatchAggregateStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'PUBLISHED'
  | 'PARTIALLY_PUBLISHED'
  | 'FAILED'
  | 'CANCELLED';

/**
 * Calculates the overall aggregate status of a PublishBatch from its individual destinations.
 * Invariant: Never reports global FAILED if one of the destinations succeeded.
 */
export function deriveBatchAggregateStatus(jobStatuses: JobStatus[]): BatchAggregateStatus {
  if (!jobStatuses || jobStatuses.length === 0) {
    return 'PENDING';
  }

  const isTerminalSuccess = (s: JobStatus) => s === 'PUBLISHED' || s === 'SENT_TO_INBOX';
  const isTerminalFailure = (s: JobStatus) => s === 'FAILED_FINAL';
  const isInFlight = (s: JobStatus) =>
    s === 'QUEUED' || s === 'UPLOADING' || s === 'PROCESSING' || s === 'UNKNOWN_RECONCILE' || s === 'FAILED_RETRYABLE';
  const isScheduled = (s: JobStatus) => s === 'SCHEDULED';
  const isCancelled = (s: JobStatus) => s === 'CANCELLED';

  const hasSuccess = jobStatuses.some(isTerminalSuccess);
  const hasFailure = jobStatuses.some(isTerminalFailure);
  const hasInFlight = jobStatuses.some(isInFlight);
  const hasScheduled = jobStatuses.some(isScheduled);
  const allCancelled = jobStatuses.every(isCancelled);

  if (allCancelled) {
    return 'CANCELLED';
  }

  // If any job is currently processing or queued to retry, the batch is IN_PROGRESS
  if (hasInFlight) {
    return 'IN_PROGRESS';
  }

  // If some jobs are scheduled for the future
  if (hasScheduled) {
    return hasSuccess || hasFailure ? 'IN_PROGRESS' : 'PENDING';
  }

  // All jobs reached terminal states
  if (hasSuccess && hasFailure) {
    return 'PARTIALLY_PUBLISHED';
  }
  if (hasSuccess && !hasFailure) {
    return 'PUBLISHED';
  }
  if (!hasSuccess && hasFailure) {
    return 'FAILED';
  }

  return 'PENDING';
}

/**
 * Validates whether a state transition for a PublishJob is legally permitted.
 * Invariant: Terminal states (PUBLISHED, SENT_TO_INBOX) cannot be mutated backwards.
 */
export function isLegalJobTransition(from: JobStatus, to: JobStatus): boolean {
  if (from === to) return true;

  // Terminal states cannot transition to anything
  if (from === 'PUBLISHED' || from === 'SENT_TO_INBOX' || from === 'CANCELLED') {
    return false;
  }

  switch (from) {
    case 'SCHEDULED':
      return to === 'QUEUED' || to === 'CANCELLED';

    case 'QUEUED':
      return to === 'UPLOADING' || to === 'CANCELLED';

    case 'UPLOADING':
      return (
        to === 'PROCESSING' ||
        to === 'PUBLISHED' ||
        to === 'SENT_TO_INBOX' ||
        to === 'FAILED_RETRYABLE' ||
        to === 'FAILED_FINAL' ||
        to === 'UNKNOWN_RECONCILE'
      );

    case 'PROCESSING':
      return (
        to === 'PUBLISHED' ||
        to === 'SENT_TO_INBOX' ||
        to === 'FAILED_FINAL' ||
        to === 'FAILED_RETRYABLE' ||
        to === 'UNKNOWN_RECONCILE'
      );

    case 'UNKNOWN_RECONCILE':
      // Reconciler can find the post (PUBLISHED), confirm not created (QUEUED for fresh attempt), or give up (FAILED_FINAL)
      return to === 'PUBLISHED' || to === 'QUEUED' || to === 'FAILED_FINAL';

    case 'FAILED_RETRYABLE':
      return to === 'QUEUED' || to === 'FAILED_FINAL' || to === 'CANCELLED';

    case 'FAILED_FINAL':
      return to === 'CANCELLED';

    default:
      return false;
  }
}
