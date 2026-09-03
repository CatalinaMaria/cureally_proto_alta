import type { Patient } from '../../types/domain';
import { Card } from './Card';

export function PatientInfoCard({ patient }: { patient: Patient }) {
  return (
    <Card>
      <h3 className="card-title">Información de la persona cuidada</h3>
      <dl className="info-list">
        <div>
          <dt>Nombre</dt>
          <dd>{patient.nombre}</dd>
        </div>
        <div>
          <dt>Edad</dt>
          <dd>{patient.edad} años</dd>
        </div>
        <div>
          <dt>Diagnóstico</dt>
          <dd>{patient.diagnostico}</dd>
        </div>
        <div>
          <dt>Alergias</dt>
          <dd>{patient.alergias}</dd>
        </div>
      </dl>
    </Card>
  );
}
