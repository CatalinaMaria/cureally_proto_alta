import { useCareStore } from '../../app/care-store';
import { AlertList } from '../../components/cards/AlertList';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

export function AlertsScreen() {
  const { alerts, confirmAlert } = useCareStore();

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Alertas" subtitle="Recordatorios importantes" />
      <SectionTitle title="Lista de alertas" />
      <AlertList alerts={alerts} onConfirm={confirmAlert} />
    </section>
  );
}
