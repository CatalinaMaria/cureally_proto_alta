import type { Activity } from '../../types/domain';
import { Badge } from '../feedback/Badge';
import { Card } from './Card';

interface ActivityListProps {
  activities: Activity[];
  emptyMessage?: string;
}

export function ActivityList({ activities, emptyMessage = 'No hay actividades registradas.' }: ActivityListProps) {
  if (!activities.length) {
    return <p className="muted-text">{emptyMessage}</p>;
  }

  return (
    <div className="stack-sm">
      {activities.map((activity) => {
        const recurrence = formatRecurrence(activity);
        return (
          <Card key={activity.id} className="list-card">
            <div className="list-card__row">
              <p className="list-card__title">{activity.titulo}</p>
              <p className="list-card__time">{formatHour(activity.hora)}</p>
            </div>
            <div className="list-card__row">
              <Badge variant={activity.estado === 'completada' ? 'success' : 'warning'}>
                {activity.estado === 'completada' ? 'Completada' : 'Pendiente'}
              </Badge>
              <span className="muted-text">{formatCategory(activity.categoria)}</span>
            </div>
            {recurrence ? <p className="list-card__meta">{recurrence}</p> : null}
          </Card>
        );
      })}
    </div>
  );
}

function formatHour(time24: string) {
  const [hour, minute] = time24.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalizedHour}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function formatCategory(category: Activity['categoria']) {
  if (category === 'medicacion') return 'Medicación';
  if (category === 'consulta') return 'Consulta';
  return 'Tarea';
}

function formatRecurrence(activity: Activity) {
  if (activity.repeticion === 'todos_los_dias') {
    if (activity.duracion === 'hasta_fecha' && activity.fechaFinalizacion) {
      return `Diaria · hasta ${formatShortDate(activity.fechaFinalizacion)}`;
    }
    return 'Diaria · indefinida';
  }

  if (activity.repeticion === 'semanal') {
    if (activity.duracion === 'hasta_fecha' && activity.fechaFinalizacion) {
      return `Semanal · hasta ${formatShortDate(activity.fechaFinalizacion)}`;
    }
    return 'Semanal · indefinida';
  }

  if (activity.repeticion === 'personalizado') {
    return 'Repetición personalizada';
  }

  return null;
}

function formatShortDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(`${dateIso}T00:00:00`));
}
