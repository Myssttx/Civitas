import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

const safeAreaSchema = z.object({
  buildingId: z.string().cuid(),
  isActive: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Only RAs, Captains, and Admins can declare safe areas
    const user = await requireRole(UserRole.RA);
    const body = await request.json();
    const data = safeAreaSchema.parse(body);

    // Check if building exists
    const building = await prisma.building.findUnique({
      where: { id: data.buildingId },
    });

    if (!building) {
      return NextResponse.json({ error: 'Building not found' }, { status: 404 });
    }

    // Create safe area declaration
    // Note: We're using the Bulletin model to track safe area declarations
    // or we could add a SafeArea model. For now, using a simple approach
    // with metadata in building or creating a dedicated model
    
    // For simplicity, we'll mark the building's metadata or create a bulletin
    const safeArea = await prisma.bulletin.create({
      data: {
        buildingId: data.buildingId,
        priority: 'Critical', // Safe areas are critical announcements
        body: data.isActive
          ? `🛡️ This building has been declared a SAFE AREA. ${data.notes || ''}`
          : `Safe area status removed. ${data.notes || ''}`,
        createdById: user.id,
      },
    });

    // Also update building metadata
    await prisma.building.update({
      where: { id: data.buildingId },
      data: {
        metadata: {
          ...((building.metadata as any) || {}),
          safeArea: {
            isActive: data.isActive,
            declaredAt: new Date().toISOString(),
            declaredBy: user.id,
            notes: data.notes,
          },
        },
      },
    });

    return NextResponse.json(
      {
        safeArea: {
          id: safeArea.id,
          buildingId: data.buildingId,
          isActive: data.isActive,
          notes: data.notes,
          createdAt: safeArea.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Only RAs, Captains, and Admins can declare safe areas' },
        { status: 403 }
      );
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error declaring safe area:', error);
    return NextResponse.json({ error: 'Failed to declare safe area' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Safe areas are public - anyone can view them
    // Get all buildings and check metadata for safe area status
    const buildings = await prisma.building.findMany({
      include: {
        bulletins: {
          where: {
            priority: 'Critical',
            body: {
              contains: 'SAFE AREA',
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            createdBy: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    const safeAreas = buildings
      .map((building) => {
        const metadata = building.metadata as any;
        const safeAreaData = metadata?.safeArea;
        const bulletin = building.bulletins[0];
        
        // Only include if safe area is active
        if (!safeAreaData || !safeAreaData.isActive) {
          return null;
        }

        return {
          id: bulletin?.id || building.id,
          buildingId: building.id,
          building: {
            id: building.id,
            name: building.name,
          },
          isActive: true,
          notes: safeAreaData.notes,
          declaredBy: bulletin?.createdBy || null,
          createdAt: safeAreaData.declaredAt || building.createdAt,
        };
      })
      .filter((area) => area !== null);

    return NextResponse.json({ safeAreas });
  } catch (error) {
    console.error('Error fetching safe areas:', error);
    return NextResponse.json({ error: 'Failed to fetch safe areas' }, { status: 500 });
  }
}

