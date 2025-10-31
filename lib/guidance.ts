export type Guidance = {
  title: string;
  tips: string[];
};

const GUIDANCE_MAP: Record<string, Guidance> = {
  TornadoWarning: {
    title: 'Tornado Warning',
    tips: [
      'Go to a basement or interior room on the lowest floor.',
      'Stay away from windows and exterior walls.',
      'Cover yourself with a mattress, heavy blankets, or wear a helmet.',
      'If outside, get to a sturdy building immediately.',
    ],
  },
  SevereThunderstormWarning: {
    title: 'Severe Thunderstorm Warning',
    tips: [
      'Move indoors; avoid using wired electronics.',
      'Stay away from windows and glass.',
      'Secure loose outdoor items.',
      'Avoid flood-prone areas.',
    ],
  },
  FlashFloodWarning: {
    title: 'Flash Flood Warning',
    tips: [
      'Move to higher ground immediately.',
      'Do not walk or drive through flood waters.',
      'Avoid basements and low-lying areas.',
      'Monitor alerts for evacuation routes.',
    ],
  },
  WinterStormWarning: {
    title: 'Winter Storm Warning',
    tips: [
      'Avoid travel; if you must travel, keep an emergency kit.',
      'Dress in layers; avoid overexertion while shoveling snow.',
      'Prevent carbon monoxide poisoning; never run generators indoors.',
      'Keep phones charged and conserve battery.',
    ],
  },
  RedFlagWarning: {
    title: 'Red Flag Warning (Fire Weather)',
    tips: [
      'Avoid open flames and spark-producing activities.',
      'Prepare for rapid fire spread; know at least two exit routes.',
      'Keep go-bags ready and vehicles fueled.',
      'Stay alert for evacuation orders.',
    ],
  },
  Earthquake: {
    title: 'Earthquake',
    tips: [
      'Drop, Cover, and Hold On under sturdy furniture.',
      'Stay indoors until shaking stops and it is safe to exit.',
      'Move away from windows and heavy objects that can fall.',
      'If outside, move to open area away from buildings and power lines.',
    ],
  },
};

export function getGuidanceForEvent(event: string): Guidance | null {
  return GUIDANCE_MAP[event] || null;
}

export function getGuidanceForAlerts(alerts: Array<{ event: string }>): Guidance[] {
  const seen = new Set<string>();
  const result: Guidance[] = [];
  for (const a of alerts) {
    const key = a.event.replace(/\s+/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    const g = getGuidanceForEvent(key);
    if (g) result.push(g);
  }
  return result;
}
