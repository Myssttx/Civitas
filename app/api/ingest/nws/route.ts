import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchNWSAlerts, transformNWSAlert } from '@/lib/nws-alerts';

// This endpoint should be called by a cron job (Vercel scheduled function)
export async function GET(request: Request) {
  // Verify cron secret if needed
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const area = process.env.NWS_AREA || 'TX';
    const alerts = await fetchNWSAlerts(area);

    let created = 0;
    let updated = 0;

    for (const alert of alerts) {
      const transformed = transformNWSAlert(alert);

      try {
        await prisma.alert.upsert({
          where: { sourceId: transformed.sourceId },
          update: {
            event: transformed.event,
            headline: transformed.headline,
            description: transformed.description,
            severity: transformed.severity,
            urgency: transformed.urgency,
            certainty: transformed.certainty,
            effective: transformed.effective,
            expires: transformed.expires,
            geometry: transformed.geometry,
            areaDesc: transformed.areaDesc,
            raw: transformed.raw as any,
          },
          create: transformed,
        });
        updated++;
      } catch (error) {
        console.error(`Error upserting alert ${transformed.sourceId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      fetched: alerts.length,
      created,
      updated,
    });
  } catch (error) {
    console.error('Error ingesting NWS alerts:', error);
    return NextResponse.json({ error: 'Failed to ingest alerts' }, { status: 500 });
  }
}

