import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { storageService } from '@/modules/media/storage';
import { mediaProbeService } from '@/modules/media/probe';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const assetId = params.id;

  try {
    const body = await req.json().catch(() => ({}));

    const asset = await prisma.mediaAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Verify object actually exists in object storage
    let objectMeta;
    try {
      objectMeta = await storageService.getObjectMetadata(asset.storageKey);
    } catch {
      return NextResponse.json(
        { error: 'Uploaded file not found in storage. Ensure direct upload completed.' },
        { status: 400 }
      );
    }

    // Generate short-lived signed URL to probe media
    const presignedDownloadUrl = await storageService.getPresignedDownloadUrl(asset.storageKey, 300);

    // Attempt probing video specs and generating poster
    let probeMetadata;
    let posterStorageKey: string | null = null;

    try {
      probeMetadata = await mediaProbeService.probeVideo(presignedDownloadUrl);

      // Generate poster thumbnail frame
      try {
        const posterBuffer = await mediaProbeService.generatePoster(presignedDownloadUrl, probeMetadata.durationSec);
        posterStorageKey = storageService.generatePosterStorageKey(asset.workspaceId, asset.id, 'jpg');
        await storageService.uploadBuffer(posterStorageKey, posterBuffer, 'image/jpeg');
      } catch (posterErr) {
        console.warn('Poster generation skipped or failed:', posterErr);
      }
    } catch (probeErr) {
      console.warn('ffprobe execution skipped or failed (will use client or basic metadata):', probeErr);
    }

    const width = probeMetadata?.width ?? (typeof body?.width === 'number' ? body.width : null);
    const height = probeMetadata?.height ?? (typeof body?.height === 'number' ? body.height : null);
    const durationSec = probeMetadata?.durationSec ?? (typeof body?.durationSeconds === 'number' ? body.durationSeconds : null);

    // Update asset in database
    const updated = await prisma.mediaAsset.update({
      where: { id: assetId },
      data: {
        status: 'READY',
        sizeBytes: BigInt(objectMeta.sizeBytes),
        durationSec: durationSec ? durationSec : null,
        width,
        height,
        aspectRatio: probeMetadata?.aspectRatio ?? (width && height ? `${width}:${height}` : null),
        videoCodec: probeMetadata?.videoCodec ?? null,
        audioCodec: probeMetadata?.audioCodec ?? null,
        posterStorageKey,
      },
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      originalFilename: updated.originalFilename,
      sizeBytes: Number(updated.sizeBytes),
      durationSec: updated.durationSec ? Number(updated.durationSec) : null,
      width: updated.width,
      height: updated.height,
      aspectRatio: updated.aspectRatio,
      videoCodec: updated.videoCodec,
      audioCodec: updated.audioCodec,
      hasPoster: Boolean(posterStorageKey),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to complete media upload processing', message },
      { status: 500 }
    );
  }
}
