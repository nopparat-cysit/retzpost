/**
 * Verification test for Cohort 5-Floor Mealtime Analytics Engine and Neon DB
 */
import { syncWorkspaceTelemetry, resetCooldown, COHORT_FLOORS } from '../src/modules/analytics/sync-engine';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🧪 Starting Cohort 5-Floor Analytics Verification...');
  resetCooldown();

  const now = new Date();

  // Test 1: Cohort sync with posts on all 5 floors
  console.log('\n--- Test 1: 5-Floor Mealtime Cohort Sync ---');
  const mockPosts = [
    {
      id: 'post-floor-1',
      title: 'Studio Suite Showcase (Floor 1: < 3 Days)',
      views: 12500,
      likes: 850,
      comments: 65,
      shares: 120,
      linkClicks: 340,
      publishedAt: new Date(now.getTime() - 10 * 3600 * 1000).toISOString(), // 10h ago (Floor 1)
      lastSyncedAt: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(), // 3h ago (due for 2h meal!)
    },
    {
      id: 'post-floor-2',
      title: 'Weekly Market Brief (Floor 2: 4-7 Days)',
      views: 32000,
      likes: 1800,
      comments: 110,
      shares: 240,
      linkClicks: 620,
      publishedAt: new Date(now.getTime() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago (Floor 2)
      lastSyncedAt: new Date(now.getTime() - 25 * 3600 * 1000).toISOString(), // 25h ago (due for 24h meal!)
    },
    {
      id: 'post-floor-3',
      title: 'Brand Story Reel (Floor 3: 8-14 Days)',
      views: 45000,
      likes: 2200,
      comments: 150,
      shares: 310,
      linkClicks: 890,
      publishedAt: new Date(now.getTime() - 10 * 24 * 3600 * 1000).toISOString(), // 10 days ago (Floor 3)
      lastSyncedAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), // 2h ago (NOT DUE! interval is 72h)
    },
    {
      id: 'post-floor-4',
      title: 'Tech Review (Floor 4: 15-30 Days)',
      views: 58000,
      likes: 3100,
      comments: 190,
      shares: 420,
      linkClicks: 1100,
      publishedAt: new Date(now.getTime() - 22 * 24 * 3600 * 1000).toISOString(), // 22 days ago (Floor 4)
      lastSyncedAt: new Date(now.getTime() - 8 * 24 * 3600 * 1000).toISOString(), // 8 days ago (due for 7-day meal!)
    },
    {
      id: 'post-floor-5',
      title: 'Launch Highlight (Floor 5: > 30 Days)',
      views: 95000,
      likes: 5400,
      comments: 320,
      shares: 800,
      linkClicks: 2100,
      publishedAt: new Date(now.getTime() - 60 * 24 * 3600 * 1000).toISOString(), // 60 days ago (Floor 5)
      lastSyncedAt: new Date(now.getTime() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago (NOT DUE! interval is 30 days)
    },
  ];

  const sync1 = await syncWorkspaceTelemetry('ws_demo_cohort', { mockPosts });
  console.log('Sync 1 status:', sync1.status);
  console.log('Synced Count (Due for mealtime):', sync1.syncedCount);
  console.log('Skipped Count (Not yet mealtime):', sync1.skippedCount);
  console.log('Batch Chunk Count:', sync1.batchChunkCount);
  console.log('Floor Breakdown:', sync1.aggregates.floorBreakdown);

  if (sync1.syncedCount !== 3 || sync1.skippedCount !== 2) {
    throw new Error(`Expected 3 synced and 2 skipped, got ${sync1.syncedCount} synced and ${sync1.skippedCount} skipped`);
  }

  // Test 2: Rate limit protection
  console.log('\n--- Test 2: Rate Limit Cooldown Protection ---');
  const sync2 = await syncWorkspaceTelemetry('ws_demo_cohort', { mockPosts });
  console.log('Sync 2 status:', sync2.status);
  console.log('Remaining Cooldown (seconds):', sync2.cooldownSecondsRemaining);

  if (sync2.status !== 'COOLDOWN_ACTIVE') {
    throw new Error('Expected COOLDOWN_ACTIVE status on rapid successive call');
  }

  // Test 3: Prisma schema query on Neon Postgres
  console.log('\n--- Test 3: Verifying Neon Postgres Telemetry Columns ---');
  const pubCount = await prisma.platformPublication.count();
  console.log('Current publication records in Neon Postgres:', pubCount);

  console.log('\n✅ ALL COHORT 5-FLOOR VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

main()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
