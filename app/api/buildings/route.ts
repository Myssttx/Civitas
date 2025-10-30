import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        polygon: true,
        floors: true,
        metadata: true,
      },
    });

    return NextResponse.json({ buildings });
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return NextResponse.json({ error: 'Failed to fetch buildings' }, { status: 500 });
  }
}

