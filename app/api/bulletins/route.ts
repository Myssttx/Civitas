import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { bulletinSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Only Captains and Admins can post bulletins
    const user = await requireRole(UserRole.RA); // RA or higher can post
    const body = await request.json();
    const data = bulletinSchema.parse(body);

    const bulletin = await prisma.bulletin.create({
      data: {
        buildingId: data.buildingId,
        priority: data.priority,
        body: data.body,
        createdById: user.id,
      },
    });

    return NextResponse.json({ bulletin }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Only RAs, Captains, and Admins can post bulletins' },
        { status: 403 }
      );
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating bulletin:', error);
    return NextResponse.json({ error: 'Failed to create bulletin' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');

    const where: any = {};
    if (buildingId) {
      where.buildingId = buildingId;
    }

    const bulletins = await prisma.bulletin.findMany({
      where,
      include: {
        building: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ bulletins });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    return NextResponse.json({ error: 'Failed to fetch bulletins' }, { status: 500 });
  }
}

