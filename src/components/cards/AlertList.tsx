import type { Alert } from '../../types/domain';
import { Badge } from '../feedback/Badge';
import { Button } from '../forms/Button';
import { Card } from './Card';
import { sortAlertsByPriority } from '../../features/alerts/alertSorting';

interface AlertListProps {
  alerts: Alert[];
  canRequestConfirmation?: boolean;
  onRequestConfirmation: (alert: Alert) => void;
  onContactCaregiver: (alert: Alert) => void;
  onViewCalendar: (alert: Alert) => void;
  onViewReport: (alert: Alert) => void;
  onViewStock: (alert: Alert) => void;
}

export function AlertList({
  alerts,
  canRequestConfirmation = true,
  onRequestConfirmation,
  onContactCaregiver,
  onViewCalendar,
  onViewReport,
  onViewStock,
}: AlertListProps) {
  return (
    <div className="stack-sm">
      {sortAlertsByPriority(alerts).map((alert) => (
        <Card key={alert.id} className={`list-card alert-card ${severityCardClass(alert.severidad)}`}>
          <div className="list-card__row">
            <div className="alert-card__title-wrap">
              {alert.severidad === 'alta' ? (
                <span className="alert-card__urgency-icon" aria-hidden="true">
                  !
                </span>
              ) : null}
              <p className="list-card__title">{alert.titulo}</p>
            </div>
            <Badge variant={severityToVariant(alert.severidad)}>{capitalize(alert.severidad)}</Badge>
          </div>
          <p className="alert-card__description">{alert.descripcion}</p>
          <p className="list-card__meta">Horario de referencia: {alert.hora}</p>
          <div className="alert-card__actions">
            {alert.tipo === 'falta_confirmacion' ? (
              <>
                {canRequestConfirmation ? (
                  <Button type="button" variant="secondary" onClick={() => onRequestConfirmation(alert)}>
                    Solicitar confirmación
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" onClick={() => onContactCaregiver(alert)}>
                  Contactar responsable
                </Button>
              </>
            ) : null}

            {alert.tipo === 'turno_proximo' ? (
              <Button type="button" variant="secondary" onClick={() => onViewCalendar(alert)}>
                Ver calendario
              </Button>
            ) : null}

            {alert.tipo === 'informe_nuevo' ? (
              <Button type="button" variant="secondary" onClick={() => onViewReport(alert)}>
                Ver informe
              </Button>
            ) : null}

            {alert.tipo === 'stock_bajo' ? (
              <Button type="button" variant="secondary" onClick={() => onViewStock(alert)}>
                Ver stock
              </Button>
            ) : null}
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

function severityCardClass(severity: Alert['severidad']) {
  if (severity === 'alta') return 'alert-card--alta';
  if (severity === 'media') return 'alert-card--media';
  return 'alert-card--baja';
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
