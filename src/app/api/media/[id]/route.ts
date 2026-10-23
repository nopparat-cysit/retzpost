import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { storageService } from '@/modules/media/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const assetId = params.id;

  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Generate secure preview URL (valid for 1 hour)
    const previewUrl = await storageService.getPresignedDownloadUrl(asset.storageKey, 3600);

    let posterUrl: string | null = null;
    if (asset.posterStorageKey) {
      posterUrl = await storageService.getPresignedDownloadUrl(asset.posterStorageKey, 3600);
    }

    return NextResponse.json({
      id: asset.id,
      workspaceId: asset.workspaceId,
      status: asset.status,
      originalFilename: asset.originalFilename,
      mimeType: asset.mimeType,
      sizeBytes: Number(asset.sizeBytes),
      durationSec: asset.durationSec ? Number(asset.durationSec) : null,
      width: asset.width,
      height: asset.height,
      aspectRatio: asset.aspectRatio,
      videoCodec: asset.videoCodec,
      audioCodec: asset.audioCodec,
      previewUrl,
      posterUrl,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to retrieve media asset', message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const assetId = params.id;

  try {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Delete source video and poster from object storage
    await storageService.deleteObject(asset.storageKey).catch(() => {});
    if (asset.posterStorageKey) {
      await storageService.deleteObject(asset.posterStorageKey).catch(() => {});
    }

    // Remove from database
    await prisma.mediaAsset.delete({
      where: { id: assetId },
    });

    return NextResponse.json({ success: true, deletedId: assetId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Failed to delete media asset', message },
      { status: 500 }
    );
  }
}
