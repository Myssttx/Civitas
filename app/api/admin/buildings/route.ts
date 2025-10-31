import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { buildingSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(UserRole.Admin); // Only full admins can create buildings
    const body = await request.json();
    const data = buildingSchema.parse(body);

    const building = await prisma.building.create({
      data: {
        name: data.name,
        polygon: data.polygon as any,
        floors: data.floors,
        metadata: data.metadata || {},
      },
    });

    return NextResponse.json({ building }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Only Admins can create buildings' }, { status: 403 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating building:', error);
    return NextResponse.json({ error: 'Failed to create building' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await requireRole(UserRole.Admin);
    const buildings = await prisma.building.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            safetyResources: true,
            checkins: true,
          },
        },
      },
    });

    return NextResponse.json({ buildings });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Only Admins can view all buildings' }, { status: 403 });
    }
    console.error('Error fetching buildings:', error);
    return NextResponse.json({ error: 'Failed to fetch buildings' }, { status: 500 });
  }
}

