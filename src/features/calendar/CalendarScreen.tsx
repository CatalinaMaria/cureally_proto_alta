import { useMemo } from 'react';
import { useCareStore } from '../../app/care-store';
import { ActivityList } from '../../components/cards/ActivityList';
import { CalendarMonthGrid } from '../../components/cards/CalendarMonthGrid';
import { Card } from '../../components/cards/Card';
import { Button } from '../../components/forms/Button';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

const CALENDAR_YEAR = 2026;
const CALENDAR_MONTH = 4;

export function CalendarScreen() {
  const { selectedDate, setSelectedDate, activities, patient } = useCareStore();

  const dayActivities = useMemo(
    () => activities.filter((activity) => activity.fecha === selectedDate).sort((a, b) => a.hora.localeCompare(b.hora)),
    [activities, selectedDate],
  );

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Calendario" subtitle={patient.nombre} showBack />

      <Card>
        <SectionTitle title="Mayo, 2026" />
        <CalendarMonthGrid
          year={CALENDAR_YEAR}
          month={CALENDAR_MONTH}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          hasActivities={(dateIso) => activities.some((activity) => activity.fecha === dateIso)}
        />
      </Card>

      <Card>
        <SectionTitle title={`Actividad del ${formatDate(selectedDate)}`} />
        <ActivityList activities={dayActivities} emptyMessage="No hay actividades para este día." />
      </Card>

      <Button variant="secondary" fullWidth>
        + Agregar actividad o medicación
      </Button>
    </section>
  );
}

function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateIso}T00:00:00`));
}
