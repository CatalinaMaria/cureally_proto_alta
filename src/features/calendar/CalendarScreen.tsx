import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useCareStore } from '../../app/care-store';
import { ActivityList } from '../../components/cards/ActivityList';
import { CalendarMonthGrid } from '../../components/cards/CalendarMonthGrid';
import { Card } from '../../components/cards/Card';
import { Button } from '../../components/forms/Button';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import type { Activity, ActivityCategory, ActivityDuration, ActivityRecurrence } from '../../types/domain';

interface AddActivityForm {
  tipo: ActivityCategory;
  nombre: string;
  hora: string;
  minuto: string;
  periodo: 'am' | 'pm';
  responsable: string;
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
  responsable: 'Carolina',
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

const RESPONSIBLE_OPTIONS = ['Carolina', 'Pedro', 'María'];

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

export function CalendarScreen() {
  const { selectedDate, setSelectedDate, activities, patient, addActivity } = useCareStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [form, setForm] = useState<AddActivityForm>(DEFAULT_FORM);
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStartFromIso(selectedDate));

  const currentYear = visibleMonth.getFullYear();
  const currentMonth = visibleMonth.getMonth();
  const monthLabel = `${MONTH_NAMES[currentMonth]}, ${currentYear}`;

  const dayActivities = useMemo(
    () =>
      activities
        .filter((activity) => occursOnDate(activity, selectedDate))
        .map((activity) =>
          activity.fecha === selectedDate
            ? activity
            : {
                ...activity,
                id: `${activity.id}-${selectedDate}`,
              },
        )
        .sort((a, b) => a.hora.localeCompare(b.hora)),
    [activities, selectedDate],
  );

  useEffect(() => {
    if (!feedback) return;
    const timerId = window.setTimeout(() => setFeedback(''), 2800);
    return () => window.clearTimeout(timerId);
  }, [feedback]);

  useEffect(() => {
    if (!isAddOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAddOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isAddOpen]);

  const openAddModal = () => {
    setForm(DEFAULT_FORM);
    setIsAddOpen(true);
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
  };

  const handleMonthNavigation = (offset: -1 | 1) => {
    const nextMonth = new Date(currentYear, currentMonth + offset, 1);
    setVisibleMonth(nextMonth);

    const selectedDay = Number(selectedDate.slice(-2));
    const lastDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    const nextSelectedDate = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      Math.min(selectedDay || 1, lastDayOfNextMonth),
    );

    setSelectedDate(toDateIso(nextSelectedDate));
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const recurrente = form.repeticion === 'todos_los_dias' || form.repeticion === 'semanal';

    addActivity({
      fecha: selectedDate,
      hora: to24Hour(form.hora, form.minuto, form.periodo),
      titulo: form.nombre.trim(),
      categoria: form.tipo,
      responsable: form.responsable.trim() || 'Carolina',
      nota: form.nota.trim() || undefined,
      repeticion: form.repeticion,
      duracion: recurrente ? form.duracion : undefined,
      fechaFinalizacion:
        recurrente && form.duracion === 'hasta_fecha' && form.fechaFinalizacion ? form.fechaFinalizacion : undefined,
    });

    closeAddModal();
    setFeedback('Actividad agregada al calendario');
  };

  const showDurationFields = form.repeticion === 'todos_los_dias' || form.repeticion === 'semanal';
  const requireEndDate = showDurationFields && form.duracion === 'hasta_fecha';

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Calendario" subtitle={patient.nombre} showBack />

      <Card>
        <div className="calendar-month-nav">
          <button
            type="button"
            className="calendar-month-nav__button"
            onClick={() => handleMonthNavigation(-1)}
            aria-label="Ver mes anterior"
          >
            <span aria-hidden="true">←</span>
          </button>
          <h2 className="calendar-month-nav__title">{monthLabel}</h2>
          <button
            type="button"
            className="calendar-month-nav__button"
            onClick={() => handleMonthNavigation(1)}
            aria-label="Ver mes siguiente"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <CalendarMonthGrid
          year={currentYear}
          month={currentMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          hasActivities={(dateIso) => activities.some((activity) => occursOnDate(activity, dateIso))}
        />
      </Card>

      <Card>
        <SectionTitle title={`Actividad del ${formatDate(selectedDate)}`} />
        <ActivityList activities={dayActivities} emptyMessage="No hay actividades para este día." />
      </Card>

      {feedback ? (
        <p className="calendar-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <Button variant="secondary" fullWidth onClick={openAddModal}>
        + Agregar actividad o medicación
      </Button>

      {isAddOpen ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeAddModal}>
          <div
            className="activity-modal-sheet calendar-add-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="agregar-actividad-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="agregar-actividad-titulo" className="activity-modal-sheet__title">
              Agregar actividad
            </h4>

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
                  value={form.responsable}
                  onChange={(event) => setForm((prev) => ({ ...prev, responsable: event.target.value }))}
                >
                  {RESPONSIBLE_OPTIONS.map((person) => (
                    <option key={person} value={person}>
                      {person}
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
                        event.target.value === 'todos_los_dias' || event.target.value === 'semanal'
                          ? prev.fechaFinalizacion
                          : '',
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
                <Button type="button" variant="secondary" fullWidth onClick={closeAddModal}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function occursOnDate(activity: Activity, targetDate: string) {
  if (activity.fecha === targetDate) {
    return true;
  }

  if (activity.repeticion === 'todos_los_dias') {
    return isWithinRecurrenceRange(activity, targetDate);
  }

  if (activity.repeticion === 'semanal') {
    return isWithinRecurrenceRange(activity, targetDate) && getWeekdayFromIso(activity.fecha) === getWeekdayFromIso(targetDate);
  }

  return false;
}

function isWithinRecurrenceRange(activity: Activity, targetDate: string) {
  if (targetDate < activity.fecha) {
    return false;
  }

  if (activity.duracion === 'hasta_fecha' && activity.fechaFinalizacion) {
    return targetDate <= activity.fechaFinalizacion;
  }

  return true;
}

function getWeekdayFromIso(dateIso: string) {
  const [year, month, day] = dateIso.split('-').map(Number);
  return new Date(year, month - 1, day).getDay();
}

function getMonthStartFromIso(dateIso: string) {
  const [year, month] = dateIso.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function toDateIso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateIso}T00:00:00`));
}

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

function to24Hour(hour12: string, minute: string, period: AddActivityForm['periodo']) {
  let hour = Number(hour12);
  if (period === 'am') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, '0')}:${minute}`;
}
