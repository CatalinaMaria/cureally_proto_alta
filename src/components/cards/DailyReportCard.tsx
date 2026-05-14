import { Button } from '../forms/Button';
import { Card } from './Card';

interface DailyReportCardProps {
  cuidador: string;
  fecha: string;
  observaciones: string;
  checks: string[];
  onViewReport?: () => void;
}

export function DailyReportCard({ cuidador, fecha, observaciones, checks, onViewReport }: DailyReportCardProps) {
  return (
    <Card className="daily-report-card">
      <h3 className="card-title">{`Informe diario de ${cuidador}`}</h3>
      <p className="muted-text">Fecha: {formatDate(fecha)}</p>
      <p className="daily-report-card__notes">{observaciones}</p>
      <div className="check-list" aria-label="Checklist diario">
        {checks.map((check) => (
          <p key={check} className="check-list__item">
            ✓ {check}
          </p>
        ))}
      </div>
      {onViewReport ? (
        <Button type="button" variant="ghost" className="daily-report-card__action" onClick={onViewReport}>
          Ver informe completo
        </Button>
      ) : null}
    </Card>
  );
}

function formatDate(dateIso: string) {
  const date = new Date(`${dateIso}T00:00:00`);
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(date);
}
