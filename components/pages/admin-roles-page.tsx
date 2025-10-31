'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MainNav } from '@/components/navigation/main-nav';
import { Shield, UserPlus } from 'lucide-react';

export function AdminRolesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usersData } = useQuery('admin-users', async () => {
    const res = await fetch('/api/admin/roles');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  });

  const { data: buildings } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

  const assignMutation = useMutation(
    async (data: { email: string; role: string; buildingId?: string }) => {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to assign role');
      return res.json();
    },
    {
      onSuccess: () => {
        toast({ title: 'Role assigned', description: 'User role has been updated.' });
        queryClient.invalidateQueries('admin-users');
      },
    }
  );

  const users = usersData?.users || [];

  return (
    <>
      <MainNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-4xl p-4">
          <h1 className="mb-6 text-3xl font-bold">Role Management</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Assign Role</CardTitle>
              <CardDescription>
                Assign RA, Captain, or Admin roles to users by email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleAssignmentForm
                buildings={buildings?.buildings || []}
                onSubmit={(data) => assignMutation.mutate(data)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users & Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user: any) => (
                  <UserRoleCard key={user.id} user={user} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function RoleAssignmentForm({ buildings, onSubmit }: any) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('RA');
  const [buildingId, setBuildingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, role, buildingId: buildingId || undefined });
    setEmail('');
    setBuildingId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          placeholder="user@campus.edu"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="RA">RA (Residential Advisor)</option>
          <option value="Captain">Captain (Building Captain)</option>
          <option value="Admin">Admin (Campus Admin)</option>
        </select>
      </div>

      {(role === 'RA' || role === 'Captain') && (
        <div>
          <label className="mb-2 block text-sm font-medium">Building (Optional)</label>
          <select
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">All buildings</option>
            {buildings.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Leave empty for all buildings, or select a specific building scope
          </p>
        </div>
      )}

      <Button type="submit" className="w-full">
        <UserPlus className="mr-2 h-4 w-4" />
        Assign Role
      </Button>
    </form>
  );
}

function UserRoleCard({ user }: { user: any }) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{user.displayName || user.email}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.roles.map((role: string) => (
              <span
                key={role}
                className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary"
              >
                {role}
              </span>
            ))}
          </div>
          {user.roleScopes.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Scoped to: {user.roleScopes.map((rs: any) => rs.building?.name || 'All').join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

