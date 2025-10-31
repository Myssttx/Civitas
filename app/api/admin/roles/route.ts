import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

const assignRoleSchema = z.object({
  email: z.string().email(),
  role: z.enum(['Student', 'RA', 'Captain', 'Admin']),
  buildingId: z.string().cuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(UserRole.Admin); // Only full admins can assign roles
    const body = await request.json();
    const data = assignRoleSchema.parse(body);

    // Find user by email
    const targetUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user roles
    const newRoles = [...new Set([...targetUser.roles, data.role as UserRole])];

    await prisma.user.update({
      where: { id: targetUser.id },
      data: { roles: newRoles },
    });

    // If buildingId provided and role is RA or Captain, create role scope
    if (data.buildingId && (data.role === 'RA' || data.role === 'Captain')) {
      await prisma.roleScope.upsert({
        where: {
          userId_buildingId_role: {
            userId: targetUser.id,
            buildingId: data.buildingId,
            role: data.role as UserRole,
          },
        },
        update: {},
        create: {
          userId: targetUser.id,
          buildingId: data.buildingId,
          role: data.role as UserRole,
        },
      });
    }

    return NextResponse.json({ success: true, user: targetUser });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Only Admins can assign roles' }, { status: 403 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error assigning role:', error);
    return NextResponse.json({ error: 'Failed to assign role' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await requireRole(UserRole.Admin);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        roles: true,
        roleScopes: {
          include: {
            building: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { email: 'asc' },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    if (error.message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

