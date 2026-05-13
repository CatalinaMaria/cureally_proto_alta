import { useCareStore } from '../../app/care-store';
import { DailyReportCard } from '../../components/cards/DailyReportCard';
import { TaskList } from '../../components/cards/TaskList';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

export function TasksScreen() {
  const { tasks, toggleTaskStatus, dailyReport, updateDailyReport } = useCareStore();

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Tareas" subtitle="Seguimiento diario del cuidado" />

      <div>
        <SectionTitle title="Tareas asignadas" />
        <TaskList tasks={tasks} onToggle={toggleTaskStatus} />
      </div>

      <DailyReportCard
        fecha={dailyReport.fecha}
        observaciones={dailyReport.observaciones}
        checks={dailyReport.checks}
        onUpdate={updateDailyReport}
      />
    </section>
  );
}
