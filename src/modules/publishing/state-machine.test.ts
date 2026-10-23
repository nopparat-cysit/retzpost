import { describe, it, expect } from 'vitest';
import { deriveBatchAggregateStatus, isLegalJobTransition } from './state-machine';

describe('Publishing State Machine', () => {
  describe('deriveBatchAggregateStatus', () => {
    it('should return PUBLISHED when all jobs succeed', () => {
      expect(deriveBatchAggregateStatus(['PUBLISHED', 'PUBLISHED'])).toBe('PUBLISHED');
      expect(deriveBatchAggregateStatus(['PUBLISHED', 'SENT_TO_INBOX'])).toBe('PUBLISHED');
    });

    it('should cleanly bypass unselected platforms (SKIPPED_BYPASS) without any error or partial failure', () => {
      // If user only checked FB & IG, and skipped YT & TikTok, batch is 100% PUBLISHED (Zero Error)
      expect(deriveBatchAggregateStatus(['PUBLISHED', 'PUBLISHED', 'SKIPPED_BYPASS', 'SKIPPED_BYPASS'])).toBe('PUBLISHED');
      expect(deriveBatchAggregateStatus(['PUBLISHED', 'SKIPPED_BYPASS'])).toBe('PUBLISHED');
    });

    it('should return PARTIALLY_PUBLISHED when one succeeds and another permanently fails', () => {
      expect(deriveBatchAggregateStatus(['PUBLISHED', 'FAILED_FINAL'])).toBe('PARTIALLY_PUBLISHED');
    });

    it('should return IN_PROGRESS when any job is still uploading or processing', () => {
      expect(deriveBatchAggregateStatus(['PUBLISHED', 'UPLOADING'])).toBe('IN_PROGRESS');
      expect(deriveBatchAggregateStatus(['FAILED_FINAL', 'QUEUED'])).toBe('IN_PROGRESS');
      expect(deriveBatchAggregateStatus(['FAILED_RETRYABLE', 'PROCESSING'])).toBe('IN_PROGRESS');
    });

    it('should return FAILED when all jobs reach final failure', () => {
      expect(deriveBatchAggregateStatus(['FAILED_FINAL', 'FAILED_FINAL'])).toBe('FAILED');
    });

    it('should return CANCELLED when all jobs are cancelled', () => {
      expect(deriveBatchAggregateStatus(['CANCELLED', 'CANCELLED'])).toBe('CANCELLED');
    });

    it('should return PENDING for empty or newly scheduled jobs', () => {
      expect(deriveBatchAggregateStatus([])).toBe('PENDING');
      expect(deriveBatchAggregateStatus(['SCHEDULED', 'SCHEDULED'])).toBe('PENDING');
    });
  });

  describe('isLegalJobTransition', () => {
    it('should strictly disallow transitioning out of terminal PUBLISHED state', () => {
      expect(isLegalJobTransition('PUBLISHED', 'QUEUED')).toBe(false);
      expect(isLegalJobTransition('PUBLISHED', 'UPLOADING')).toBe(false);
      expect(isLegalJobTransition('PUBLISHED', 'FAILED_FINAL')).toBe(false);
      expect(isLegalJobTransition('PUBLISHED', 'CANCELLED')).toBe(false);
    });

    it('should permit valid forward lifecycle transitions', () => {
      expect(isLegalJobTransition('SCHEDULED', 'QUEUED')).toBe(true);
      expect(isLegalJobTransition('QUEUED', 'UPLOADING')).toBe(true);
      expect(isLegalJobTransition('UPLOADING', 'PROCESSING')).toBe(true);
      expect(isLegalJobTransition('PROCESSING', 'PUBLISHED')).toBe(true);
    });

    it('should support safe reconciliation and retries', () => {
      expect(isLegalJobTransition('UPLOADING', 'UNKNOWN_RECONCILE')).toBe(true);
      expect(isLegalJobTransition('UNKNOWN_RECONCILE', 'PUBLISHED')).toBe(true);
      expect(isLegalJobTransition('UNKNOWN_RECONCILE', 'QUEUED')).toBe(true);
      expect(isLegalJobTransition('FAILED_RETRYABLE', 'QUEUED')).toBe(true);
    });
  });
});
