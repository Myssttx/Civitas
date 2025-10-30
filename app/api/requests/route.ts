import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { helpRequestSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = helpRequestSchema.parse(body);

    const helpRequest = await prisma.helpRequest.create({
      data: {
        userId: user.id,
        buildingId: data.buildingId,
        category: data.category,
        urgency: data.urgency,
        details: data.details,
        preciseLocation: data.sharePreciseLocation ? data.preciseLocation : null,
      },
    });

    return NextResponse.json({ helpRequest }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating help request:', error);
    return NextResponse.json({ error: 'Failed to create help request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');
    const status = searchParams.get('status');

    const where: any = {};
    if (buildingId) where.buildingId = buildingId;
    if (status) where.status = status;

    // Users can only see requests in their building
    const helpRequests = await prisma.helpRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        claimer: {
          select: {
            id: true,
            displayName: true,
          },
        },
        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ helpRequests });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching help requests:', error);
    return NextResponse.json({ error: 'Failed to fetch help requests' }, { status: 500 });
  }
}

