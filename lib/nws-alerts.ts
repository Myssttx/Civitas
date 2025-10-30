/**
 * National Weather Service alert ingestion and normalization
 */

import { AlertSeverity, AlertUrgency, AlertCertainty } from '@prisma/client';
import type { Feature, Polygon, MultiPolygon, Point } from 'geojson';

export interface NWSAlert {
  id: string;
  properties: {
    id: string;
    event: string;
    headline?: string;
    description?: string;
    severity: string;
    urgency: string;
    certainty: string;
    effective: string;
    expires?: string;
    areaDesc: string;
  };
  geometry: Polygon | MultiPolygon | Point | null;
}

/**
 * Normalize NWS severity to Prisma enum
 */
export function normalizeSeverity(severity: string): AlertSeverity {
  const s = severity.toLowerCase();
  if (s.includes('extreme')) return AlertSeverity.Extreme;
  if (s.includes('severe')) return AlertSeverity.Severe;
  if (s.includes('moderate')) return AlertSeverity.Moderate;
  if (s.includes('minor')) return AlertSeverity.Minor;
  return AlertSeverity.Unknown;
}

/**
 * Normalize NWS urgency to Prisma enum
 */
export function normalizeUrgency(urgency: string): AlertUrgency {
  const u = urgency.toLowerCase();
  if (u.includes('immediate')) return AlertUrgency.Immediate;
  if (u.includes('expected')) return AlertUrgency.Expected;
  if (u.includes('future')) return AlertUrgency.Future;
  if (u.includes('past')) return AlertUrgency.Past;
  return AlertUrgency.Unknown;
}

/**
 * Normalize NWS certainty to Prisma enum
 */
export function normalizeCertainty(certainty: string): AlertCertainty {
  const c = certainty.toLowerCase();
  if (c.includes('observed')) return AlertCertainty.Observed;
  if (c.includes('likely')) return AlertCertainty.Likely;
  if (c.includes('possible')) return AlertCertainty.Possible;
  if (c.includes('unlikely')) return AlertCertainty.Unlikely;
  return AlertCertainty.Unknown;
}

/**
 * Fetch alerts from NWS API
 */
export async function fetchNWSAlerts(
  area: string = 'TX'
): Promise<NWSAlert[]> {
  const url = `https://api.weather.gov/alerts?area=${area}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Campus Resilience App',
    },
  });

  if (!response.ok) {
    throw new Error(`NWS API error: ${response.status}`);
  }

  const data = await response.json();
  return data.features || [];
}

/**
 * Transform NWS alert to database format
 */
export function transformNWSAlert(alert: NWSAlert) {
  return {
    sourceId: alert.properties.id,
    event: alert.properties.event,
    headline: alert.properties.headline || null,
    description: alert.properties.description || null,
    severity: normalizeSeverity(alert.properties.severity),
    urgency: normalizeUrgency(alert.properties.urgency),
    certainty: normalizeCertainty(alert.properties.certainty),
    effective: new Date(alert.properties.effective),
    expires: alert.properties.expires ? new Date(alert.properties.expires) : null,
    geometry: alert.geometry ? JSON.parse(JSON.stringify(alert.geometry)) : null,
    areaDesc: alert.properties.areaDesc || null,
    raw: alert,
  };
}

