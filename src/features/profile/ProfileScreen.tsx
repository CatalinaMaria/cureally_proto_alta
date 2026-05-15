import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { useCareStore } from '../../app/care-store';
import { careNetwork } from '../../data/mockData';
import { Button } from '../../components/forms/Button';
import { Card } from '../../components/cards/Card';
import { CareNetworkCard } from '../../components/cards/CareNetworkCard';
import { PatientInfoCard } from '../../components/cards/PatientInfoCard';
import { ProfileActionCard } from '../../components/cards/ProfileActionCard';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

interface ImportantContact {
  id: string;
  nombre: string;
  rol: string;
  detalle?: string;
  acciones: Array<'llamar' | 'mensaje' | 'conversacion'>;
}

const importantContacts: ImportantContact[] = [
  {
    id: 'contact-doctora',
    nombre: 'Dra. Laura Méndez',
    rol: 'Médica de cabecera',
    acciones: ['llamar', 'mensaje'],
  },
  {
    id: 'contact-carolina',
    nombre: 'Carolina',
    rol: 'Cuidadora principal',
    acciones: ['conversacion'],
  },
  {
    id: 'contact-pedro',
    nombre: 'Pedro',
    rol: 'Cuidador',
    acciones: ['conversacion'],
  },
  {
    id: 'contact-farmacia',
    nombre: 'Farmacity Cabildo',
    rol: 'Farmacia habitual',
    acciones: ['llamar'],
  },
  {
    id: 'contact-emergencias',
    nombre: 'Emergencias',
    rol: 'Línea de emergencia',
    detalle: '107',
    acciones: ['llamar'],
  },
];

export function ProfileScreen() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { patient } = useCareStore();
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [contactFeedback, setContactFeedback] = useState('');

  useEffect(() => {
    if (!isContactsOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsContactsOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isContactsOpen]);

  const pushFeedback = (message: string) => {
    setContactFeedback(message);
    window.setTimeout(() => setContactFeedback(''), 2600);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleContactAction = (contact: ImportantContact, action: ImportantContact['acciones'][number]) => {
    if (action === 'conversacion') {
      setIsContactsOpen(false);
      navigate('/messages', {
        state: {
          conversation: contact.nombre,
        },
      });
      return;
    }

    if (action === 'llamar') {
      const target = contact.detalle ? `${contact.nombre} (${contact.detalle})` : contact.nombre;
      pushFeedback(`Acción simulada: llamando a ${target}`);
      return;
    }

    pushFeedback(`Acción simulada: enviando mensaje a ${contact.nombre}`);
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Perfil" subtitle="Información general de cuidado" />
      <PatientInfoCard patient={patient} />
      <CareNetworkCard members={careNetwork} />
      <Card>
        <h3 className="card-title">Contactos importantes</h3>
        <ul className="important-contacts-list">
          <li>
            <span>Dra. Laura Méndez</span>
            <span className="muted-text">Médica de cabecera</span>
          </li>
          <li>
            <span>Carolina</span>
            <span className="muted-text">Cuidadora principal</span>
          </li>
          <li>
            <span>Farmacia habitual</span>
            <span className="muted-text">Farmacity Cabildo</span>
          </li>
          <li>
            <span>Emergencias</span>
            <span className="muted-text">107</span>
          </li>
        </ul>
        <Button type="button" variant="ghost" fullWidth className="important-contacts__button" onClick={() => setIsContactsOpen(true)}>
          Ver contactos
        </Button>
      </Card>
      <ProfileActionCard title="Historial médico" description="Resumen de consultas, medicaciones y controles." />
      <ProfileActionCard title="Información general" description="Datos de contacto, dirección y rutinas importantes." />
      <ProfileActionCard title="Gestionar red de cuidado" description="Roles y coordinación entre familiares y cuidadores." />
      <Button variant="danger" fullWidth onClick={handleLogout}>
        Cerrar sesión
      </Button>

      {isContactsOpen ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={() => setIsContactsOpen(false)}>
          <div
            className="activity-modal-sheet task-modal-sheet contacts-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contactos-importantes-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="contactos-importantes-titulo" className="activity-modal-sheet__title">
              Contactos importantes
            </h4>

            <div className="contacts-sheet__list">
              {importantContacts.map((contact) => (
                <div key={contact.id} className="contacts-sheet__item">
                  <p className="contacts-sheet__name">{contact.nombre}</p>
                  <p className="muted-text">
                    {contact.rol}
                    {contact.detalle ? ` · ${contact.detalle}` : ''}
                  </p>
                  <div className="contacts-sheet__actions">
                    {contact.acciones.map((action) => (
                      <button
                        key={`${contact.id}-${action}`}
                        type="button"
                        className="text-button"
                        onClick={() => handleContactAction(contact, action)}
                      >
                        {action === 'llamar' ? 'Llamar' : action === 'mensaje' ? 'Enviar mensaje' : 'Abrir conversación'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {contactFeedback ? (
              <p className="profile-feedback" role="status" aria-live="polite">
                {contactFeedback}
              </p>
            ) : null}

            <div className="task-modal-sheet__actions">
              <Button type="button" variant="secondary" fullWidth onClick={() => setIsContactsOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
