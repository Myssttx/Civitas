import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  status: z.enum(['active', 'upcoming', 'expired']).optional(),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse({
      status: searchParams.get('status') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    const now = new Date();

    let where: any = {};
    if (params.status === 'active') {
      where = {
        effective: { lte: now },
        OR: [{ expires: null }, { expires: { gt: now } }],
      };
    } else if (params.status === 'upcoming') {
      where = {
        effective: { gt: now },
      };
    } else if (params.status === 'expired') {
      where = {
        expires: { lte: now },
      };
    } else {
      // Default: active
      where = {
        effective: { lte: now },
        OR: [{ expires: null }, { expires: { gt: now } }],
      };
    }

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { effective: 'desc' },
      take: params.limit,
      select: {
        id: true,
        sourceId: true,
        event: true,
        headline: true,
        description: true,
        severity: true,
        urgency: true,
        certainty: true,
        effective: true,
        expires: true,
        geometry: true,
        areaDesc: true,
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

