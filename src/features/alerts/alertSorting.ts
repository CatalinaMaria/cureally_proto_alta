import type { Alert } from '../../types/domain';

const SEVERITY_ORDER: Record<Alert['severidad'], number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

export function sortAlertsByPriority(alerts: Alert[]) {
  return [...alerts].sort((a, b) => {
    const severityDifference = SEVERITY_ORDER[a.severidad] - SEVERITY_ORDER[b.severidad];
    if (severityDifference !== 0) return severityDifference;
    return timeToMinutes(b.hora) - timeToMinutes(a.hora);
  });
}

function timeToMinutes(value: string) {
  if (value.toLowerCase() === 'ahora') return 24 * 60 + 1;
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
}
