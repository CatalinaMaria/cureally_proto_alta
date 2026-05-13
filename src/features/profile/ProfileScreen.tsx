import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { careNetwork } from '../../data/mockData';
import { Button } from '../../components/forms/Button';
import { CareNetworkCard } from '../../components/cards/CareNetworkCard';
import { PatientInfoCard } from '../../components/cards/PatientInfoCard';
import { ProfileActionCard } from '../../components/cards/ProfileActionCard';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

export function ProfileScreen() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { patient } = useCareStore();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Perfil" subtitle="Información general de cuidado" />
      <PatientInfoCard patient={patient} />
      <CareNetworkCard members={careNetwork} />
      <ProfileActionCard title="Historial médico" description="Resumen de consultas, medicaciones y controles." />
      <ProfileActionCard title="Información general" description="Datos de contacto, dirección y rutinas importantes." />
      <ProfileActionCard title="Red de cuidado" description="Roles y coordinación entre familiares y cuidadores." />
      <Button variant="danger" fullWidth onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </section>
  );
}
