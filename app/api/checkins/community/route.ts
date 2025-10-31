import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const checkins = await prisma.checkin.findMany({
      where: {
        // Only show checkins from last 24 hours
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ checkins });
  } catch (error) {
    console.error('Error fetching community checkins:', error);
    return NextResponse.json({ error: 'Failed to fetch community checkins' }, { status: 500 });
  }
}

