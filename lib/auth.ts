/**
 * Authentication and authorization utilities
 */

import { createServerClient } from './supabase/server';
import { prisma } from './prisma';
import { UserRole } from '@prisma/client';

export interface UserWithRoles {
  id: string;
  email: string;
  displayName: string | null;
  roles: UserRole[];
  roleScopes: Array<{
    role: UserRole;
    buildingId: string | null;
  }>;
}

/**
 * Get current authenticated user with roles
 */
export async function getCurrentUser(): Promise<UserWithRoles | null> {
  const supabase = await createServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
    include: {
      roleScopes: {
        select: {
          role: true,
          buildingId: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    roles: user.roles,
    roleScopes: user.roleScopes.map((rs) => ({
      role: rs.role,
      buildingId: rs.buildingId,
    })),
  };
}

/**
 * Check if user has a specific role
 */
export function hasRole(
  user: UserWithRoles | null,
  role: UserRole,
  buildingId?: string
): boolean {
  if (!user) return false;

  // Admin has access everywhere
  if (user.roles.includes(UserRole.Admin)) return true;

  // Check direct roles
  if (user.roles.includes(role)) {
    // If buildingId specified, check scope
    if (buildingId) {
      return user.roleScopes.some(
        (rs) => rs.role === role && (rs.buildingId === buildingId || rs.buildingId === null)
      );
    }
    return true;
  }

  return false;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<UserWithRoles> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require role - throws if user doesn't have required role
 */
export async function requireRole(
  role: UserRole,
  buildingId?: string
): Promise<UserWithRoles> {
  const user = await requireAuth();
  if (!hasRole(user, role, buildingId)) {
    throw new Error(`Forbidden: Requires ${role} role`);
  }
  return user;
}

