import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/forms/Button';
import { MobileFrame } from '../../components/layout/MobileFrame';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <div className="public-screen public-screen--centered public-screen--welcome">
        <div className="welcome-content">
          <div className="welcome-logo-shell" aria-hidden="true">
            <img className="welcome-logo-image" src="/cureally-logo.svg" alt="" />
          </div>
          <p className="brand-name welcome-brand-name">CureAlly</p>
          <h1>¡Bienvenido a CureAlly!</h1>
          <p className="public-screen__subtitle welcome-subtitle">Conectá y organizá el cuidado de tus seres queridos</p>
        </div>

        <Button className="welcome-cta" fullWidth onClick={() => navigate('/login')}>
          Comenzar
        </Button>
      </div>
    </MobileFrame>
  );
}
