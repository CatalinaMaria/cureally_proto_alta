import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { Card } from '../../components/cards/Card';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { getCareMember } from '../../data/mockData';

export function CaregiverProfileScreen() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const careMember = getCareMember(currentUser?.careMemberId);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Mi perfil" subtitle="Identidad del turno demo" />
      <Card>
        <h2 className="card-title">{currentUser?.nombre}</h2>
        <p className="profile-user-role">{careMember?.rol ?? 'Cuidador profesional'}</p>
        <dl className="info-list">
          <div><dt>Email</dt><dd>{currentUser?.email}</dd></div>
          <div><dt>Persona cuidada</dt><dd>Juan Pérez</dd></div>
          <div><dt>Acceso</dt><dd>Operativo y de sólo lectura</dd></div>
        </dl>
      </Card>
      <Card>
        <h3 className="card-title">Permisos del perfil</h3>
        <p className="muted-text">Podés consultar y registrar el cuidado asignado. La red, responsables y datos de Juan son administrados por Carina.</p>
      </Card>
      <Button variant="danger" fullWidth onClick={handleLogout}>Cerrar sesión</Button>
    </section>
  );
}
