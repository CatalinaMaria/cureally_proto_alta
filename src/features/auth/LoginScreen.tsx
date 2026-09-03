import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { demoUsers, getCareMember } from '../../data/mockData';
import { Card } from '../../components/cards/Card';
import { Button } from '../../components/forms/Button';
import { MobileFrame } from '../../components/layout/MobileFrame';

export function LoginScreen() {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(demoUsers[0].id);

  const handleLogin = () => {
    const selectedUser = demoUsers.find((user) => user.id === selectedUserId);
    if (!selectedUser || !loginAs(selectedUser.id)) return;
    navigate(selectedUser.role === 'caregiver' ? '/caregiver/home' : '/home', { replace: true });
  };

  return (
    <MobileFrame>
      <div className="public-screen login-screen">
        <div className="login-header">
          <p className="brand-name">CureAlly</p>
          <h1>Elegí tu experiencia</h1>
          <p className="muted-text">Seleccioná un perfil para recorrer el prototipo.</p>
        </div>
        <Card className="login-panel">
          <fieldset className="demo-profile-picker">
            <legend>Ingresar como</legend>
            {demoUsers.map((user) => (
              <label key={user.id} className={`demo-profile-option ${selectedUserId === user.id ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="demo-user"
                  value={user.id}
                  checked={selectedUserId === user.id}
                  onChange={() => setSelectedUserId(user.id)}
                />
                <span className="demo-profile-option__avatar" aria-hidden="true">{user.nombre.charAt(0)}</span>
                <span className="demo-profile-option__content">
                  <strong>{user.nombre}</strong>
                  <span>{getCareMember(user.careMemberId)?.rol ?? (user.isCoordinator ? 'Familiar responsable' : 'Familiar')}</span>
                  <small>{user.descripcion}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <Button type="button" fullWidth className="login-submit" onClick={handleLogin}>
            Ingresar al prototipo
          </Button>
        </Card>
        <p className="login-demo-note">No se requieren credenciales. Cada perfil abre una experiencia demo diferente.</p>
      </div>
    </MobileFrame>
  );
}
