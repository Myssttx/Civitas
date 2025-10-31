'use client';

import { useQuery } from 'react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, HeartHandshake } from 'lucide-react';
import { CheckinStatus } from '@prisma/client';
import { MainNav } from '@/components/navigation/main-nav';

export function CommunityPage() {
  const { data: checkinsData } = useQuery('community-checkins', async () => {
    const res = await fetch('/api/checkins/community');
    if (!res.ok) throw new Error('Failed to fetch community statuses');
    return res.json();
  });

  const { data: buildings } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

  const checkins = checkinsData?.checkins || [];

  // Group by status
  const safe = checkins.filter((c: any) => c.status === CheckinStatus.SAFE);
  const needHelp = checkins.filter((c: any) => c.status === CheckinStatus.NEED_HELP);
  const canHelp = checkins.filter((c: any) => c.status === CheckinStatus.CAN_HELP);

  // Group by building
  const byBuilding = checkins.reduce((acc: any, checkin: any) => {
    const buildingId = checkin.buildingId;
    if (!acc[buildingId]) {
      acc[buildingId] = {
        building: checkin.building,
        checkins: [],
      };
    }
    acc[buildingId].checkins.push(checkin);
    return acc;
  }, {});

  return (
    <>
      <MainNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Community Status</h1>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Safe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{safe.length}</div>
            <p className="text-sm text-muted-foreground">People confirmed safe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Need Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{needHelp.length}</div>
            <p className="text-sm text-muted-foreground">People requesting assistance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HeartHandshake className="h-5 w-5 text-blue-500" />
              Can Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{canHelp.length}</div>
            <p className="text-sm text-muted-foreground">People available to help</p>
          </CardContent>
        </Card>
      </div>

      {/* Status by Building */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Status by Building</h2>
        {Object.values(byBuilding).map((group: any) => (
          <Card key={group.building.id}>
            <CardHeader>
              <CardTitle>{group.building.name}</CardTitle>
              <CardDescription>
                {group.checkins.length} {group.checkins.length === 1 ? 'person' : 'people'} checked in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {group.checkins.map((checkin: any) => (
                  <div
                    key={checkin.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon status={checkin.status} />
                      <div>
                        <div className="font-medium">
                          {checkin.user?.displayName || 'Anonymous'}
                        </div>
                        {checkin.note && (
                          <div className="text-sm text-muted-foreground">{checkin.note}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(checkin.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {checkins.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No community check-ins yet. Be the first to check in!
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}

function StatusIcon({ status }: { status: CheckinStatus }) {
  const icons = {
    [CheckinStatus.SAFE]: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    [CheckinStatus.NEED_HELP]: <AlertCircle className="h-5 w-5 text-red-500" />,
    [CheckinStatus.CAN_HELP]: <HeartHandshake className="h-5 w-5 text-blue-500" />,
  };
  return icons[status] || <CheckCircle2 className="h-5 w-5" />;
}

