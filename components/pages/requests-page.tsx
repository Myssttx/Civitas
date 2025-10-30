'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function RequestsPage() {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: buildings } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

  const { data: requestsData } = useQuery('help-requests', async () => {
    const res = await fetch('/api/requests?status=Open');
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  });

  const createMutation = useMutation(
    async (data: any) => {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create request');
      return res.json();
    },
    {
      onSuccess: () => {
        toast({ title: 'Request created', description: 'Your help request has been posted.' });
        queryClient.invalidateQueries('help-requests');
        setShowForm(false);
      },
    }
  );

  const requests = requestsData?.helpRequests || [];

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Help Requests</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Request'}
        </Button>
      </div>

      {showForm && (
        <RequestForm
          buildings={buildings?.buildings || []}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No open requests at this time.
            </CardContent>
          </Card>
        ) : (
          requests.map((request: any) => <RequestCard key={request.id} request={request} />)
        )}
      </div>
    </div>
  );
}

function RequestForm({ buildings, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    buildingId: '',
    category: 'Other',
    urgency: 'Normal',
    details: '',
    sharePreciseLocation: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create Help Request</CardTitle>
        <CardDescription>Request assistance from your community</CardDescription>
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
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Medical">Medical</option>
              <option value="Supplies">Supplies</option>
              <option value="Evacuation">Evacuation</option>
              <option value="Information">Information</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Urgency</label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              rows={4}
              required
              minLength={10}
              maxLength={1000}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shareLocation"
              checked={formData.sharePreciseLocation}
              onChange={(e) =>
                setFormData({ ...formData, sharePreciseLocation: e.target.checked })
              }
            />
            <label htmlFor="shareLocation" className="text-sm">
              Share precise location (optional)
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Submit Request</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function RequestCard({ request }: { request: any }) {
  const urgencyColors: Record<string, string> = {
    Critical: 'text-red-600',
    High: 'text-orange-600',
    Normal: 'text-blue-600',
    Low: 'text-gray-600',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{request.category}</CardTitle>
            <CardDescription>{request.building?.name}</CardDescription>
          </div>
          <span className={`text-sm font-semibold ${urgencyColors[request.urgency]}`}>
            {request.urgency}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{request.details}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Posted by {request.user?.displayName || 'Anonymous'}</span>
          <span>{new Date(request.createdAt).toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

