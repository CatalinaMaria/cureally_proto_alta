import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCareStore } from '../../app/care-store';
import { careNetwork } from '../../data/mockData';
import { Badge } from '../../components/feedback/Badge';
import { Button } from '../../components/forms/Button';
import { Card } from '../../components/cards/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import juanAvatar from '../../assets/juan-perez-avatar.png';
import { useAuth } from '../../app/auth';

interface ImportantContact {
  id: string;
  nombre: string;
  rol: string;
  detalle?: string;
  accion: 'llamar' | 'conversacion';
  conversationId?: string;
}

const importantContacts: ImportantContact[] = [
  {
    id: 'contact-doctora',
    nombre: 'Dra. Laura Méndez',
    rol: 'Médica de cabecera',
    accion: 'llamar',
  },
  {
    id: 'contact-maria',
    nombre: 'María',
    rol: 'Cuidadora profesional',
    accion: 'conversacion',
    conversationId: 'conv-maria',
  },
  {
    id: 'contact-farmacia',
    nombre: 'Farmacity Cabildo',
    rol: 'Farmacia habitual',
    accion: 'llamar',
  },
  {
    id: 'contact-emergencias',
    nombre: 'Emergencias',
    rol: 'Línea de emergencia',
    detalle: '107',
    accion: 'llamar',
  },
];

export function PatientProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { patient } = useCareStore();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (location.hash !== '#care-network') return;
    document.getElementById('care-network')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  const pushFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2600);
  };

  const handleContactAction = (contact: ImportantContact) => {
    if (contact.accion === 'conversacion') {
      navigate(`/messages/${contact.conversationId ?? 'conv-red-juan'}`);
      return;
    }

    const target = contact.detalle ? `${contact.nombre} (${contact.detalle})` : contact.nombre;
    pushFeedback(`Acción simulada: llamando a ${target}`);
  };

  return (
    <section className="screen stack-lg">
      <ScreenHeader title="Perfil de Juan" subtitle="Detalle de la persona cuidada" showBack backTo={currentUser?.role === 'caregiver' ? '/caregiver/home' : '/home'} />

      <Card className="patient-detail-hero">
        <div className="patient-detail-hero__avatar-wrap">
          <img className="patient-detail-hero__avatar" src={juanAvatar} alt={`Foto de ${patient.nombre}`} />
        </div>
        <div className="patient-detail-hero__content">
          <p className="patient-detail-hero__name">{patient.nombre}</p>
          <p className="patient-detail-hero__meta">{patient.edad} años</p>
          <Badge variant="neutral">{patient.diagnostico}</Badge>
        </div>
      </Card>

      <Card>
        <h3 className="card-title">Información de la persona cuidada</h3>
        <dl className="info-list">
          <div>
            <dt>Nombre</dt>
            <dd>{patient.nombre}</dd>
          </div>
          <div>
            <dt>Edad</dt>
            <dd>{patient.edad} años</dd>
          </div>
          <div>
            <dt>Diagnóstico</dt>
            <dd>{patient.diagnostico}</dd>
          </div>
          <div>
            <dt>Alergias</dt>
            <dd>{patient.alergias}</dd>
          </div>
        </dl>
      </Card>

      <div id="care-network" className="profile-anchor-section">
        <Card>
          <h3 className="card-title">Red de cuidado</h3>
          <ul className="simple-list">
            {careNetwork.map((member) => (
              <li key={member.id}>
                <span>{member.nombre}</span>
                <span className="muted-text">{member.rol}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="card-title">Contactos importantes</h3>
        <div className="patient-contacts-list">
          {importantContacts.map((contact) => {
            const isEmergency = contact.id === 'contact-emergencias';

            return (
              <div
                key={contact.id}
                className={`patient-contacts-list__item ${isEmergency ? 'patient-contacts-list__item--emergency' : ''}`.trim()}
              >
              <div>
                <p className={`patient-contacts-list__name ${isEmergency ? 'patient-contacts-list__name--emergency' : ''}`.trim()}>
                  {contact.nombre}
                </p>
                <p className={`muted-text ${isEmergency ? 'patient-contacts-list__meta--emergency' : ''}`.trim()}>
                  {contact.rol}
                  {contact.detalle ? ` · ${contact.detalle}` : ''}
                </p>
              </div>
              <button
                type="button"
                className={`text-button ${isEmergency ? 'patient-contacts-list__action--emergency' : ''}`.trim()}
                onClick={() => handleContactAction(contact)}
              >
                {contact.accion === 'conversacion' ? 'Abrir conversación' : isEmergency ? 'Llamar 107' : 'Llamar'}
              </button>
              </div>
            );
          })}
        </div>
      </Card>

      {currentUser?.role === 'family' ? <Card className="profile-action-card">
        <p className="profile-action-card__title">Historial médico / Informes</p>
        <p className="muted-text">Consultá reportes diarios y evolución reciente de cuidado.</p>
        <Button type="button" variant="secondary" className="profile-action-card__button" onClick={() => navigate('/reports')}>
          Ver informes
        </Button>
      </Card> : null}

      {feedback ? (
        <p className="profile-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </section>
  );
}
