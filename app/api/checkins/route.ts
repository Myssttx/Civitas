import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { checkinSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = checkinSchema.parse(body);

    const checkin = await prisma.checkin.upsert({
      where: {
        userId_buildingId: {
          userId: user.id,
          buildingId: data.buildingId,
        },
      },
      update: {
        status: data.status,
        note: data.note,
      },
      create: {
        userId: user.id,
        buildingId: data.buildingId,
        status: data.status,
        note: data.note,
      },
    });

    return NextResponse.json({ checkin });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating checkin:', error);
    return NextResponse.json({ error: 'Failed to create checkin' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');

    const where: any = { userId: user.id };
    if (buildingId) {
      where.buildingId = buildingId;
    }

    const checkins = await prisma.checkin.findMany({
      where,
      include: {
        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ checkins });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching checkins:', error);
    return NextResponse.json({ error: 'Failed to fetch checkins' }, { status: 500 });
  }
}

