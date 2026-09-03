import { useEffect, useState } from 'react';
import type { Activity } from '../../types/domain';
import { Card } from './Card';
import { Button } from '../forms/Button';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';
import { getCareMember, getCareMemberName } from '../../data/mockData';

interface ProximaActividadCardProps {
  activity: Activity | null;
  note?: string;
  onOpenCalendar?: () => void;
}

export function ProximaActividadCard({
  activity,
  note = 'Administrar después del desayuno',
  onOpenCalendar,
}: ProximaActividadCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const responsibleMember = getCareMember(activity?.responsableId);
  const responsiblePerson = responsibleMember
    ? `${responsibleMember.nombre}, ${responsibleMember.rol.toLowerCase()}`
    : 'Sin asignar';
  const responsibleName = getCareMemberName(activity?.responsableId);
  const statusLabel = 'Sin confirmar';

  const closeDetail = () => {
    setIsDetailOpen(false);
    setRequestSent(false);
  };

  useModalScrollLock(isDetailOpen);

  useEffect(() => {
    if (!isDetailOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDetailOpen(false);
        setRequestSent(false);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isDetailOpen]);

  return (
    <>
    <Card className="list-card next-activity-card">
      <h3 className="card-title">Próxima actividad</h3>
      {activity ? (
        <div className="next-activity">
          <div className="next-activity__primary-row">
            <p className="next-activity__title">{activity.titulo}</p>
            <p className="next-activity__time">{formatHour(activity.hora)}</p>
          </div>
          <p className="next-activity__category">{formatCategory(activity.categoria)}</p>
          <button
            type="button"
            className="text-button next-activity__detail-link"
            onClick={() => {
              setRequestSent(false);
              setIsDetailOpen(true);
            }}
          >
            Ver detalle
          </button>
        </div>
      ) : (
        <p className="muted-text">No hay actividades programadas para hoy.</p>
      )}
    </Card>
    {activity && isDetailOpen ? (
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
            {activity.titulo}
          </h4>
          <dl className="activity-modal-sheet__details">
            <div>
              <dt>Hora</dt>
              <dd>{formatHour(activity.hora)}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{formatCategory(activity.categoria)}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{statusLabel}</dd>
            </div>
            <div>
              <dt>Responsable</dt>
              <dd>{responsiblePerson}</dd>
            </div>
          </dl>
          <p className="activity-modal-sheet__note">{note}</p>
          <div className="activity-modal-sheet__actions">
            <Button variant="primary" onClick={() => setRequestSent(true)}>
              Solicitar confirmación
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
            <p className="activity-modal-sheet__feedback">Solicitud enviada a {responsibleName}</p>
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
