import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { Card } from '../../components/cards/Card';
import { Badge } from '../../components/feedback/Badge';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { DEMO_TODAY } from '../../data/mockData';
import type { TaskShift } from '../../types/domain';

type LogMode = 'medication' | 'update' | 'report';

export function CaregiverLogScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { activities, recordMedication, addCareUpdate, submitDailyReport } = useCareStore();
  const caregiverId = currentUser?.careMemberId ?? '';
  const requestedMode = searchParams.get('mode');
  const mode: LogMode = requestedMode === 'update' || requestedMode === 'report' ? requestedMode : 'medication';
  const [feedback, setFeedback] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [reportText, setReportText] = useState('');
  const [shift, setShift] = useState<TaskShift>('manana');
  const [checks, setChecks] = useState<string[]>([]);
  const medications = activities.filter(
    (activity) =>
      activity.fecha === DEMO_TODAY &&
      activity.categoria === 'medicacion' &&
      activity.responsableId === caregiverId,
  );

  const publishFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 3000);
  };

  const handleMedication = (activityId: string) => {
    if (recordMedication(activityId, caregiverId)) {
      publishFeedback('Medicación registrada. Carina ya puede ver la confirmación.');
    }
  };

  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    if (!updateText.trim()) return;
    addCareUpdate(caregiverId, updateText);
    setUpdateText('');
    publishFeedback('Novedad compartida con la red de cuidado.');
  };

  const handleReport = (event: FormEvent) => {
    event.preventDefault();
    if (!reportText.trim()) return;
    submitDailyReport(caregiverId, shift, reportText, checks);
    setReportText('');
    setChecks([]);
    publishFeedback('Informe diario enviado. Carina ya puede consultarlo.');
  };

  const toggleCheck = (value: string) => {
    setChecks((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Registrar cuidado" subtitle="Dejá constancia de lo realizado durante tu turno." showBack backTo="/caregiver/home" />

      <div className="caregiver-log-tabs" aria-label="Tipo de registro">
        <button type="button" className={mode === 'medication' ? 'is-active' : ''} onClick={() => setSearchParams({ mode: 'medication' })}>Medicación</button>
        <button type="button" className={mode === 'update' ? 'is-active' : ''} onClick={() => setSearchParams({ mode: 'update' })}>Novedad</button>
        <button type="button" className={mode === 'report' ? 'is-active' : ''} onClick={() => setSearchParams({ mode: 'report' })}>Informe</button>
      </div>

      {feedback ? <p className="caregiver-feedback" role="status">{feedback}</p> : null}

      {mode === 'medication' ? (
        <div className="stack-sm">
          {medications.map((activity) => {
            const completed = activity.estado === 'completada';
            return (
              <Card key={activity.id} className="list-card">
                <div className="list-card__row">
                  <div><p className="list-card__title">{activity.titulo}</p><p className="list-card__meta">Horario: {activity.hora}</p></div>
                  <Badge variant={completed ? 'success' : 'warning'}>{completed ? 'Administrada' : 'Pendiente'}</Badge>
                </div>
                <Button type="button" fullWidth disabled={completed} onClick={() => handleMedication(activity.id)}>
                  {completed ? 'Administración registrada' : 'Registrar como administrada'}
                </Button>
              </Card>
            );
          })}
          {!medications.length ? <p className="muted-text">No tenés medicaciones asignadas para hoy.</p> : null}
        </div>
      ) : null}

      {mode === 'update' ? (
        <Card>
          <form className="caregiver-form" onSubmit={handleUpdate}>
            <label className="field">
              <span className="field__label">Observación o novedad</span>
              <textarea className="field__textarea" rows={5} value={updateText} onChange={(event) => setUpdateText(event.target.value)} placeholder="Ej: Juan estuvo de buen ánimo y almorzó con normalidad." required />
            </label>
            <Button type="submit" fullWidth>Compartir novedad</Button>
          </form>
        </Card>
      ) : null}

      {mode === 'report' ? (
        <Card>
          <form className="caregiver-form" onSubmit={handleReport}>
            <label className="field">
              <span className="field__label">Turno</span>
              <select className="field__input" value={shift} onChange={(event) => setShift(event.target.value as TaskShift)}>
                <option value="manana">Mañana</option><option value="tarde">Tarde</option><option value="noche">Noche</option>
              </select>
            </label>
            <fieldset className="caregiver-checks">
              <legend>Acciones registradas</legend>
              {['Medicación verificada', 'Hidratación verificada', 'Alimentación registrada'].map((item) => (
                <label key={item}><input type="checkbox" checked={checks.includes(item)} onChange={() => toggleCheck(item)} /> {item}</label>
              ))}
            </fieldset>
            <label className="field">
              <span className="field__label">Resumen del turno</span>
              <textarea className="field__textarea" rows={5} value={reportText} onChange={(event) => setReportText(event.target.value)} placeholder="Contá brevemente cómo estuvo Juan durante el turno." required />
            </label>
            <Button type="submit" fullWidth>Enviar informe diario</Button>
          </form>
        </Card>
      ) : null}
    </section>
  );
}
