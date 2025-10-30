import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole, TaskStatus } from '@prisma/client';
import { taskSchema } from '@/lib/validation';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Only RAs and Captains can create tasks
    const user = await requireRole(UserRole.RA);
    const body = await request.json();
    const data = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        buildingId: data.buildingId,
        title: data.title,
        details: data.details,
        type: data.type,
        requesterId: user.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Only RAs and Captains can create tasks' }, { status: 403 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(UserRole.RA); // Require at least RA
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');
    const status = searchParams.get('status') as TaskStatus | null;

    const where: any = {};
    if (buildingId) where.buildingId = buildingId;
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            displayName: true,
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

    return NextResponse.json({ tasks });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

