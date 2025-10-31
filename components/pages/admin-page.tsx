'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MainNav } from '@/components/navigation/main-nav';
import { Shield, MapPin, Building2, Users, Settings } from 'lucide-react';

export function AdminPage() {
  const { data: userData } = useQuery('me', async () => {
    const res = await fetch('/api/me');
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  });

  const user = userData?.user;
  const isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('RA') || user?.roles?.includes('Captain');

  if (!isAdmin) {
    return (
      <>
        <MainNav />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-4xl p-4">
            <Card>
              <CardContent className="py-8 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="mb-2 text-2xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground">
                  You need admin, RA, or Captain role to access this page.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-6xl p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage buildings, safe areas, and resources</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Declare Safe Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Declare Safe Area
                </CardTitle>
                <CardDescription>
                  Mark a building or location as a designated safe area during emergencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SafeAreaForm />
              </CardContent>
            </Card>

            {/* Manage Buildings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Manage Buildings
                </CardTitle>
                <CardDescription>Add or edit campus buildings</CardDescription>
              </CardHeader>
              <CardContent>
                <BuildingsManager />
              </CardContent>
            </Card>

            {/* Manage Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Safety Resources
                </CardTitle>
                <CardDescription>Manage shelters, AEDs, and other resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResourcesManager />
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Role Management
                </CardTitle>
                <CardDescription>Assign RA, Captain, and Admin roles</CardDescription>
              </CardHeader>
              <CardContent>
                <RoleManagement />
              </CardContent>
            </Card>
          </div>

          {/* Safe Areas List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Safe Areas</CardTitle>
              <CardDescription>Designated safe areas declared by admins</CardDescription>
            </CardHeader>
            <CardContent>
              <SafeAreasList />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function SafeAreaForm() {
  const [buildingId, setBuildingId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: buildings } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

  const declareMutation = useMutation(
    async (data: any) => {
      const res = await fetch('/api/admin/safe-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to declare safe area');
      return res.json();
    },
    {
      onSuccess: () => {
        toast({ title: 'Safe area declared', description: 'The area has been marked as safe.' });
        queryClient.invalidateQueries('safe-areas');
        setBuildingId('');
        setNotes('');
        setIsActive(true);
      },
    }
  );

  const handleSubmit = () => {
    if (!buildingId) {
      toast({
        title: 'Missing building',
        description: 'Please select a building.',
        variant: 'destructive',
      });
      return;
    }

    declareMutation.mutate({
      buildingId,
      isActive,
      notes: notes || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Building</label>
        <select
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Select building...</option>
          {buildings?.buildings?.map((b: any) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="isActive" className="text-sm">
          Mark as active safe area
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional information about this safe area..."
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} disabled={!buildingId || declareMutation.isLoading} className="w-full">
        {declareMutation.isLoading ? 'Declaring...' : 'Declare Safe Area'}
      </Button>
    </div>
  );
}

function SafeAreasList() {
  const { data: safeAreasData } = useQuery('safe-areas', async () => {
    const res = await fetch('/api/admin/safe-areas');
    if (!res.ok) throw new Error('Failed to fetch safe areas');
    return res.json();
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deactivateMutation = useMutation(
    async (id: string) => {
      const res = await fetch(`/api/admin/safe-areas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: false }),
      });
      if (!res.ok) throw new Error('Failed to deactivate');
      return res.json();
    },
    {
      onSuccess: () => {
        toast({ title: 'Safe area deactivated' });
        queryClient.invalidateQueries('safe-areas');
      },
    }
  );

  const safeAreas = safeAreasData?.safeAreas || [];

  if (safeAreas.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">No safe areas declared yet.</div>
    );
  }

  return (
    <div className="space-y-3">
      {safeAreas.map((area: any) => (
        <div
          key={area.id}
          className="flex items-center justify-between rounded-md border p-4"
        >
          <div className="flex items-center gap-3">
            <Shield className={`h-5 w-5 ${area.isActive ? 'text-green-500' : 'text-gray-400'}`} />
            <div>
              <div className="font-medium">{area.building?.name}</div>
              {area.notes && <div className="text-sm text-muted-foreground">{area.notes}</div>}
              <div className="text-xs text-muted-foreground">
                Declared by {area.declaredBy?.displayName || 'Admin'} •{' '}
                {new Date(area.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {area.isActive ? (
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-500">
                Active
              </span>
            ) : (
              <span className="rounded-full bg-gray-500/20 px-3 py-1 text-xs font-medium text-gray-500">
                Inactive
              </span>
            )}
            {area.isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => deactivateMutation.mutate(area.id)}
              >
                Deactivate
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function BuildingsManager() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Add and manage campus buildings. Each building can be marked as a safe area.
      </p>
      <Button variant="outline" className="w-full" asChild>
        <a href="/admin/buildings">Manage Buildings</a>
      </Button>
    </div>
  );
}

function ResourcesManager() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Add shelters, AEDs, exits, and assembly points to buildings.
      </p>
      <Button variant="outline" className="w-full" asChild>
        <a href="/admin/resources">Manage Resources</a>
      </Button>
    </div>
  );
}

function RoleManagement() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Assign RA, Captain, and Admin roles to users by email or building.
      </p>
      <Button variant="outline" className="w-full" asChild>
        <a href="/admin/roles">Manage Roles</a>
      </Button>
    </div>
  );
}

