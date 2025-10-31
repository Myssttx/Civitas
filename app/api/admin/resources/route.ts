import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { safetyResourceSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(UserRole.Admin);
    const body = await request.json();
    const data = safetyResourceSchema.parse(body);

    const resource = await prisma.safetyResource.create({
      data: {
        buildingId: data.buildingId,
        type: data.type,
        name: data.name,
        location: data.location as any,
        floor: data.floor,
        metadata: data.metadata || {},
      },
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Only Admins can create resources' }, { status: 403 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(UserRole.Admin);
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');

    const where: any = {};
    if (buildingId) where.buildingId = buildingId;

    const resources = await prisma.safetyResource.findMany({
      where,
      include: {
        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ resources });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

