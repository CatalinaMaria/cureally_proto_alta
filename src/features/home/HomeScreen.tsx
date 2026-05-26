import { type KeyboardEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { careNetwork, caregiverName } from '../../data/mockData';
import { ActivityList } from '../../components/cards/ActivityList';
import { Card } from '../../components/cards/Card';
import { EstadoHoyCard } from '../../components/cards/EstadoHoyCard';
import { QuickAccessGrid, type QuickAccessItem } from '../../components/cards/QuickAccessGrid';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import juanAvatar from '../../assets/juan-perez-avatar.png';

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
      id: 'quick-stock',
      titulo: 'Stock de cuidado',
      descripcion: 'Revisar medicación e insumos',
      icon: 'stock',
      onSelect: () => navigate('/stock'),
    },
    {
      id: 'quick-reports',
      titulo: 'Informes',
      descripcion: 'Revisar historial diario',
      icon: 'reports',
      onSelect: () => navigate('/reports'),
    },
  ];

  const openPatientProfile = () => {
    navigate('/patient-profile');
  };

  const handlePatientCardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPatientProfile();
    }
  };

  return (
    <section className="screen home-screen">
      <ScreenHeader title="Inicio" subtitle={`Hola, ${caregiverName}`} />

      <Card className="home-patient-card">
        <div
          role="button"
          tabIndex={0}
          className="home-patient-card__surface"
          aria-label={`Abrir perfil de ${patient.nombre}`}
          onClick={openPatientProfile}
          onKeyDown={handlePatientCardKey}
        >
          <div className="home-patient-card__head">
            <div className="home-patient-card__avatar">
              <img className="home-patient-card__avatar-image" src={juanAvatar} alt={`Foto de ${patient.nombre}`} />
            </div>
            <span className="home-patient-card__profile-action">Ver perfil →</span>
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
        </div>
      </Card>

      <EstadoHoyCard
        pendientes={pendingTasks}
        completadas={completedTasks}
        alertasActivas={activeAlerts}
        proximaActividad={todayActivities[0]?.titulo ?? 'Sin actividades'}
      />

      <section className="home-section">
        <SectionTitle title="Accesos rápidos" />
        <QuickAccessGrid items={quickLinks} />
      </section>

      <section className="home-section">
        <SectionTitle title="Próximas actividades" />
        <ActivityList
          activities={todayActivities}
          emptyMessage="No hay actividades para hoy."
          enableDetail
          responsiblePerson={careCoordinator ? `${careCoordinator.nombre}, ${careCoordinator.rol.toLowerCase()}` : 'Equipo de cuidado'}
          onOpenCalendar={() => navigate('/calendar')}
        />
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
