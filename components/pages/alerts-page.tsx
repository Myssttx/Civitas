'use client';

import { useQuery } from 'react-query';
import { AlertSeverity } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainNav } from '@/components/navigation/main-nav';

export function AlertsPage() {
  const { data, isLoading } = useQuery('alerts', async () => {
    const res = await fetch('/api/alerts?status=active');
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  });

  const alerts = data?.alerts || [];

  return (
    <>
      <MainNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Active Alerts</h1>

      <div className="mb-4 flex gap-2">
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Active
        </button>
        <button className="rounded-md bg-secondary px-4 py-2 text-sm font-medium">
          Upcoming
        </button>
        <button className="rounded-md bg-secondary px-4 py-2 text-sm font-medium">Expired</button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading alerts...</p>}

      {!isLoading && alerts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No active alerts at this time.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {alerts.map((alert: any) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
      </div>
    </>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const severityColor = getSeverityColor(alert.severity);

  return (
    <Card className={cn('border-l-4', `border-l-[${severityColor}]`)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{alert.event}</span>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              `bg-[${severityColor}]/20 text-[${severityColor}]`
            )}
          >
            {alert.severity}
          </span>
        </CardTitle>
        {alert.headline && <CardDescription>{alert.headline}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {alert.areaDesc && (
            <div>
              <span className="font-medium">Area:</span> {alert.areaDesc}
            </div>
          )}
          <div>
            <span className="font-medium">Effective:</span>{' '}
            {new Date(alert.effective).toLocaleString()}
          </div>
          {alert.expires && (
            <div>
              <span className="font-medium">Expires:</span>{' '}
              {new Date(alert.expires).toLocaleString()}
            </div>
          )}
          {alert.description && (
            <p className="mt-4 text-muted-foreground">{alert.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getSeverityColor(severity: AlertSeverity): string {
  const colors: Record<AlertSeverity, string> = {
    Extreme: '#d32f2f',
    Severe: '#f44336',
    Moderate: '#ff9800',
    Minor: '#4caf50',
    Unknown: '#78909c',
  };
  return colors[severity] || colors.Unknown;
}

