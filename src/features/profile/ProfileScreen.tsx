import { useAuth } from '../../app/auth';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { Button } from '../../components/forms/Button';
import { Card } from '../../components/cards/Card';
import { QuickAccessGrid, type QuickAccessItem } from '../../components/cards/QuickAccessGrid';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { careNetwork, DEMO_TODAY, getCareMember } from '../../data/mockData';

export function ProfileScreen() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const { patient, tasks, alerts, activities } = useCareStore();
  const isCoordinator = Boolean(currentUser?.isCoordinator);
  const careMember = getCareMember(currentUser?.careMemberId);
  const activeAlerts = alerts.filter((alert) => !alert.confirmada).length;
  const pendingTasks = tasks.filter((task) => task.estado !== 'confirmada').length;
  const todayActivities = activities.filter((activity) => activity.fecha === DEMO_TODAY).length;

  const coordinatorLinks: QuickAccessItem[] = [
    {
      id: 'family-juan',
      titulo: 'Datos de Juan',
      descripcion: 'Información de la persona cuidada',
      icon: 'profile',
      onSelect: () => navigate('/patient-profile'),
    },
    {
      id: 'family-network',
      titulo: 'Red de cuidado',
      descripcion: 'Integrantes y contactos importantes',
      icon: 'messages',
      onSelect: () => navigate('/patient-profile#care-network'),
    },
    {
      id: 'family-reports',
      titulo: 'Informes',
      descripcion: 'Seguimiento de registros diarios',
      icon: 'reports',
      onSelect: () => navigate('/reports'),
    },
    {
      id: 'family-stock',
      titulo: 'Stock e insumos',
      descripcion: 'Existencias y últimos movimientos',
      icon: 'stock',
      onSelect: () => navigate('/stock'),
    },
  ];

  const collaboratorLinks: QuickAccessItem[] = [
    coordinatorLinks[0],
    coordinatorLinks[1],
    coordinatorLinks[3],
    {
      id: 'family-messages',
      titulo: 'Mensajes',
      descripcion: 'Conversaciones de la red',
      icon: 'messages',
      onSelect: () => navigate('/messages'),
    },
  ];

  const summaryItems = isCoordinator
    ? [
        { value: pendingTasks, label: 'Tareas pendientes' },
        { value: activeAlerts, label: 'Alertas activas' },
        { value: careNetwork.length, label: 'Integrantes de la red' },
      ]
    : [
        { value: todayActivities, label: 'Actividades hoy' },
        { value: activeAlerts, label: 'Alertas activas' },
        { value: careNetwork.length, label: 'Integrantes de la red' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <section className="screen family-profile stack-lg">
      <ScreenHeader title="Mi perfil" subtitle="Tu espacio dentro de CureAlly" />

      <Card className="caregiver-profile-hero family-profile-hero">
        <div className="caregiver-profile-hero__identity">
          <div className="caregiver-profile-hero__avatar" aria-hidden="true">
            {currentUser?.nombre.charAt(0) ?? 'F'}
          </div>
          <div>
            <h2>{currentUser?.nombre ?? 'Familiar'}</h2>
            <p>{careMember?.rol ?? (isCoordinator ? 'Familiar responsable' : 'Familiar')}</p>
          </div>
          <Badge variant={isCoordinator ? 'success' : 'neutral'}>
            {isCoordinator ? 'Coordinadora principal' : 'Miembro de la red'}
          </Badge>
        </div>

        <div className="caregiver-profile-hero__patient">
          <span>Persona cuidada asociada</span>
          <strong>{patient.nombre}</strong>
        </div>

        <div className="caregiver-profile-summary">
          {summaryItems.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <section>
        <SectionTitle title={isCoordinator ? 'Accesos de coordinación' : 'Accesos de mi perfil'} />
        <QuickAccessGrid items={isCoordinator ? coordinatorLinks : collaboratorLinks} />
      </section>

      <Card className="caregiver-profile-access">
        <div>
          <p className="caregiver-eyebrow">Mi información</p>
          <strong>{currentUser?.email}</strong>
        </div>
        <div className="caregiver-permission-chips" aria-label="Alcance del perfil">
          {isCoordinator ? (
            <>
              <span>✓ Supervisar cuidado</span>
              <span>✓ Gestionar responsables</span>
              <span>✓ Consultar registros</span>
            </>
          ) : (
            <>
              <span>✓ Consultar cuidado</span>
              <span>✓ Registrar reposiciones</span>
              <span>Participar en la red</span>
            </>
          )}
        </div>
      </Card>

      {isCoordinator ? (
        <Card>
          <div className="family-profile-section-heading">
            <div>
              <p className="caregiver-eyebrow">Preferencias</p>
              <h3 className="card-title">Notificaciones</h3>
            </div>
            <Badge variant="neutral">Configuradas</Badge>
          </div>
          <ul className="simple-list">
            <li><span>Alertas importantes</span><span className="muted-text">Activadas</span></li>
            <li><span>Informes diarios</span><span className="muted-text">Activados</span></li>
            <li><span>Recordatorios de stock</span><span className="muted-text">Activados</span></li>
          </ul>
        </Card>
      ) : null}

      <Button variant="danger" fullWidth onClick={handleLogout}>Cerrar sesión</Button>
    </section>
  );
}
