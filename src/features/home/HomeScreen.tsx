import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { careNetwork, caregiverName } from '../../data/mockData';
import { ActivityList } from '../../components/cards/ActivityList';
import { Card } from '../../components/cards/Card';
import { EstadoHoyCard } from '../../components/cards/EstadoHoyCard';
import { ProximaActividadCard } from '../../components/cards/ProximaActividadCard';
import { QuickAccessGrid, type QuickAccessItem } from '../../components/cards/QuickAccessGrid';
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

  const pendingTasks = tasks.filter((task) => task.estado === 'sin_confirmar' || task.estado === 'pendiente').length;
  const completedTasks = tasks.filter((task) => task.estado === 'confirmada').length;
  const activeAlerts = alerts.filter((alert) => !alert.confirmada).length;
  const nextActivity = todayActivities[0] ?? null;
  const careCoordinator = careNetwork.find((member) => member.rol.toLowerCase().includes('cuidadora'));

  const quickLinks: QuickAccessItem[] = [
    {
      id: 'quick-calendar',
      titulo: 'Calendario',
      descripcion: 'Ver agenda mensual',
      icon: 'calendar',
      onSelect: () => navigate('/calendar'),
    },
    {
      id: 'quick-tasks',
      titulo: 'Tareas',
      descripcion: 'Gestionar pendientes',
      icon: 'tasks',
      onSelect: () => navigate('/tasks'),
    },
    {
      id: 'quick-alerts',
      titulo: 'Alertas',
      descripcion: 'Revisar avisos importantes',
      icon: 'alerts',
      onSelect: () => navigate('/alerts'),
    },
    {
      id: 'quick-profile',
      titulo: 'Perfil',
      descripcion: 'Datos y red de cuidado',
      icon: 'profile',
      onSelect: () => navigate('/profile'),
    },
  ];

  return (
    <section className="screen home-screen">
      <ScreenHeader title="Inicio" subtitle={`Hola, ${caregiverName}`} />

      <Card className="home-patient-card">
        <div className="home-patient-card__head">
          <div className="home-patient-card__avatar" aria-hidden="true">
            {patient.nombre
              .split(' ')
              .map((name) => name[0])
              .join('')
              .slice(0, 2)}
          </div>
          <button type="button" className="text-button home-patient-card__profile-action" onClick={() => navigate('/profile')}>
            Ver perfil →
          </button>
        </div>
        <div className="home-patient-card__content">
          <p className="home-patient-card__label">Estado de cuidado de Juan</p>
          <p className="home-patient-card__name">{patient.nombre}</p>
          <div className="home-patient-card__meta">
            <span>{patient.edad} años</span>
            <span className="home-patient-card__chip">{patient.diagnostico}</span>
          </div>
          <p className="home-patient-card__detail">
            <span className="home-patient-card__detail-label">Próxima actividad:</span>{' '}
            {nextActivity ? `${nextActivity.titulo} — ${formatHour(nextActivity.hora)}` : 'Sin actividades programadas'}
          </p>
          <p className="home-patient-card__detail">
            <span className="home-patient-card__detail-label">Responsable:</span>{' '}
            {careCoordinator ? `${careCoordinator.nombre}, ${careCoordinator.rol.toLowerCase()}` : 'Equipo de cuidado'}
          </p>
        </div>
      </Card>

      <EstadoHoyCard
        pendientes={pendingTasks}
        completadas={completedTasks}
        alertasActivas={activeAlerts}
        proximaActividad={todayActivities[0]?.titulo ?? 'Sin actividades'}
      />

      <ProximaActividadCard
        key={nextActivity?.id ?? 'empty-next-activity'}
        activity={todayActivities[0] ?? null}
        responsiblePerson={careCoordinator ? `${careCoordinator.nombre}, ${careCoordinator.rol.toLowerCase()}` : 'Equipo de cuidado'}
        onOpenCalendar={() => navigate('/calendar')}
      />

      <section className="home-section">
        <SectionTitle title="Accesos rápidos" />
        <QuickAccessGrid items={quickLinks} />
      </section>

      <section className="home-section">
        <SectionTitle title="Próximas actividades" />
        <ActivityList activities={todayActivities} emptyMessage="No hay actividades para hoy." />
      </section>
    </section>
  );
}

function formatHour(time24: string) {
  const [hour, minute] = time24.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalizedHour}:${String(minute).padStart(2, '0')} ${suffix}`;
}
