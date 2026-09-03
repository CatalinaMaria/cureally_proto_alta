import type { Task } from '../../types/domain';
import { Badge } from '../feedback/Badge';
import { Button } from '../forms/Button';
import { Card } from './Card';
import { getCareMemberName } from '../../data/mockData';

interface TaskListProps {
  tasks: Task[];
  onRequestConfirmation: (task: Task) => void;
  onViewDetail: (task: Task) => void;
  onContactCaregiver: (task: Task) => void;
}

export function TaskList({ tasks, onRequestConfirmation, onViewDetail, onContactCaregiver }: TaskListProps) {
  return (
    <div className="stack-sm">
      {tasks.map((task) => (
        <Card key={task.id} className="list-card task-card">
          <div className="list-card__row">
            <p className="list-card__title">{task.titulo}</p>
            <Badge variant={getBadgeVariant(task.estado)}>
              {formatTaskStatus(task.estado)}
            </Badge>
          </div>
          <p className="list-card__meta">{formatTaskTiming(task)}</p>
          <p className="list-card__meta">Responsable: {getCareMemberName(task.responsableId)}</p>

          <div className="task-card__actions">
            <Button
              variant="secondary"
              className="task-card__request"
              onClick={() => onRequestConfirmation(task)}
              disabled={task.estado === 'confirmada' || task.estado === 'pendiente'}
            >
              {task.estado === 'confirmada'
                ? 'Confirmada por responsable'
                : task.estado === 'pendiente'
                  ? 'Confirmación solicitada'
                  : 'Solicitar confirmación'}
            </Button>
            <div className="task-card__links">
              <button type="button" className="text-button" onClick={() => onViewDetail(task)}>
                Ver detalle
              </button>
              <button type="button" className="text-button" onClick={() => onContactCaregiver(task)}>
                Contactar cuidador
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function formatTaskTiming(task: Task) {
  if (task.hora) {
    return `Hora: ${task.hora}`;
  }

  if (task.franja === 'manana') return 'Franja: Mañana';
  if (task.franja === 'tarde') return 'Franja: Tarde';
  if (task.franja === 'noche') return 'Franja: Noche';
  return 'Franja: General';
}

function formatTaskStatus(status: Task['estado']) {
  if (status === 'confirmada') return 'Confirmada';
  if (status === 'pendiente') return 'Pendiente';
  return 'Sin confirmar';
}

function getBadgeVariant(status: Task['estado']) {
  if (status === 'confirmada') return 'success';
  if (status === 'pendiente') return 'neutral';
  return 'warning';
}
