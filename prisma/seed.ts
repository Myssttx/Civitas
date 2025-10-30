/**
 * Seed script for Campus Resilience
 * Creates sample buildings, resources, and alerts
 */

import { PrismaClient, UserRole, SafetyResourceType, AlertSeverity, AlertUrgency, AlertCertainty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test admin user (you'll need to create the auth user in Supabase first)
  const adminAuthId = process.env.SEED_ADMIN_AUTH_ID || 'test-admin-auth-id';
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@campus.edu' },
    update: {},
    create: {
      authId: adminAuthId,
      email: 'admin@campus.edu',
      displayName: 'Campus Admin',
      roles: [UserRole.Admin],
      language: 'en',
    },
  });

  console.log('✅ Created admin user');

  // Create sample buildings (UNT Denton campus)
  const building1 = await prisma.building.upsert({
    where: { id: 'seed-bldg-1' },
    update: {},
    create: {
      id: 'seed-bldg-1',
      name: 'General Academic Building (GAB)',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [-97.152, 33.207],
            [-97.151, 33.207],
            [-97.151, 33.208],
            [-97.152, 33.208],
            [-97.152, 33.207],
          ],
        ],
      },
      floors: 4,
      metadata: {
        address: '1704 W. Mulberry St, Denton, TX',
        capacity: 500,
      },
    },
  });

  const building2 = await prisma.building.upsert({
    where: { id: 'seed-bldg-2' },
    update: {},
    create: {
      id: 'seed-bldg-2',
      name: 'Willis Library',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [-97.1505, 33.2065],
            [-97.1495, 33.2065],
            [-97.1495, 33.2075],
            [-97.1505, 33.2075],
            [-97.1505, 33.2065],
          ],
        ],
      },
      floors: 5,
      metadata: {
        address: '1506 W. Highland St, Denton, TX',
        capacity: 1000,
      },
    },
  });

  const building3 = await prisma.building.upsert({
    where: { id: 'seed-bldg-3' },
    update: {},
    create: {
      id: 'seed-bldg-3',
      name: 'University Union',
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [-97.1535, 33.2075],
            [-97.1525, 33.2075],
            [-97.1525, 33.2085],
            [-97.1535, 33.2085],
            [-97.1535, 33.2075],
          ],
        ],
      },
      floors: 3,
      metadata: {
        address: '1155 Union Circle, Denton, TX',
        capacity: 2000,
      },
    },
  });

  console.log('✅ Created buildings');

  // Create safety resources
  const resources = [
    {
      buildingId: building1.id,
      type: SafetyResourceType.Shelter,
      name: 'GAB Room 312 - Storm Shelter',
      location: { type: 'Point', coordinates: [-97.1515, 33.2075] },
      floor: 3,
    },
    {
      buildingId: building1.id,
      type: SafetyResourceType.AED,
      name: 'AED - GAB First Floor Entrance',
      location: { type: 'Point', coordinates: [-97.1518, 33.2072] },
      floor: 1,
    },
    {
      buildingId: building2.id,
      type: SafetyResourceType.Shelter,
      name: 'Library Lower Level - Emergency Shelter',
      location: { type: 'Point', coordinates: [-97.15, 33.207] },
      floor: 0,
    },
    {
      buildingId: building2.id,
      type: SafetyResourceType.AED,
      name: 'AED - Library Main Entrance',
      location: { type: 'Point', coordinates: [-97.1502, 33.2068] },
      floor: 1,
    },
    {
      buildingId: building3.id,
      type: SafetyResourceType.Shelter,
      name: 'Union Storm Room',
      location: { type: 'Point', coordinates: [-97.153, 33.208] },
      floor: 1,
    },
    {
      buildingId: building3.id,
      type: SafetyResourceType.Assembly,
      name: 'Union Courtyard - Assembly Point',
      location: { type: 'Point', coordinates: [-97.1528, 33.2082] },
    },
  ];

  for (const resource of resources) {
    await prisma.safetyResource.upsert({
      where: {
        id: `seed-resource-${resource.buildingId}-${resource.name}`,
      },
      update: {},
      create: {
        id: `seed-resource-${resource.buildingId}-${resource.name}`,
        ...resource,
      },
    });
  }

  console.log('✅ Created safety resources');

  // Create sample alerts
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  await prisma.alert.upsert({
    where: { sourceId: 'seed-alert-1' },
    update: {},
    create: {
      sourceId: 'seed-alert-1',
      event: 'Severe Thunderstorm Warning',
      headline: 'Severe Thunderstorm Warning issued for Denton County',
      description: 'Large hail and damaging winds possible.',
      severity: AlertSeverity.Severe,
      urgency: AlertUrgency.Immediate,
      certainty: AlertCertainty.Likely,
      effective: now,
      expires: tomorrow,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-97.16, 33.20],
            [-97.14, 33.20],
            [-97.14, 33.22],
            [-97.16, 33.22],
            [-97.16, 33.20],
          ],
        ],
      },
      areaDesc: 'Denton County, TX',
      raw: {},
    },
  });

  await prisma.alert.upsert({
    where: { sourceId: 'seed-alert-2' },
    update: {},
    create: {
      sourceId: 'seed-alert-2',
      event: 'Flash Flood Watch',
      headline: 'Flash Flood Watch in effect until tomorrow',
      description: 'Heavy rainfall may cause flash flooding.',
      severity: AlertSeverity.Moderate,
      urgency: AlertUrgency.Expected,
      certainty: AlertCertainty.Possible,
      effective: now,
      expires: tomorrow,
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-97.16, 33.20],
            [-97.14, 33.20],
            [-97.14, 33.22],
            [-97.16, 33.22],
            [-97.16, 33.20],
          ],
        ],
      },
      areaDesc: 'Denton County, TX',
      raw: {},
    },
  });

  console.log('✅ Created sample alerts');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

