import { Card } from './Card';

interface EstadoHoyCardProps {
  pendientes: number;
  completadas: number;
  alertasActivas: number;
  proximaActividad: string;
}

export function EstadoHoyCard({ pendientes, completadas, alertasActivas, proximaActividad }: EstadoHoyCardProps) {
  return (
    <Card>
      <h3 className="card-title">Estado de hoy</h3>
      <div className="status-grid">
        <div className="status-item">
          <span className="status-item__value">{pendientes}</span>
          <span className="status-item__label">Pendientes</span>
        </div>
        <div className="status-item">
          <span className="status-item__value">{completadas}</span>
          <span className="status-item__label">Completadas</span>
        </div>
        <div className="status-item">
          <span className="status-item__value">{alertasActivas}</span>
          <span className="status-item__label">Alertas activas</span>
        </div>
      </div>
      <p className="status-summary">
        Próxima actividad: <strong>{proximaActividad}</strong>
      </p>
    </Card>
  );
}
