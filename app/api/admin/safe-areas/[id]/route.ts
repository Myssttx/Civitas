import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(UserRole.RA);
    const body = await request.json();
    const { isActive } = body;

    // Find the bulletin (safe area declaration)
    const bulletin = await prisma.bulletin.findUnique({
      where: { id: params.id },
      include: { building: true },
    });

    if (!bulletin) {
      return NextResponse.json({ error: 'Safe area declaration not found' }, { status: 404 });
    }

    // Update building metadata
    const building = bulletin.building;
    const metadata = (building.metadata as any) || {};
    
    if (metadata.safeArea) {
      metadata.safeArea.isActive = isActive;
      metadata.safeArea.updatedAt = new Date().toISOString();
      metadata.safeArea.updatedBy = user.id;
    }

    await prisma.building.update({
      where: { id: building.id },
      data: { metadata },
    });

    // Optionally create a new bulletin to reflect the change
    if (!isActive) {
      await prisma.bulletin.create({
        data: {
          buildingId: building.id,
          priority: 'Info',
          body: `Safe area status has been removed from this building.`,
          createdById: user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Only RAs, Captains, and Admins can manage safe areas' },
        { status: 403 }
      );
    }
    console.error('Error updating safe area:', error);
    return NextResponse.json({ error: 'Failed to update safe area' }, { status: 500 });
  }
}

