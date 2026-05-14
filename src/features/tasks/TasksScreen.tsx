import { useEffect, useMemo, useState } from 'react';
import { useCareStore } from '../../app/care-store';
import { DailyReportCard } from '../../components/cards/DailyReportCard';
import { TaskList } from '../../components/cards/TaskList';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { careNetwork } from '../../data/mockData';
import type { Task } from '../../types/domain';

export function TasksScreen() {
  const { tasks, dailyReport, requestTaskConfirmation } = useCareStore();
  const [taskFeedback, setTaskFeedback] = useState('');
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [contactTaskId, setContactTaskId] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const caregiver = careNetwork.find((member) => member.rol.toLowerCase().includes('cuidadora'));
  const detailTask = useMemo(() => tasks.find((task) => task.id === detailTaskId) ?? null, [tasks, detailTaskId]);
  const contactTask = useMemo(() => tasks.find((task) => task.id === contactTaskId) ?? null, [tasks, contactTaskId]);

  const pushFeedback = (message: string) => {
    setTaskFeedback(message);
    window.setTimeout(() => setTaskFeedback(''), 2600);
  };

  useEffect(() => {
    if (!detailTask && !contactTask) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetailTaskId(null);
        setContactTaskId(null);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [detailTask, contactTask]);

  const openDetail = (task: Task) => {
    setContactTaskId(null);
    setDetailTaskId(task.id);
  };

  const openContact = (task: Task) => {
    setDetailTaskId(null);
    setContactTaskId(task.id);
    setContactMessage(buildSuggestedMessage(task));
  };

  const closeDetail = () => setDetailTaskId(null);
  const closeContact = () => setContactTaskId(null);

  const handleRequestConfirmation = (task: Task) => {
    requestTaskConfirmation(task.id);
    pushFeedback(`Se solicitó confirmación a ${task.responsable}`);
  };

  const handleSendMessage = () => {
    if (!contactTask || !contactMessage.trim()) return;

    pushFeedback(`Mensaje enviado a ${contactTask.responsable}`);
    setContactTaskId(null);
    setContactMessage('');
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Tareas" subtitle="Revisá tareas, responsables y confirmaciones del día." />

      <div>
        <SectionTitle title="Tareas asignadas" />
        <TaskList
          tasks={tasks}
          onRequestConfirmation={handleRequestConfirmation}
          onViewDetail={openDetail}
          onContactCaregiver={openContact}
        />
      </div>

      {taskFeedback ? (
        <p className="tasks-feedback" role="status" aria-live="polite">
          {taskFeedback}
        </p>
      ) : null}

      <DailyReportCard
        cuidador={caregiver?.nombre ?? 'Carolina'}
        fecha={dailyReport.fecha}
        observaciones={dailyReport.observaciones}
        checks={dailyReport.checks}
        onViewReport={() => pushFeedback('Abriendo informe completo')}
      />

      {detailTask ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeDetail}>
          <div
            className="activity-modal-sheet task-modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-tarea-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="detalle-tarea-titulo" className="activity-modal-sheet__title">
              {detailTask.titulo}
            </h4>

            <div className="task-modal-sheet__status">
              <Badge variant={getStatusBadgeVariant(detailTask.estado)}>{formatTaskStatus(detailTask.estado)}</Badge>
            </div>

            <dl className="activity-modal-sheet__details">
              <div>
                <dt>Franja</dt>
                <dd>{formatTaskTimingValue(detailTask)}</dd>
              </div>
              <div>
                <dt>Responsable</dt>
                <dd>{detailTask.responsable}</dd>
              </div>
            </dl>

            <p className="task-modal-sheet__label">Descripción</p>
            <p className="task-modal-sheet__text">
              {detailTask.descripcion ?? 'Seguimiento de la tarea asignada en el plan de cuidado.'}
            </p>

            <p className="task-modal-sheet__label">Última actualización</p>
            <p className="task-modal-sheet__text">
              {detailTask.ultimaActualizacion ?? getStatusUpdateText(detailTask)}
            </p>

            <div className="task-modal-sheet__actions">
              <Button
                type="button"
                fullWidth
                onClick={() => handleRequestConfirmation(detailTask)}
                disabled={detailTask.estado === 'confirmada' || detailTask.estado === 'pendiente'}
              >
                {detailTask.estado === 'confirmada'
                  ? 'Confirmada por cuidadora'
                  : detailTask.estado === 'pendiente'
                    ? 'Confirmación solicitada'
                    : 'Solicitar confirmación'}
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={closeDetail}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {contactTask ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeContact}>
          <div
            className="activity-modal-sheet task-modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contactar-cuidador-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="contactar-cuidador-titulo" className="activity-modal-sheet__title">
              {`Contactar a ${contactTask.responsable}`}
            </h4>

            <p className="task-modal-sheet__helper">
              Enviá un mensaje a la cuidadora responsable de esta tarea.
            </p>

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
              <Button type="button" variant="secondary" fullWidth onClick={closeContact}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatTaskStatus(status: Task['estado']) {
  if (status === 'confirmada') return 'Confirmada';
  if (status === 'pendiente') return 'Pendiente';
  return 'Sin confirmar';
}

function formatTaskTimingValue(task: Task) {
  if (task.hora) return task.hora;
  if (task.franja === 'manana') return 'Mañana';
  if (task.franja === 'tarde') return 'Tarde';
  if (task.franja === 'noche') return 'Noche';
  return 'General';
}

function getStatusBadgeVariant(status: Task['estado']) {
  if (status === 'confirmada') return 'success';
  if (status === 'pendiente') return 'neutral';
  return 'warning';
}

function getStatusUpdateText(task: Task) {
  if (task.estado === 'confirmada') return 'Confirmada por la cuidadora.';
  if (task.estado === 'pendiente') return 'Solicitud de confirmación enviada a la cuidadora.';
  return 'Aún no confirmada por la cuidadora.';
}

function buildSuggestedMessage(task: Task) {
  if (task.titulo.toLowerCase().includes('medicación de la mañana')) {
    return `Hola ${task.responsable}, ¿me podrías confirmar si Juan ya tomó la medicación de la mañana?`;
  }

  return `Hola ${task.responsable}, ¿me podrías confirmar el estado de la tarea “${task.titulo}”?`;
}
