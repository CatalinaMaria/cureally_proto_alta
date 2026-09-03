import { useCareStore } from '../../app/care-store';

export function PatientContextStrip() {
  const { patient } = useCareStore();

  return (
    <div className="patient-strip" role="status" aria-label="Contexto de la persona cuidada">
      <span className="patient-strip__name">{patient.nombre}</span>
      <span className="patient-strip__meta">{patient.edad} años</span>
      <span className="patient-strip__brand">CureAlly</span>
    </div>
  );
}
