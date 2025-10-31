'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BulletinPriority } from '@prisma/client';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { MainNav } from '@/components/navigation/main-nav';

export function BulletinsPage() {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: buildings } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

  const { data: bulletinsData } = useQuery('bulletins', async () => {
    const res = await fetch('/api/bulletins');
    if (!res.ok) throw new Error('Failed to fetch bulletins');
    return res.json();
  });

  const createMutation = useMutation(
    async (data: any) => {
      const res = await fetch('/api/bulletins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create bulletin');
      return res.json();
    },
    {
      onSuccess: () => {
        toast({ title: 'Bulletin posted', description: 'Your bulletin has been published.' });
        queryClient.invalidateQueries('bulletins');
        setShowForm(false);
      },
    }
  );

  const bulletins = bulletinsData?.bulletins || [];

  return (
    <>
      <MainNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bulletins</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Post Bulletin'}
        </Button>
      </div>

      {showForm && (
        <BulletinForm
          buildings={buildings?.buildings || []}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4">
        {bulletins.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No bulletins posted yet.
            </CardContent>
          </Card>
        ) : (
          bulletins.map((bulletin: any) => <BulletinCard key={bulletin.id} bulletin={bulletin} />)
        )}
      </div>
      </div>
    </>
  );
}

function BulletinForm({ buildings, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    buildingId: '',
    priority: 'Info' as BulletinPriority,
    body: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Post Bulletin</CardTitle>
        <CardDescription>Share important information with your building community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Building</label>
            <select
              value={formData.buildingId}
              onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Select building...</option>
              {buildings.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as BulletinPriority })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Info">Info</option>
              <option value="Important">Important</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Message</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              rows={5}
              required
              minLength={10}
              maxLength={2000}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Post Bulletin</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function BulletinCard({ bulletin }: { bulletin: any }) {
  const priorityIcons = {
    Info: <Info className="h-5 w-5 text-blue-500" />,
    Important: <AlertCircle className="h-5 w-5 text-orange-500" />,
    Critical: <AlertTriangle className="h-5 w-5 text-red-500" />,
  };

  const priorityColors = {
    Info: 'border-blue-500',
    Important: 'border-orange-500',
    Critical: 'border-red-500',
  };

  return (
    <Card className={`border-l-4 ${priorityColors[bulletin.priority]}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {priorityIcons[bulletin.priority]}
            <CardTitle>{bulletin.building?.name}</CardTitle>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {bulletin.priority}
          </span>
        </div>
        <CardDescription>
          Posted by {bulletin.createdBy?.displayName || 'Admin'} •{' '}
          {new Date(bulletin.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{bulletin.body}</p>
      </CardContent>
    </Card>
  );
}

