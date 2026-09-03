import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { AlertList } from '../../components/cards/AlertList';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { CAROLINA_MEMBER_ID, getCareMemberName } from '../../data/mockData';
import { useModalScrollLock } from '../../hooks/useModalScrollLock';

export function AlertsScreen() {
  const navigate = useNavigate();
  const { alerts, dailyReport } = useCareStore();
  const [feedback, setFeedback] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportAuthorId, setReportAuthorId] = useState(CAROLINA_MEMBER_ID);

  useModalScrollLock(isReportOpen);

  const pushFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2600);
  };

  useEffect(() => {
    if (!isReportOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsReportOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isReportOpen]);

  const openReportSheet = (responsableId?: string) => {
    setReportAuthorId(responsableId ?? CAROLINA_MEMBER_ID);
    setIsReportOpen(true);
  };

  const closeReportSheet = () => {
    setIsReportOpen(false);
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Alertas" subtitle="Seguimiento de avisos importantes del cuidado." />
      <SectionTitle title="Centro de atención" />

      <AlertList
        alerts={alerts}
        onRequestConfirmation={(alert) => pushFeedback(`Solicitud enviada a ${getCareMemberName(alert.responsableId)}`)}
        onContactCaregiver={(alert) =>
          navigate('/messages', {
            state: {
              conversation: getCareMemberName(alert.responsableId),
              compose: true,
            },
          })
        }
        onViewCalendar={() => navigate('/calendar')}
        onViewReport={(alert) => openReportSheet(alert.responsableId)}
        onViewStock={() => navigate('/stock')}
      />

      {feedback ? (
        <p className="alerts-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      {isReportOpen ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeReportSheet}>
          <div
            className="activity-modal-sheet task-modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="informe-alerta-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="informe-alerta-titulo" className="activity-modal-sheet__title">{`Informe diario de ${getCareMemberName(reportAuthorId)}`}</h4>

            <p className="muted-text">Fecha: {formatDate(dailyReport.fecha)}</p>
            <p className="task-modal-sheet__text task-modal-sheet__report-text">{dailyReport.observaciones}</p>

            <div className="check-list" aria-label="Resumen del informe">
              {dailyReport.checks.map((check) => (
                <p key={check} className="check-list__item">
                  ✓ {check}
                </p>
              ))}
            </div>

            <div className="task-modal-sheet__actions">
              <Button type="button" variant="secondary" fullWidth onClick={closeReportSheet}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateIso}T00:00:00`));
}
