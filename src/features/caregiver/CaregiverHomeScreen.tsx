import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { Card } from '../../components/cards/Card';
import { QuickAccessGrid, type QuickAccessItem } from '../../components/cards/QuickAccessGrid';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { DEMO_TODAY } from '../../data/mockData';
import juanAvatar from '../../assets/juan-perez-avatar.png';
import { sortAlertsByPriority } from '../alerts/alertSorting';

export function CaregiverHomeScreen() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { patient, tasks, activities, alerts } = useCareStore();
  const caregiverId = currentUser?.careMemberId ?? '';

  const myTasks = useMemo(() => tasks.filter((task) => task.responsableId === caregiverId), [caregiverId, tasks]);
  const pendingTasks = myTasks.filter((task) => task.estado !== 'confirmada');
  const completedTasks = myTasks.filter((task) => task.estado === 'confirmada');
  const myActivities = activities
    .filter((activity) => activity.fecha === DEMO_TODAY && activity.responsableId === caregiverId)
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const nextMedication = myActivities.find(
    (activity) => activity.categoria === 'medicacion' && activity.estado !== 'completada',
  );
  const relevantAlerts = sortAlertsByPriority(
    alerts.filter((alert) => !alert.confirmada && (!alert.responsableId || alert.responsableId === caregiverId)),
  );

  const quickLinks: QuickAccessItem[] = [
    {
      id: 'caregiver-tasks',
      titulo: 'Mis tareas',
      descripcion: 'Ver y confirmar lo realizado',
      icon: 'tasks',
      onSelect: () => navigate('/caregiver/tasks'),
    },
    {
      id: 'caregiver-medication',
      titulo: 'Medicación',
      descripcion: 'Registrar una administración',
      icon: 'calendar',
      onSelect: () => navigate('/caregiver/log?mode=medication'),
    },
    {
      id: 'caregiver-update',
      titulo: 'Novedad',
      descripcion: 'Agregar una observación breve',
      icon: 'alerts',
      onSelect: () => navigate('/caregiver/log?mode=update'),
    },
    {
      id: 'caregiver-report',
      titulo: 'Informe diario',
      descripcion: 'Completar el resumen del turno',
      icon: 'reports',
      onSelect: () => navigate('/caregiver/log?mode=report'),
    },
  ];

  const sharedCareLinks: QuickAccessItem[] = [
    {
      id: 'caregiver-agenda',
      titulo: 'Agenda',
      descripcion: 'Consultar el calendario compartido',
      icon: 'calendar',
      onSelect: () => navigate('/caregiver/agenda'),
    },
    {
      id: 'caregiver-stock',
      titulo: 'Stock e insumos',
      descripcion: 'Revisar existencias y movimientos',
      icon: 'stock',
      onSelect: () => navigate('/caregiver/stock'),
    },
  ];

  return (
    <section className="screen caregiver-home">
      <ScreenHeader title="Mi turno" subtitle={`Hola, ${currentUser?.nombre ?? 'Cuidador'}`} />

      <Card className="caregiver-patient-card">
        <p className="caregiver-eyebrow">Persona cuidada</p>
        <div className="caregiver-patient-card__row">
          <img className="caregiver-patient-card__avatar" src={juanAvatar} alt={`Foto de ${patient.nombre}`} />
          <div className="caregiver-patient-card__identity">
            <h2>{patient.nombre}</h2>
            <p>{patient.edad} años · {patient.diagnostico}</p>
          </div>
          <Button type="button" variant="ghost" onClick={() => navigate('/patient-profile')}>Ver datos</Button>
        </div>
      </Card>

      <Card>
        <h3 className="card-title">Estado de mi turno</h3>
        <div className="status-grid">
          <div className="status-item status-item--pending"><span className="status-item__value">{pendingTasks.length}</span><span className="status-item__label">Pendientes</span></div>
          <div className="status-item status-item--completed"><span className="status-item__value">{completedTasks.length}</span><span className="status-item__label">Realizadas</span></div>
          <div className="status-item status-item--alerts"><span className="status-item__value">{relevantAlerts.length}</span><span className="status-item__label">Alertas</span></div>
        </div>
      </Card>

      <section className="home-section">
        <SectionTitle title="Qué tengo que hacer ahora" />
        <Card className="caregiver-next-card">
          {nextMedication ? (
            <>
              <div className="list-card__row">
                <div>
                  <p className="caregiver-eyebrow">Próxima medicación</p>
                  <p className="list-card__title">{nextMedication.titulo}</p>
                </div>
                <Badge variant="warning">{formatHour(nextMedication.hora)}</Badge>
              </div>
              <Button type="button" fullWidth onClick={() => navigate('/caregiver/log?mode=medication')}>
                Registrar administración
              </Button>
            </>
          ) : (
            <p className="muted-text">No tenés medicaciones pendientes para hoy.</p>
          )}
        </Card>
      </section>

      <section className="home-section">
        <SectionTitle title="Acciones rápidas" />
        <QuickAccessGrid items={quickLinks} />
      </section>

      <section className="home-section">
        <SectionTitle title="Consultar el cuidado" />
        <QuickAccessGrid items={sharedCareLinks} />
      </section>

      <section className="home-section">
        <SectionTitle title="Tareas pendientes" />
        <div className="stack-sm">
          {pendingTasks.slice(0, 2).map((task) => (
            <Card key={task.id} className="list-card">
              <div className="list-card__row">
                <p className="list-card__title">{task.titulo}</p>
                <Badge variant="warning">Pendiente</Badge>
              </div>
              <p className="list-card__meta">{formatShift(task.franja)}</p>
            </Card>
          ))}
          {!pendingTasks.length ? <p className="muted-text">Completaste todas tus tareas asignadas.</p> : null}
        </div>
      </section>

      <section className="home-section">
        <SectionTitle title="Agenda de hoy" />
        <div className="stack-sm">
          {myActivities.map((activity) => (
            <Card key={activity.id} className="list-card">
              <div className="list-card__row">
                <p className="list-card__title">{activity.titulo}</p>
                <span className="list-card__time">{formatHour(activity.hora)}</span>
              </div>
              <div className="list-card__row">
                <span className="muted-text">{activity.categoria === 'medicacion' ? 'Medicación' : activity.categoria === 'consulta' ? 'Consulta' : 'Tarea'}</span>
                <Badge variant={activity.estado === 'completada' ? 'success' : 'neutral'}>{activity.estado === 'completada' ? 'Registrada' : 'Programada'}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {relevantAlerts.length ? (
        <section className="home-section">
          <SectionTitle title="Alertas relevantes" />
          {relevantAlerts.map((alert) => (
            <Card key={alert.id} className={`list-card alert-card alert-card--${alert.severidad}`}>
              <div className="list-card__row">
                <p className="list-card__title">{alert.titulo}</p>
                <Badge variant={alert.severidad === 'alta' ? 'danger' : alert.severidad === 'media' ? 'warning' : 'neutral'}>
                  {alert.severidad === 'alta' ? 'Alta' : alert.severidad === 'media' ? 'Media' : 'Baja'}
                </Badge>
              </div>
              <p className="alert-card__description">{alert.descripcion}</p>
            </Card>
          ))}
        </section>
      ) : null}
    </section>
  );
}

function formatHour(time24: string) {
  const [hour, minute] = time24.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalizedHour}:${String(minute).padStart(2, '0')} ${suffix}`;
}

function formatShift(shift?: 'manana' | 'tarde' | 'noche') {
  if (shift === 'manana') return 'Turno mañana';
  if (shift === 'tarde') return 'Turno tarde';
  if (shift === 'noche') return 'Turno noche';
  return 'Durante el turno';
}
