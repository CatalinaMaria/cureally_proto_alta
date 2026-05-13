import { useCareStore } from '../../app/care-store';

export function PatientContextStrip() {
  const { patient } = useCareStore();

  return (
    <div className="patient-strip" role="status" aria-label="Contexto del paciente">
      <span className="patient-strip__name">{patient.nombre}</span>
      <span className="patient-strip__meta">{patient.edad} años</span>
      <span className="patient-strip__pill">{patient.diagnostico}</span>
    </div>
  );
}
