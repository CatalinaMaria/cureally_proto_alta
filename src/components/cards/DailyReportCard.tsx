import { Card } from './Card';

interface DailyReportCardProps {
  fecha: string;
  observaciones: string;
  checks: string[];
  onUpdate: (notes: string) => void;
}

export function DailyReportCard({ fecha, observaciones, checks, onUpdate }: DailyReportCardProps) {
  return (
    <Card>
      <h3 className="card-title">Informe diario del cuidador</h3>
      <p className="muted-text">Fecha: {formatDate(fecha)}</p>
      <label className="field">
        <span className="field__label">Observaciones</span>
        <textarea
          className="field__textarea"
          value={observaciones}
          onChange={(event) => onUpdate(event.target.value)}
          placeholder="Escribí las observaciones del día"
          rows={4}
        />
      </label>
      <div className="check-list" aria-label="Checklist diario">
        {checks.map((check) => (
          <p key={check} className="check-list__item">
            ✓ {check}
          </p>
        ))}
      </div>
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
