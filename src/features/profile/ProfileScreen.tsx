import { useAuth } from '../../app/auth';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { Button } from '../../components/forms/Button';
import { Card } from '../../components/cards/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

export function ProfileScreen() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const { patient } = useCareStore();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Mi perfil" subtitle="Información de tu cuenta y preferencias" />

      <Card>
        <h3 className="card-title">{currentUser?.nombre ?? 'Carina'}</h3>
        <p className="profile-user-role">{currentUser?.isCoordinator ? 'Familiar responsable' : 'Familiar'}</p>
        <dl className="info-list">
          <div>
            <dt>Email</dt>
            <dd>{currentUser?.email ?? 'carina@cureally.com'}</dd>
          </div>
          <div>
            <dt>Persona cuidada asociada</dt>
            <dd>{patient.nombre}</dd>
          </div>
          <div>
            <dt>Rol en la red de cuidado</dt>
            <dd>{currentUser?.isCoordinator ? 'Familiar responsable' : 'Familiar participante'}</dd>
          </div>
        </dl>
        <Button type="button" variant="secondary" className="profile-action-card__button" onClick={() => navigate('/patient-profile')}>
          Ver perfil de Juan
        </Button>
      </Card>

      {currentUser?.isCoordinator ? <Card>
        <h3 className="card-title">Preferencias de notificaciones</h3>
        <ul className="simple-list">
          <li>
            <span>Alertas importantes</span>
            <span className="muted-text">Activadas</span>
          </li>
          <li>
            <span>Informes diarios</span>
            <span className="muted-text">Activados</span>
          </li>
          <li>
            <span>Recordatorios de stock</span>
            <span className="muted-text">Activados</span>
          </li>
        </ul>
      </Card> : null}

      {currentUser?.isCoordinator ? <Card className="profile-action-card">
        <p className="profile-action-card__title">Configuración de cuenta</p>
        <p className="muted-text">Preferencias de seguridad, idioma y notificaciones.</p>
      </Card> : null}

      <Button variant="danger" fullWidth onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </section>
  );
}
