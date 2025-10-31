'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { CampusMap } from '@/components/map/campus-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, MapPin, Shield } from 'lucide-react';
import { formatDistance } from '@/lib/geospatial';
import { OfflineBanner } from '@/components/offline-banner';
import { MainNav } from '@/components/navigation/main-nav';

export function HomePage() {
  const [nearestShelter, setNearestShelter] = useState<{ name: string; distance: number } | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: alertsData } = useQuery('alerts', async () => {
    const res = await fetch('/api/alerts?status=active&limit=10');
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  });

  const { data: buildingsData } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

      const { data: resourcesData } = useQuery('resources', async () => {
        const res = await fetch('/api/resources');
        if (!res.ok) throw new Error('Failed to fetch resources');
        return res.json();
      });

      const { data: safeAreasData } = useQuery('safe-areas', async () => {
        const res = await fetch('/api/admin/safe-areas');
        if (!res.ok) return { safeAreas: [] };
        return res.json();
      });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // User denied or error
        }
      );
    }
  }, []);

  const alerts = alertsData?.alerts || [];
  const buildings = buildingsData?.buildings || [];
  const resources = resourcesData?.resources || [];

  const highestSeverityAlert = alerts.sort((a: any, b: any) => {
    const severityOrder: Record<string, number> = {
      Extreme: 4,
      Severe: 3,
      Moderate: 2,
      Minor: 1,
      Unknown: 0,
    };
    return severityOrder[b.severity] - severityOrder[a.severity];
  })[0];

  return (
    <>
      <MainNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <OfflineBanner />
        <header className="border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">🛡️ Campus Resilience</h1>
          {nearestShelter && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>
                Nearest: {nearestShelter.name} ({formatDistance(nearestShelter.distance)})
              </span>
            </div>
          )}
        </div>
      </header>

      {highestSeverityAlert && (
        <div className="border-b bg-destructive/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <strong className="text-destructive">{highestSeverityAlert.event}</strong>
              <p className="text-sm text-muted-foreground">{highestSeverityAlert.headline}</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 border-r bg-card p-4 md:block overflow-y-auto">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                ) : (
                  <div className="space-y-2">
                    {alerts.slice(0, 5).map((alert: any) => (
                      <div
                        key={alert.id}
                        className="rounded-md border p-2 text-sm"
                        style={{
                          borderLeftColor: getSeverityColor(alert.severity),
                          borderLeftWidth: '4px',
                        }}
                      >
                        <div className="font-medium">{alert.event}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(alert.expires || alert.effective).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/checkin">
                    <Shield className="mr-2 h-4 w-4" />
                    Check In
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/community">View Community</a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/alerts">View All Alerts</a>
                </Button>
              </CardContent>
            </Card>

            {nearestShelter && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nearest Shelter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="font-medium">{nearestShelter.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistance(nearestShelter.distance)} away
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </aside>

            <div className="flex-1">
              <CampusMap
                alerts={alerts}
                buildings={buildings}
                resources={resources}
                safeAreas={safeAreasData?.safeAreas?.map((sa: any) => sa.buildingId) || []}
                userLocation={userLocation || undefined}
                onNearestShelterFound={(shelter, distance) => {
                  setNearestShelter({ name: shelter.name, distance });
                }}
              />
            </div>
      </main>
      </div>
    </>
  );
}

function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    Extreme: '#d32f2f',
    Severe: '#f44336',
    Moderate: '#ff9800',
    Minor: '#4caf50',
    Unknown: '#78909c',
  };
  return colors[severity] || colors.Unknown;
}
