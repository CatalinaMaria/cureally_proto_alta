import type { Alert } from '../../types/domain';
import { Badge } from '../feedback/Badge';
import { Button } from '../forms/Button';
import { Card } from './Card';

interface AlertListProps {
  alerts: Alert[];
  onConfirm: (alertId: string) => void;
}

export function AlertList({ alerts, onConfirm }: AlertListProps) {
  return (
    <div className="stack-sm">
      {alerts.map((alert) => (
        <Card key={alert.id} className="list-card">
          <div className="list-card__row">
            <p className="list-card__title">{alert.titulo}</p>
            <Badge variant={severityToVariant(alert.severidad)}>{capitalize(alert.severidad)}</Badge>
          </div>
          <div className="list-card__row">
            <span className="muted-text">Horario: {alert.hora}</span>
            <Button variant={alert.confirmada ? 'ghost' : 'secondary'} onClick={() => onConfirm(alert.id)} disabled={alert.confirmada}>
              {alert.confirmada ? 'Confirmada' : 'Confirmar'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function severityToVariant(severity: Alert['severidad']) {
  if (severity === 'alta') return 'danger';
  if (severity === 'media') return 'warning';
  return 'neutral';
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
