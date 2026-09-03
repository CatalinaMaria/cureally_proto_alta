import { useAuth } from '../../app/auth';
import { Card } from '../../components/cards/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

export function CaregiverHomeScreen() {
  const { currentUser } = useAuth();

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Inicio" subtitle={`Hola, ${currentUser?.nombre ?? 'Cuidador'}`} />
      <Card>
        <h2 className="card-title">Turno de cuidado de Juan</h2>
        <p className="muted-text">Tu agenda operativa se mostrará en este espacio.</p>
      </Card>
    </section>
  );
}
