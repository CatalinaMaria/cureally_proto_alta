import type { Activity } from '../../types/domain';
import { Card } from './Card';

interface ProximaActividadCardProps {
  activity: Activity | null;
}

export function ProximaActividadCard({ activity }: ProximaActividadCardProps) {
  return (
    <Card>
      <h3 className="card-title">Próxima actividad</h3>
      {activity ? (
        <div className="next-activity">
          <p className="next-activity__time">{formatHour(activity.hora)}</p>
          <div>
            <p className="next-activity__title">{activity.titulo}</p>
            <p className="next-activity__category">{formatCategory(activity.categoria)}</p>
          </div>
        </div>
      ) : (
        <p className="muted-text">No hay actividades programadas para hoy.</p>
      )}
    </Card>
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
