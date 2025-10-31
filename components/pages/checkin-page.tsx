'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckinStatus } from '@prisma/client';
import { Check, AlertCircle, HeartHandshake } from 'lucide-react';
import { MainNav } from '@/components/navigation/main-nav';

export function CheckinPage() {
  const [selectedStatus, setSelectedStatus] = useState<CheckinStatus | null>(null);
  const [note, setNote] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: buildings } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

  const { data: currentCheckin } = useQuery('current-checkin', async () => {
    const res = await fetch('/api/checkins');
    if (!res.ok) throw new Error('Failed to fetch checkin');
    const data = await res.json();
    return data.checkins[0] || null;
  });

  const checkinMutation = useMutation(
    async (data: { buildingId: string; status: CheckinStatus; note?: string }) => {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    {
      onSuccess: () => {
        toast({
          title: 'Status updated',
          description: 'Your status has been saved successfully.',
        });
        queryClient.invalidateQueries('current-checkin');
        queryClient.invalidateQueries('checkins');
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to update status. Please try again.',
          variant: 'destructive',
        });
      },
    }
  );

  const handleSubmit = () => {
    if (!selectedStatus || !selectedBuilding) {
      toast({
        title: 'Missing information',
        description: 'Please select a status and building.',
        variant: 'destructive',
      });
      return;
    }

    checkinMutation.mutate({
      buildingId: selectedBuilding,
      status: selectedStatus,
      note: note || undefined,
    });
  };

  return (
    <>
      <MainNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Update Your Status</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Building</CardTitle>
          <CardDescription>Which building are you in?</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select a building...</option>
            {buildings?.buildings?.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Status</CardTitle>
          <CardDescription>Let others know how you're doing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant={selectedStatus === CheckinStatus.SAFE ? 'default' : 'outline'}
              size="lg"
              className="h-24 flex-col"
              onClick={() => setSelectedStatus(CheckinStatus.SAFE)}
            >
              <Check className="mb-2 h-8 w-8" />
              <span>I'm Safe</span>
            </Button>

            <Button
              variant={selectedStatus === CheckinStatus.NEED_HELP ? 'destructive' : 'outline'}
              size="lg"
              className="h-24 flex-col"
              onClick={() => setSelectedStatus(CheckinStatus.NEED_HELP)}
            >
              <AlertCircle className="mb-2 h-8 w-8" />
              <span>Need Help</span>
            </Button>

            <Button
              variant={selectedStatus === CheckinStatus.CAN_HELP ? 'default' : 'outline'}
              size="lg"
              className="h-24 flex-col"
              onClick={() => setSelectedStatus(CheckinStatus.CAN_HELP)}
            >
              <HeartHandshake className="mb-2 h-8 w-8" />
              <span>Can Help</span>
            </Button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Optional Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional information..."
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              rows={3}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-muted-foreground">{note.length}/500</p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedStatus || !selectedBuilding || checkinMutation.isLoading}
            className="w-full"
          >
            {checkinMutation.isLoading ? 'Saving...' : 'Save Status'}
          </Button>
        </CardContent>
      </Card>

      {currentCheckin && (
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Status:</span> {currentCheckin.status}
              </div>
              <div>
                <span className="font-medium">Building:</span> {currentCheckin.building?.name}
              </div>
              {currentCheckin.note && (
                <div>
                  <span className="font-medium">Note:</span> {currentCheckin.note}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(currentCheckin.updatedAt).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}

