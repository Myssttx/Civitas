/**
 * Geospatial utility functions for distance calculations and geometry operations
 */

export interface Point {
  lat: number;
  lng: number;
}

/**
 * Calculate Haversine distance between two points in meters
 */
export function haversineDistance(
  point1: Point,
  point2: Point
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest point from a reference point
 */
export function findNearest<T extends { location: Point }>(
  reference: Point,
  candidates: T[]
): { item: T; distance: number } | null {
  if (candidates.length === 0) return null;

  let nearest = candidates[0];
  let minDistance = haversineDistance(reference, candidates[0].location);

  for (let i = 1; i < candidates.length; i++) {
    const distance = haversineDistance(reference, candidates[i].location);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = candidates[i];
    }
  }

  return { item: nearest, distance: Math.round(minDistance) };
}

/**
 * Check if a point is inside a polygon
 */
export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

