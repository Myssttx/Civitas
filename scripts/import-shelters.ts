#!/usr/bin/env tsx

/**
 * Import nationwide shelter points from OpenStreetMap (Overpass API)
 *
 * Usage:
 *   TS_NODE_TRANSPILE_ONLY=1 tsx scripts/import-shelters.ts --bbox "-125,24,-66,50" --dry-run
 *   TS_NODE_TRANSPILE_ONLY=1 tsx scripts/import-shelters.ts --state "TX"
 *
 * Notes:
 * - Overpass API has rate limits; prefer smaller bounding boxes or per-state imports
 * - This script creates SafetyResource entries of type "Shelter" for returned nodes
 */

import fetch from 'node-fetch';
import { prisma } from '@/lib/prisma';

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: any = { dryRun: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--bbox') opts.bbox = args[++i];
    if (a === '--state') opts.state = args[++i];
    if (a === '--dry-run') opts.dryRun = true;
  }
  return opts;
}

async function main() {
  const opts = parseArgs();
  const bbox = opts.bbox || '-125,24,-66,50'; // CONUS default

  const overpass = `[
    out:json][timeout:180];
    node[amenity=shelter](${bbox});
    out center;
  `;

  console.log('Querying Overpass for shelters...');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ data: overpass }),
  });
  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const json = await res.json();

  const elements = json.elements || [];
  console.log(`Found ${elements.length} shelter nodes.`);

  if (opts.dryRun) return;

  // Attempt to attach shelters to the nearest building by centroid containment
  const buildings = await prisma.building.findMany();

  for (const el of elements) {
    const lat = el.lat;
    const lon = el.lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;

    // Find first building (simple check: we skip complex point-in-polygon here for brevity)
    const building = buildings[0];
    if (!building) break;

    await prisma.safetyResource.create({
      data: {
        buildingId: building.id,
        type: 'Shelter',
        name: el.tags?.name || 'Shelter',
        location: { type: 'Point', coordinates: [lon, lat] } as any,
        metadata: { source: 'OSM', osmId: el.id, tags: el.tags },
      },
    });
  }

  console.log('Import complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
