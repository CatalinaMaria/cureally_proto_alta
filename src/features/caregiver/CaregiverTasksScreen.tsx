import { useState } from 'react';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { Card } from '../../components/cards/Card';
import { Badge } from '../../components/feedback/Badge';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import type { Task } from '../../types/domain';

export function CaregiverTasksScreen() {
  const { currentUser } = useAuth();
  const { tasks, completeTask } = useCareStore();
  const [feedback, setFeedback] = useState('');
  const caregiverId = currentUser?.careMemberId ?? '';
  const myTasks = tasks.filter((task) => task.responsableId === caregiverId);

  const handleComplete = (task: Task) => {
    if (!completeTask(task.id, caregiverId)) return;
    setFeedback(`“${task.titulo}” quedó registrada como realizada.`);
    window.setTimeout(() => setFeedback(''), 2800);
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Mis tareas" subtitle="Acciones asignadas para el cuidado de Juan." />

      {feedback ? <p className="caregiver-feedback" role="status">{feedback}</p> : null}

      <div className="stack-sm">
        {myTasks.map((task) => {
          const completed = task.estado === 'confirmada';
          return (
            <Card key={task.id} className={`list-card ${completed ? 'caregiver-task--completed' : ''}`}>
              <div className="list-card__row">
                <p className="list-card__title">{task.titulo}</p>
                <Badge variant={completed ? 'success' : 'warning'}>{completed ? 'Realizada' : 'Pendiente'}</Badge>
              </div>
              <p className="list-card__meta">{task.descripcion}</p>
              <p className="list-card__meta">{formatTiming(task)}</p>
              <Button type="button" fullWidth disabled={completed} onClick={() => handleComplete(task)}>
                {completed ? 'Tarea realizada' : 'Marcar como realizada'}
              </Button>
            </Card>
          );
        })}
        {!myTasks.length ? <EmptyState title="Sin tareas asignadas" description="No tenés acciones pendientes en este turno." /> : null}
      </div>
    </section>
  );
}

function formatTiming(task: Task) {
  if (task.hora) return `Horario: ${task.hora}`;
  if (task.franja === 'manana') return 'Turno: Mañana';
  if (task.franja === 'tarde') return 'Turno: Tarde';
  if (task.franja === 'noche') return 'Turno: Noche';
  return 'Durante el turno';
}
