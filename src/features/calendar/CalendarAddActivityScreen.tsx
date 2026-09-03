import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { Button } from '../../components/forms/Button';
import { Card } from '../../components/cards/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import type { ActivityCategory, ActivityDuration, ActivityRecurrence } from '../../types/domain';
import { careNetwork, MARIA_MEMBER_ID } from '../../data/mockData';

interface AddActivityForm {
  tipo: ActivityCategory;
  nombre: string;
  hora: string;
  minuto: string;
  periodo: 'am' | 'pm';
  responsableId: string;
  repeticion: ActivityRecurrence;
  duracion: ActivityDuration;
  fechaFinalizacion: string;
  nota: string;
}

const DEFAULT_FORM: AddActivityForm = {
  tipo: 'medicacion',
  nombre: '',
  hora: '04',
  minuto: '00',
  periodo: 'pm',
  responsableId: MARIA_MEMBER_ID,
  repeticion: 'una_vez',
  duracion: 'indefinida',
  fechaFinalizacion: '',
  nota: '',
};

const NAME_PLACEHOLDERS: Record<ActivityCategory, string> = {
  medicacion: 'Ej: Memantina 20 mg',
  consulta: 'Ej: Consulta médica',
  tarea: 'Ej: Preparar almuerzo',
};

const RESPONSIBLE_OPTIONS = careNetwork;
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

export function CalendarAddActivityScreen() {
  const navigate = useNavigate();
  const { selectedDate, addActivity } = useCareStore();
  const [form, setForm] = useState<AddActivityForm>(DEFAULT_FORM);

  const showDurationFields = form.repeticion === 'todos_los_dias' || form.repeticion === 'semanal';
  const requireEndDate = showDurationFields && form.duracion === 'hasta_fecha';

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const recurrente = form.repeticion === 'todos_los_dias' || form.repeticion === 'semanal';

    addActivity({
      fecha: selectedDate,
      hora: to24Hour(form.hora, form.minuto, form.periodo),
      titulo: form.nombre.trim(),
      categoria: form.tipo,
      responsableId: form.responsableId,
      nota: form.nota.trim() || undefined,
      repeticion: form.repeticion,
      duracion: recurrente ? form.duracion : undefined,
      fechaFinalizacion:
        recurrente && form.duracion === 'hasta_fecha' && form.fechaFinalizacion ? form.fechaFinalizacion : undefined,
    });

    navigate('/calendar', {
      state: {
        calendarFeedback: 'Actividad agregada al calendario',
      },
    });
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Agregar actividad" subtitle={`Fecha seleccionada: ${formatDate(selectedDate)}`} showBack backTo="/calendar" />

      <Card>
        <form className="calendar-add-form" onSubmit={handleSave}>
          <label className="field">
            <span className="field__label">Tipo de actividad</span>
            <select
              className="field__input"
              value={form.tipo}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  tipo: event.target.value as ActivityCategory,
                }))
              }
            >
              <option value="medicacion">Medicación</option>
              <option value="consulta">Consulta</option>
              <option value="tarea">Tarea</option>
            </select>
          </label>

          <label className="field">
            <span className="field__label">Nombre de la actividad</span>
            <input
              className="field__input"
              type="text"
              placeholder={NAME_PLACEHOLDERS[form.tipo]}
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Hora</span>
            <div className="calendar-time-picker" role="group" aria-label="Selector de hora">
              <select
                className="calendar-time-picker__select"
                value={form.hora}
                onChange={(event) => setForm((prev) => ({ ...prev, hora: event.target.value }))}
              >
                {HOUR_OPTIONS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span className="calendar-time-picker__separator" aria-hidden="true">
                :
              </span>
              <select
                className="calendar-time-picker__select"
                value={form.minuto}
                onChange={(event) => setForm((prev) => ({ ...prev, minuto: event.target.value }))}
              >
                {MINUTE_OPTIONS.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <select
                className="calendar-time-picker__select calendar-time-picker__select--period"
                value={form.periodo}
                onChange={(event) => setForm((prev) => ({ ...prev, periodo: event.target.value as AddActivityForm['periodo'] }))}
              >
                <option value="am">a.m.</option>
                <option value="pm">p.m.</option>
              </select>
            </div>
          </label>

          <label className="field">
            <span className="field__label">Responsable</span>
            <select
              className="field__input"
              value={form.responsableId}
              onChange={(event) => setForm((prev) => ({ ...prev, responsableId: event.target.value }))}
            >
              {RESPONSIBLE_OPTIONS.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.nombre} · {person.rol}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Repetición</span>
            <select
              className="field__input"
              value={form.repeticion}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  repeticion: event.target.value as ActivityRecurrence,
                  duracion: event.target.value === 'todos_los_dias' || event.target.value === 'semanal' ? prev.duracion : 'indefinida',
                  fechaFinalizacion:
                    event.target.value === 'todos_los_dias' || event.target.value === 'semanal' ? prev.fechaFinalizacion : '',
                }))
              }
            >
              <option value="una_vez">Una vez</option>
              <option value="todos_los_dias">Todos los días</option>
              <option value="semanal">Semanal</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </label>

          {showDurationFields ? (
            <>
              <label className="field">
                <span className="field__label">Duración</span>
                <select
                  className="field__input"
                  value={form.duracion}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      duracion: event.target.value as ActivityDuration,
                      fechaFinalizacion: event.target.value === 'hasta_fecha' ? prev.fechaFinalizacion : '',
                    }))
                  }
                >
                  <option value="indefinida">Por tiempo indefinido</option>
                  <option value="hasta_fecha">Hasta una fecha</option>
                </select>
              </label>

              {form.duracion === 'hasta_fecha' ? (
                <label className="field">
                  <span className="field__label">Fecha de finalización</span>
                  <input
                    className="field__input"
                    type="date"
                    min={selectedDate}
                    value={form.fechaFinalizacion}
                    onChange={(event) => setForm((prev) => ({ ...prev, fechaFinalizacion: event.target.value }))}
                    required={requireEndDate}
                  />
                </label>
              ) : null}
            </>
          ) : null}

          <label className="field">
            <span className="field__label">Nota opcional</span>
            <textarea
              className="field__textarea"
              rows={3}
              placeholder="Ejemplo: Administrar después del desayuno"
              value={form.nota}
              onChange={(event) => setForm((prev) => ({ ...prev, nota: event.target.value }))}
            />
          </label>

          <div className="calendar-add-actions">
            <Button type="submit" fullWidth>
              Guardar actividad
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => navigate('/calendar')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateIso}T00:00:00`));
}

function to24Hour(hour12: string, minute: string, period: AddActivityForm['periodo']) {
  let hour = Number(hour12);
  if (period === 'am') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, '0')}:${minute}`;
}
