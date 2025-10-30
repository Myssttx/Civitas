'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Alert } from '@prisma/client';
import { haversineDistance, formatDistance, findNearest, Point } from '@/lib/geospatial';
import { Button } from '@/components/ui/button';

interface SafetyResource {
  id: string;
  type: string;
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  buildingId: string;
}

interface Building {
  id: string;
  name: string;
  polygon: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

interface CampusMapProps {
  alerts?: Alert[];
  buildings?: Building[];
  resources?: SafetyResource[];
  onNearestShelterFound?: (shelter: SafetyResource, distance: number) => void;
  userLocation?: Point;
}

export function CampusMap({
  alerts = [],
  buildings = [],
  resources = [],
  onNearestShelterFound,
  userLocation,
}: CampusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const layersRef = useRef<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const centerLat = parseFloat(process.env.NEXT_PUBLIC_CAMPUS_CENTER_LAT || '33.2075');
  const centerLng = parseFloat(process.env.NEXT_PUBLIC_CAMPUS_CENTER_LNG || '-97.1526');

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [centerLng, centerLat],
      zoom: 15,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [centerLat, centerLng]);

  // Add buildings layer
  useEffect(() => {
    if (!map.current || !mapLoaded || buildings.length === 0) return;

    const sourceId = 'buildings';
    const layerId = 'buildings-layer';

    // Remove existing layer
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
      map.current.removeSource(sourceId);
    }

    const features = buildings.map((building) => ({
      type: 'Feature' as const,
      geometry: building.polygon,
      properties: { name: building.name, id: building.id },
    }));

    map.current.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    });

    map.current.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': '#4fc3f7',
        'fill-opacity': 0.2,
      },
    });

    map.current.addLayer({
      id: `${layerId}-outline`,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#4fc3f7',
        'line-width': 2,
      },
    });

    layersRef.current.push(layerId, `${layerId}-outline`);

    return () => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
        map.current.removeLayer(`${layerId}-outline`);
        map.current.removeSource(sourceId);
      }
    };
  }, [mapLoaded, buildings]);

  // Add safety resources markers
  useEffect(() => {
    if (!map.current || !mapLoaded || resources.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    resources.forEach((resource) => {
      const [lng, lat] = resource.location.coordinates;
      const color = getResourceColor(resource.type);

      const el = document.createElement('div');
      el.className = 'resource-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const marker = new maplibregl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup().setHTML(`<strong>${resource.name}</strong><br>${resource.type}`)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [mapLoaded, resources]);

  // Add alert polygons
  useEffect(() => {
    if (!map.current || !mapLoaded || alerts.length === 0) return;

    const sourceId = 'alerts';
    const layerId = 'alerts-layer';

    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
      map.current.removeSource(sourceId);
    }

    const features = alerts
      .filter((alert) => alert.geometry)
      .map((alert) => ({
        type: 'Feature' as const,
        geometry: alert.geometry as any,
        properties: {
          id: alert.id,
          severity: alert.severity,
          event: alert.event,
        },
      }));

    map.current.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    });

    map.current.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': [
          'match',
          ['get', 'severity'],
          'Extreme',
          '#d32f2f',
          'Severe',
          '#f44336',
          'Moderate',
          '#ff9800',
          'Minor',
          '#4caf50',
          '#78909c',
        ],
        'fill-opacity': 0.3,
      },
    });

    map.current.addLayer({
      id: `${layerId}-outline`,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': [
          'match',
          ['get', 'severity'],
          'Extreme',
          '#d32f2f',
          'Severe',
          '#f44336',
          'Moderate',
          '#ff9800',
          'Minor',
          '#4caf50',
          '#78909c',
        ],
        'line-width': 2,
      },
    });

    layersRef.current.push(layerId, `${layerId}-outline`);

    return () => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
        map.current.removeLayer(`${layerId}-outline`);
        map.current.removeSource(sourceId);
      }
    };
  }, [mapLoaded, alerts]);

  // Map click handler for nearest shelter
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      const shelters = resources.filter((r) => r.type === 'Shelter');
      if (shelters.length === 0 || !onNearestShelterFound) return;

      const clickPoint: Point = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      };

      const sheltersWithLocation = shelters.map((s) => ({
        ...s,
        location: {
          lat: s.location.coordinates[1],
          lng: s.location.coordinates[0],
        },
      }));

      const nearest = findNearest(clickPoint, sheltersWithLocation);
      if (nearest) {
        onNearestShelterFound(nearest.item, nearest.distance);
      }
    };

    map.current.on('click', handleClick);

    return () => {
      map.current?.off('click', handleClick);
    };
  }, [mapLoaded, resources, onNearestShelterFound]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    const el = document.createElement('div');
    el.className = 'user-location';
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#1976d2';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 0 10px rgba(25, 118, 210, 0.5)';

    const marker = new maplibregl.Marker(el)
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);

    return () => {
      marker.remove();
    };
  }, [mapLoaded, userLocation]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      )}
    </div>
  );
}

function getResourceColor(type: string): string {
  const colors: Record<string, string> = {
    Shelter: '#1976d2',
    AED: '#f44336',
    Stairwell: '#ff9800',
    Exit: '#4caf50',
    Assembly: '#9c27b0',
    Clinic: '#00bcd4',
  };
  return colors[type] || '#78909c';
}

