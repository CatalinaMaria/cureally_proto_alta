import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { caregiverName } from '../../data/mockData';
import { ActivityList } from '../../components/cards/ActivityList';
import { Card } from '../../components/cards/Card';
import { EstadoHoyCard } from '../../components/cards/EstadoHoyCard';
import { ProximaActividadCard } from '../../components/cards/ProximaActividadCard';
import { QuickAccessGrid } from '../../components/cards/QuickAccessGrid';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

export function HomeScreen() {
  const navigate = useNavigate();
  const { patient, tasks, alerts, activities } = useCareStore();

  const today = '2026-05-13';
  const todayActivities = useMemo(
    () => activities.filter((activity) => activity.fecha === today).sort((a, b) => a.hora.localeCompare(b.hora)),
    [activities],
  );

  const pendingTasks = tasks.filter((task) => task.estado === 'pendiente').length;
  const completedTasks = tasks.filter((task) => task.estado === 'completada').length;
  const activeAlerts = alerts.filter((alert) => !alert.confirmada).length;

  const quickLinks = [
    {
      id: 'quick-calendar',
      titulo: 'Calendario',
      descripcion: 'Ver agenda mensual',
      onSelect: () => navigate('/calendar'),
    },
    {
      id: 'quick-tasks',
      titulo: 'Tareas',
      descripcion: 'Gestionar pendientes',
      onSelect: () => navigate('/tasks'),
    },
    {
      id: 'quick-alerts',
      titulo: 'Alertas',
      descripcion: 'Confirmar recordatorios',
      onSelect: () => navigate('/alerts'),
    },
    {
      id: 'quick-profile',
      titulo: 'Perfil',
      descripcion: 'Datos y red de cuidado',
      onSelect: () => navigate('/profile'),
    },
  ];

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Inicio" subtitle={`Hola, ${caregiverName}`} actionLabel="Calendario" onAction={() => navigate('/calendar')} />

      <Card>
        <h3 className="card-title">Familiar a cargo</h3>
        <p className="list-card__title">{patient.nombre}</p>
        <p className="muted-text">{patient.edad} años · Diagnóstico: {patient.diagnostico}</p>
      </Card>

      <EstadoHoyCard
        pendientes={pendingTasks}
        completadas={completedTasks}
        alertasActivas={activeAlerts}
        proximaActividad={todayActivities[0]?.titulo ?? 'Sin actividades'}
      />

      <ProximaActividadCard activity={todayActivities[0] ?? null} />

      <SectionTitle title="Accesos rápidos" />
      <QuickAccessGrid items={quickLinks} />

      <SectionTitle title="Próximas actividades" />
      <ActivityList activities={todayActivities} emptyMessage="No hay actividades para hoy." />
    </section>
  );
}
