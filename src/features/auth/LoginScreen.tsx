import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { demoCredentials } from '../../data/mockData';
import { Card } from '../../components/cards/Card';
import { Button } from '../../components/forms/Button';
import { InputField } from '../../components/forms/InputField';
import { MobileFrame } from '../../components/layout/MobileFrame';

export function LoginScreen() {
  const { login, loginDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState(demoCredentials.password);
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/home';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ok = login(email, password);
    if (!ok) {
      setError('Credenciales inválidas. Usá el acceso de demostración para continuar.');
      return;
    }

    navigate(from, { replace: true });
  };

  const handleDemoMode = () => {
    loginDemoMode();
    navigate('/home', { replace: true });
  };

  return (
    <MobileFrame>
      <div className="public-screen">
        <p className="brand-name">CureAlly</p>
        <h1>Iniciar sesión</h1>
        <Card>
          <form className="stack-md" onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="maria@cureally.com"
              required
            />
            <InputField
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="******"
              required
            />
            {error ? <p className="error-text">{error}</p> : null}
            <Button type="submit" fullWidth>
              Iniciar sesión
            </Button>
            <div className="login-links">
              <button type="button" className="text-button" onClick={() => setError('Funcionalidad disponible próximamente.') }>
                ¿Olvidaste tu contraseña?
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setError('El registro se encuentra deshabilitado en este prototipo.')}
              >
                Crear cuenta
              </button>
            </div>
          </form>
        </Card>
        <Card>
          <p className="muted-text">
            Credenciales demo: <strong>{demoCredentials.email}</strong> / <strong>{demoCredentials.password}</strong>
          </p>
          <Button variant="secondary" fullWidth onClick={handleDemoMode}>
            Entrar en modo demo
          </Button>
        </Card>
      </div>
    </MobileFrame>
  );
}
