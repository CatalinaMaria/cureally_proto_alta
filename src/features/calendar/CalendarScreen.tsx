import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { ActivityList } from '../../components/cards/ActivityList';
import { CalendarMonthGrid } from '../../components/cards/CalendarMonthGrid';
import { Card } from '../../components/cards/Card';
import { Button } from '../../components/forms/Button';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import type { Activity } from '../../types/domain';

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

interface CalendarRouteState {
  calendarFeedback?: string;
}

export function CalendarScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { selectedDate, setSelectedDate, activities, patient } = useCareStore();
  const routeState = (location.state as CalendarRouteState | null) ?? null;
  const [feedback, setFeedback] = useState(() => routeState?.calendarFeedback ?? '');
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
    if (!routeState?.calendarFeedback) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, navigate, routeState?.calendarFeedback]);

  useEffect(() => {
    if (!feedback) return;
    const timerId = window.setTimeout(() => setFeedback(''), 2800);
    return () => window.clearTimeout(timerId);
  }, [feedback]);

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

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Calendario" subtitle={patient.nombre} showBack backTo="/home" />

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

      {currentUser?.isCoordinator ? (
        <Button variant="secondary" fullWidth onClick={() => navigate('/calendar/add')}>
          + Agregar actividad o medicación
        </Button>
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
