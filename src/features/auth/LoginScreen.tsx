import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { demoCredentials } from '../../data/mockData';
import { Card } from '../../components/cards/Card';
import { Button } from '../../components/forms/Button';
import { InputField } from '../../components/forms/InputField';
import { MobileFrame } from '../../components/layout/MobileFrame';

export function LoginScreen() {
  const { login } = useAuth();
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
      setError('Credenciales inválidas. Usá las credenciales de demostración para continuar.');
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <MobileFrame>
      <div className="public-screen login-screen">
        <div className="login-header">
          <p className="brand-name">CureAlly</p>
          <h1>Iniciar sesión</h1>
        </div>
        <Card className="login-panel">
          <form className="stack-md login-form" onSubmit={handleSubmit}>
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
            <Button type="submit" fullWidth className="login-submit">
              Iniciar sesión
            </Button>
            <div className="login-links login-actions">
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
        <p className="login-demo-note">
          Credenciales demo: <strong>{demoCredentials.email}</strong> / <strong>{demoCredentials.password}</strong>
        </p>
      </div>
    </MobileFrame>
  );
}
