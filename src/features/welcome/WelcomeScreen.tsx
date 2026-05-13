import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/forms/Button';
import { MobileFrame } from '../../components/layout/MobileFrame';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <div className="public-screen public-screen--centered">
        <div className="brand-mark" aria-hidden="true">
          CA
        </div>
        <p className="brand-name">CureAlly</p>
        <h1>¡Bienvenido a CureAlly!</h1>
        <p className="public-screen__subtitle">Conectá y organizá el cuidado de tus seres queridos</p>
        <Button fullWidth onClick={() => navigate('/login')}>
          Comenzar
        </Button>
      </div>
    </MobileFrame>
  );
}
