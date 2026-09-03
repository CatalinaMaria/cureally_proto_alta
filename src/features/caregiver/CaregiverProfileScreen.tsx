import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { Card } from '../../components/cards/Card';
import { QuickAccessGrid, type QuickAccessItem } from '../../components/cards/QuickAccessGrid';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { DEMO_TODAY, getCareMember } from '../../data/mockData';

export function CaregiverProfileScreen() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { activities, patient, tasks } = useCareStore();
  const careMember = getCareMember(currentUser?.careMemberId);
  const caregiverId = currentUser?.careMemberId ?? '';
  const todayActivities = activities.filter(
    (activity) => activity.fecha === DEMO_TODAY && activity.responsableId === caregiverId,
  );
  const completedToday = todayActivities.filter((activity) => activity.estado === 'completada').length;
  const pendingTasks = tasks.filter(
    (task) => task.responsableId === caregiverId && task.estado !== 'confirmada',
  ).length;

  const profileLinks: QuickAccessItem[] = [
    {
      id: 'profile-juan',
      titulo: 'Datos de Juan',
      descripcion: 'Información en modo lectura',
      icon: 'profile',
      onSelect: () => navigate('/patient-profile'),
    },
    {
      id: 'profile-records',
      titulo: 'Mis registros',
      descripcion: 'Medicación, novedades e informe',
      icon: 'reports',
      onSelect: () => navigate('/caregiver/log'),
    },
    {
      id: 'profile-messages',
      titulo: 'Mensajes',
      descripcion: 'Comunicarme con la red',
      icon: 'messages',
      onSelect: () => navigate('/messages'),
    },
    {
      id: 'profile-shift',
      titulo: 'Mi turno',
      descripcion: 'Volver a mis pendientes',
      icon: 'tasks',
      onSelect: () => navigate('/caregiver/home'),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <section className="screen caregiver-profile stack-lg">
      <ScreenHeader title="Mi perfil" subtitle="Tu espacio dentro de CureAlly" />

      <Card className="caregiver-profile-hero">
        <div className="caregiver-profile-hero__identity">
          <div className="caregiver-profile-hero__avatar" aria-hidden="true">{currentUser?.nombre.charAt(0)}</div>
          <div>
            <h2>{currentUser?.nombre}</h2>
            <p>{careMember?.rol ?? 'Cuidador profesional'}</p>
          </div>
          <Badge variant="success">Turno activo</Badge>
        </div>
        <div className="caregiver-profile-hero__patient">
          <span>Persona cuidada asociada</span>
          <strong>{patient.nombre}</strong>
        </div>
        <div className="caregiver-profile-summary">
          <div><strong>{todayActivities.length}</strong><span>Actividades hoy</span></div>
          <div><strong>{completedToday}</strong><span>Registradas</span></div>
          <div><strong>{pendingTasks}</strong><span>Tareas pendientes</span></div>
        </div>
      </Card>

      <section>
        <SectionTitle title="Accesos de mi perfil" />
        <QuickAccessGrid items={profileLinks} />
      </section>

      <Card className="caregiver-profile-access">
        <div>
          <p className="caregiver-eyebrow">Mi información</p>
          <strong>{currentUser?.email}</strong>
        </div>
        <div className="caregiver-permission-chips" aria-label="Permisos del perfil">
          <span>✓ Registrar cuidado</span>
          <span>✓ Consultar datos</span>
          <span>Solo lectura en la red</span>
        </div>
      </Card>

      <Button variant="danger" fullWidth onClick={handleLogout}>Cerrar sesión</Button>
    </section>
  );
}
