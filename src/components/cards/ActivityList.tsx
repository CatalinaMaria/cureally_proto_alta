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
      {activities.map((activity) => (
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
        </Card>
      ))}
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
