import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Card } from '../../components/cards/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { CONVERSATIONS, type Conversation, getConversationIdFromName } from './messagesData';

interface MessagesRouteState {
  conversation?: string;
}

export function MessagesScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as MessagesRouteState | null) ?? null;

  useEffect(() => {
    const requestedConversationId = getConversationIdFromName(routeState?.conversation);
    if (!requestedConversationId) return;

    navigate(`/messages/${requestedConversationId}`, { replace: true });
  }, [navigate, routeState?.conversation]);

  return (
    <section className="screen stack-lg messages-page">
      <ScreenHeader title="Mensajes" subtitle="Seguimiento de conversaciones con la red de cuidado." />

      <section>
        <SectionTitle title="Conversaciones" />
        <div className="stack-sm">
          {CONVERSATIONS.map((conversation) => (
            <Card key={conversation.id} className={`conversation-card ${conversation.esGrupo ? 'conversation-card--group' : ''}`}>
              <div className="conversation-card__head">
                <div className="conversation-card__identity">
                  <div className="conversation-card__avatar" aria-hidden="true">
                    {conversation.esGrupo ? 'RC' : conversation.titulo.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="conversation-card__name">{conversation.titulo}</p>
                    <p className="conversation-card__role">{conversation.subtitulo}</p>
                  </div>
                </div>
                <span className="conversation-card__time">{conversation.hora}</span>
              </div>

              <p className="conversation-card__preview">{conversation.ultimoMensaje}</p>

              <div className="conversation-card__meta-row">
                <Badge variant={conversationStatusVariant(conversation.estado)}>{conversationStatusLabel(conversation.estado)}</Badge>
              </div>

              <div className="conversation-card__cta-row">
                <button type="button" className="text-button conversation-card__open-link" onClick={() => navigate(`/messages/${conversation.id}`)}>
                  Abrir conversación
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </section>
  );
}

function conversationStatusLabel(status: Conversation['estado']) {
  if (status === 'respondido') return 'Respondido';
  if (status === 'nuevo') return 'Nuevo';
  return 'Pendiente';
}

function conversationStatusVariant(status: Conversation['estado']) {
  if (status === 'respondido') return 'neutral';
  if (status === 'nuevo') return 'success';
  return 'warning';
}
