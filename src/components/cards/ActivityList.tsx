import { useEffect, useState } from 'react';
import type { Activity } from '../../types/domain';
import { Badge } from '../feedback/Badge';
import { Button } from '../forms/Button';
import { Card } from './Card';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

interface ActivityListProps {
  activities: Activity[];
  emptyMessage?: string;
  enableDetail?: boolean;
  responsiblePerson?: string;
  onOpenCalendar?: () => void;
}

export function ActivityList({
  activities,
  emptyMessage = 'No hay actividades registradas.',
  enableDetail = false,
  responsiblePerson = 'Carolina, cuidadora',
  onOpenCalendar,
}: ActivityListProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const closeDetail = () => {
    setSelectedActivity(null);
    setRequestSent(false);
  };

  useModalScrollLock(enableDetail && Boolean(selectedActivity));

  useEffect(() => {
    if (!enableDetail || !selectedActivity) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDetail();
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [enableDetail, selectedActivity]);

  if (!activities.length) {
    return <p className="muted-text">{emptyMessage}</p>;
  }

  const selectedResponsible = selectedActivity?.responsable ?? responsiblePerson;
  const selectedResponsibleName = selectedResponsible.split(',')[0]?.trim() || 'la cuidadora';
  const selectedStatusLabel = selectedActivity?.estado === 'completada' ? 'Confirmada' : 'Sin confirmar';
  const isSelectedConfirmed = selectedActivity?.estado === 'completada';

  return (
    <>
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
              {enableDetail ? (
                <div className="list-card__footer">
                  <button
                    type="button"
                    className="text-button list-card__detail-link"
                    onClick={() => {
                      setRequestSent(false);
                      setSelectedActivity(activity);
                    }}
                  >
                    Ver detalle
                  </button>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
      {enableDetail && selectedActivity ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeDetail}>
          <div
            className="activity-modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="actividad-detalle-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="actividad-detalle-titulo" className="activity-modal-sheet__title">
              {selectedActivity.titulo}
            </h4>
            <dl className="activity-modal-sheet__details">
              <div>
                <dt>Hora</dt>
                <dd>{formatHour(selectedActivity.hora)}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{formatCategory(selectedActivity.categoria)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{selectedStatusLabel}</dd>
              </div>
              <div>
                <dt>Responsable</dt>
                <dd>{selectedResponsible}</dd>
              </div>
            </dl>
            <p className="activity-modal-sheet__note">{selectedActivity.nota ?? getActivityNote(selectedActivity)}</p>
            <div className="activity-modal-sheet__actions">
              <Button variant="primary" onClick={() => setRequestSent(true)} disabled={isSelectedConfirmed}>
                {isSelectedConfirmed ? 'Confirmada por cuidadora' : 'Solicitar confirmación'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  onOpenCalendar?.();
                  closeDetail();
                }}
              >
                Ver agenda
              </Button>
              <Button variant="ghost" onClick={closeDetail}>
                Cerrar
              </Button>
            </div>
            {requestSent ? (
              <p className="activity-modal-sheet__feedback">Solicitud enviada a {selectedResponsibleName}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
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

function getActivityNote(activity: Activity) {
  if (activity.categoria === 'medicacion') {
    return 'Administrar después del desayuno.';
  }

  if (activity.categoria === 'consulta') {
    return 'Revisar indicaciones médicas al finalizar la consulta.';
  }

  return 'Coordinar la actividad según el plan de cuidado del día.';
}
