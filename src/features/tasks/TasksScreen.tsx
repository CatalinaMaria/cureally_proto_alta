import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { TaskList } from '../../components/cards/TaskList';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import type { Task } from '../../types/domain';

export function TasksScreen() {
  const navigate = useNavigate();
  const { tasks, requestTaskConfirmation } = useCareStore();
  const [taskFeedback, setTaskFeedback] = useState('');
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  const detailTask = useMemo(() => tasks.find((task) => task.id === detailTaskId) ?? null, [tasks, detailTaskId]);

  const pushFeedback = (message: string) => {
    setTaskFeedback(message);
    window.setTimeout(() => setTaskFeedback(''), 2600);
  };

  useEffect(() => {
    if (!detailTask) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetailTaskId(null);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [detailTask]);

  const openDetail = (task: Task) => {
    setDetailTaskId(task.id);
  };

  const closeDetail = () => setDetailTaskId(null);

  const handleRequestConfirmation = (task: Task) => {
    requestTaskConfirmation(task.id);
    pushFeedback(`Se solicitó confirmación a ${task.responsable}`);
  };

  return (
    <section className="screen stack-md">
      <ScreenHeader title="Tareas" subtitle="Revisá tareas, responsables y confirmaciones del día." />

      <div>
        <SectionTitle title="Tareas asignadas" />
        <TaskList
          tasks={tasks}
          onRequestConfirmation={handleRequestConfirmation}
          onViewDetail={openDetail}
          onContactCaregiver={(task) =>
            navigate('/messages', {
              state: {
                conversation: task.responsable,
                compose: true,
              },
            })
          }
        />
      </div>

      {taskFeedback ? (
        <p className="tasks-feedback" role="status" aria-live="polite">
          {taskFeedback}
        </p>
      ) : null}

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
