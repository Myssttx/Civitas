import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const kitSchema = z.object({
  hasMeds: z.boolean().optional(),
  medsList: z.string().max(500).optional(),
  hasDevices: z.boolean().optional(),
  devicesList: z.string().max(500).optional(),
  contacts: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    const metadata = (dbUser?.metadata as any) || {};
    return NextResponse.json({ kit: metadata.emergencyKit || {} });
  } catch (error) {
    console.error('Error fetching kit:', error);
    return NextResponse.json({ error: 'Failed to fetch kit' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = kitSchema.parse(body);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    const metadata = ((dbUser?.metadata as any) || {});
    const emergencyKit = { ...(metadata.emergencyKit || {}), ...data };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...metadata,
          emergencyKit,
        },
      },
    });

    return NextResponse.json({ kit: emergencyKit });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error updating kit:', error);
    return NextResponse.json({ error: 'Failed to update kit' }, { status: 500 });
  }
}
