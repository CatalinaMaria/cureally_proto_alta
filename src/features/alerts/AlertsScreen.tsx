import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { AlertList } from '../../components/cards/AlertList';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { careNetwork } from '../../data/mockData';
import type { Alert } from '../../types/domain';

export function AlertsScreen() {
  const navigate = useNavigate();
  const { alerts, dailyReport } = useCareStore();
  const [feedback, setFeedback] = useState('');
  const [contactAlertId, setContactAlertId] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const caregiver = careNetwork.find((member) => member.rol.toLowerCase().includes('cuidadora'));
  const caregiverName = caregiver?.nombre ?? 'Carolina';
  const contactAlert = useMemo(() => alerts.find((alert) => alert.id === contactAlertId) ?? null, [alerts, contactAlertId]);

  const pushFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2600);
  };

  useEffect(() => {
    if (!contactAlert && !isReportOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactAlertId(null);
        setIsReportOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [contactAlert, isReportOpen]);

  const openContactSheet = (alert: Alert) => {
    setIsReportOpen(false);
    setContactAlertId(alert.id);
    setContactMessage(buildSuggestedMessage(alert, caregiverName));
  };

  const closeContactSheet = () => {
    setContactAlertId(null);
  };

  const openReportSheet = () => {
    setContactAlertId(null);
    setIsReportOpen(true);
  };

  const closeReportSheet = () => {
    setIsReportOpen(false);
  };

  const handleSendMessage = () => {
    if (!contactMessage.trim()) return;

    pushFeedback(`Mensaje enviado a ${caregiverName}`);
    closeContactSheet();
    setContactMessage('');
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Alertas" subtitle="Seguimiento de avisos importantes del cuidado." />
      <SectionTitle title="Centro de atención" />

      <AlertList
        alerts={alerts}
        onRequestConfirmation={() => pushFeedback('Solicitud enviada a Carolina')}
        onContactCaregiver={openContactSheet}
        onViewCalendar={() => navigate('/calendar')}
        onViewReport={openReportSheet}
      />

      {feedback ? (
        <p className="alerts-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      {contactAlert ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeContactSheet}>
          <div
            className="activity-modal-sheet task-modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contactar-cuidadora-alerta"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="contactar-cuidadora-alerta" className="activity-modal-sheet__title">
              {`Contactar a ${caregiverName}`}
            </h4>

            <p className="task-modal-sheet__helper">Enviá un mensaje a la cuidadora responsable de esta alerta.</p>

            <label className="field">
              <span className="field__label">Mensaje</span>
              <textarea
                className="field__textarea"
                rows={4}
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
              />
            </label>

            <div className="task-modal-sheet__actions">
              <Button type="button" fullWidth onClick={handleSendMessage} disabled={!contactMessage.trim()}>
                Enviar mensaje
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={closeContactSheet}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
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
            <h4 id="informe-alerta-titulo" className="activity-modal-sheet__title">{`Informe diario de ${caregiverName}`}</h4>

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

function buildSuggestedMessage(alert: Alert, caregiverName: string) {
  if (alert.tipo === 'falta_confirmacion') {
    return `Hola ${caregiverName}, ¿me podrías confirmar si Juan ya tomó la medicación de la mañana?`;
  }

  return `Hola ${caregiverName}, ¿me podés compartir una actualización sobre “${alert.titulo}”?`;
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateIso}T00:00:00`));
}
