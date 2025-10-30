import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const taskId = params.id;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'Claimed',
        claimerId: user.id,
      },
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error claiming task:', error);
    return NextResponse.json({ error: 'Failed to claim task' }, { status: 500 });
  }
}

