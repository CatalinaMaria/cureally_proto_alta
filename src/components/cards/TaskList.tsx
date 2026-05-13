import type { Task } from '../../types/domain';
import { Badge } from '../feedback/Badge';
import { Button } from '../forms/Button';
import { Card } from './Card';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <div className="stack-sm">
      {tasks.map((task) => (
        <Card key={task.id} className="list-card">
          <div className="list-card__row">
            <p className="list-card__title">{task.titulo}</p>
            <Badge variant={task.estado === 'completada' ? 'success' : 'warning'}>
              {task.estado === 'completada' ? 'Completada' : 'Pendiente'}
            </Badge>
          </div>
          <div className="list-card__row">
            <span className="muted-text">Franja: {formatShift(task.franja)}</span>
            <Button variant="secondary" onClick={() => onToggle(task.id)}>
              {task.estado === 'completada' ? 'Marcar pendiente' : 'Marcar completada'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function formatShift(shift?: Task['franja']) {
  if (shift === 'manana') return 'Mañana';
  if (shift === 'tarde') return 'Tarde';
  if (shift === 'noche') return 'Noche';
  return 'General';
}
