import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from '../../components/feedback/Badge';
import { SectionTitle } from '../../components/feedback/SectionTitle';
import { Button } from '../../components/forms/Button';
import { Card } from '../../components/cards/Card';
import { ScreenHeader } from '../../components/layout/ScreenHeader';

interface Conversation {
  id: string;
  nombre: string;
  rol: string;
  ultimoMensaje: string;
  hora: string;
  estado: 'respondido' | 'pendiente' | 'nuevo';
}

interface ConversationMessage {
  id: string;
  remitente: 'maria' | 'cuidador';
  texto: string;
  hora: string;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-carolina',
    nombre: 'Carolina',
    rol: 'Cuidadora',
    ultimoMensaje: 'Ya quedó confirmada la medicación de la mañana.',
    hora: 'Hace 10 min',
    estado: 'nuevo',
  },
  {
    id: 'conv-pedro',
    nombre: 'Pablo',
    rol: 'Cuidador',
    ultimoMensaje: 'Quedo atento a la consulta de la tarde.',
    hora: 'Hace 1 h',
    estado: 'pendiente',
  },
];

const INITIAL_THREADS: Record<string, ConversationMessage[]> = {
  'conv-carolina': [
    {
      id: 'c-msg-1',
      remitente: 'maria',
      texto: 'Hola Carolina, ¿cómo está Juan esta mañana?',
      hora: '08:15',
    },
    {
      id: 'c-msg-2',
      remitente: 'cuidador',
      texto: 'Hola María, está tranquilo y desayunó bien.',
      hora: '08:22',
    },
    {
      id: 'c-msg-3',
      remitente: 'cuidador',
      texto: 'Ya quedó confirmada la medicación de la mañana.',
      hora: 'Hace 10 min',
    },
  ],
  'conv-pedro': [
    {
      id: 'p-msg-1',
      remitente: 'maria',
      texto: 'Pablo, ¿podés confirmar si ya está listo el traslado para la consulta?',
      hora: '09:12',
    },
    {
      id: 'p-msg-2',
      remitente: 'cuidador',
      texto: 'Quedo atento a la consulta de la tarde.',
      hora: 'Hace 1 h',
    },
  ],
};

interface MessagesRouteState {
  conversation?: string;
  compose?: boolean;
}

export function MessagesScreen() {
  const location = useLocation();
  const routeState = (location.state as MessagesRouteState | null) ?? null;
  const initialConversationId = getConversationIdFromName(routeState?.conversation);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [threads, setThreads] = useState<Record<string, ConversationMessage[]>>(INITIAL_THREADS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() =>
    initialConversationId && !routeState?.compose ? initialConversationId : null,
  );
  const [composeConversationId, setComposeConversationId] = useState<string | null>(() =>
    initialConversationId && routeState?.compose ? initialConversationId : null,
  );
  const [conversationDraft, setConversationDraft] = useState('');
  const [composeDraft, setComposeDraft] = useState(() =>
    initialConversationId && routeState?.compose ? `Hola ${getConversationNameById(initialConversationId)}, ` : '',
  );
  const [feedback, setFeedback] = useState('');

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const composeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === composeConversationId) ?? null,
    [conversations, composeConversationId],
  );

  const activeThread = activeConversation ? threads[activeConversation.id] ?? [] : [];

  useEffect(() => {
    if (!activeConversationId && !composeConversationId) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveConversationId(null);
        setComposeConversationId(null);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [activeConversationId, composeConversationId]);

  const openConversation = (conversationId: string) => {
    setComposeConversationId(null);
    setActiveConversationId(conversationId);
    setConversationDraft('');
  };

  const closeSheets = () => {
    setActiveConversationId(null);
    setComposeConversationId(null);
  };

  const publishFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2600);
  };

  const sendMessage = (conversationId: string, message: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const targetConversation = conversations.find((conversation) => conversation.id === conversationId);
    if (!targetConversation) return;

    const newMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      remitente: 'maria',
      texto: trimmedMessage,
      hora: 'Ahora',
    };

    setThreads((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              ultimoMensaje: trimmedMessage,
              hora: 'Ahora',
              estado: 'pendiente',
            }
          : conversation,
      ),
    );

    publishFeedback(`Mensaje enviado a ${targetConversation.nombre}`);
  };

  const handleConversationSend = () => {
    if (!activeConversation) return;

    sendMessage(activeConversation.id, conversationDraft);
    setConversationDraft('');
  };

  const handleComposeSend = () => {
    if (!composeConversation) return;

    sendMessage(composeConversation.id, composeDraft);
    setComposeDraft('');
    setComposeConversationId(null);
  };

  return (
    <section className="screen stack-lg messages-page">
      <ScreenHeader title="Mensajes" subtitle="Seguimiento de conversaciones con la red de cuidado." />

      <section>
        <SectionTitle title="Conversaciones" />
        <div className="stack-sm">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="conversation-card">
              <div className="conversation-card__head">
                <div className="conversation-card__identity">
                  <div className="conversation-card__avatar" aria-hidden="true">
                    {conversation.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="conversation-card__name">{conversation.nombre}</p>
                    <p className="conversation-card__role">{conversation.rol}</p>
                  </div>
                </div>
                <span className="conversation-card__time">{conversation.hora}</span>
              </div>

              <p className="conversation-card__preview">{conversation.ultimoMensaje}</p>

              <div className="conversation-card__meta-row">
                <Badge variant={conversationStatusVariant(conversation.estado)}>{conversationStatusLabel(conversation.estado)}</Badge>
              </div>

              <div className="conversation-card__cta-row">
                <button type="button" className="text-button conversation-card__open-link" onClick={() => openConversation(conversation.id)}>
                  Abrir conversación
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {feedback ? (
        <p className="messages-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      {activeConversation ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeSheets}>
          <div
            className="activity-modal-sheet task-modal-sheet messages-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mensajes-conversacion-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="mensajes-conversacion-titulo" className="activity-modal-sheet__title">
              {`Mensajes con ${activeConversation.nombre}`}
            </h4>

            <div className="messages-thread" aria-label={`Conversación con ${activeConversation.nombre}`}>
              {activeThread.map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${message.remitente === 'maria' ? 'message-bubble--maria' : 'message-bubble--carolina'}`}
                >
                  <p>{message.texto}</p>
                  <span>{message.hora}</span>
                </div>
              ))}
            </div>

            <div className="messages-sheet__composer">
              <input
                className="field__input"
                type="text"
                placeholder="Escribir mensaje…"
                value={conversationDraft}
                onChange={(event) => setConversationDraft(event.target.value)}
              />
              <Button type="button" onClick={handleConversationSend} disabled={!conversationDraft.trim()}>
                Enviar
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {composeConversation ? (
        <div className="activity-modal-backdrop" role="presentation" onClick={closeSheets}>
          <div
            className="activity-modal-sheet task-modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mensajes-nuevo-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-modal-sheet__handle" aria-hidden="true" />
            <h4 id="mensajes-nuevo-titulo" className="activity-modal-sheet__title">
              {`Nuevo mensaje para ${composeConversation.nombre}`}
            </h4>

            <p className="task-modal-sheet__helper">Enviá un mensaje breve para coordinar el cuidado.</p>

            <label className="field">
              <span className="field__label">Mensaje</span>
              <textarea
                className="field__textarea"
                rows={4}
                placeholder="Escribir mensaje…"
                value={composeDraft}
                onChange={(event) => setComposeDraft(event.target.value)}
              />
            </label>

            <div className="task-modal-sheet__actions">
              <Button type="button" fullWidth onClick={handleComposeSend} disabled={!composeDraft.trim()}>
                Enviar
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={closeSheets}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
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

function getConversationIdFromName(name?: string) {
  if (!name) return null;

  const target = normalizeText(name);
  const match = INITIAL_CONVERSATIONS.find((conversation) => normalizeText(conversation.nombre) === target);
  return match?.id ?? null;
}

function getConversationNameById(id: string) {
  const match = INITIAL_CONVERSATIONS.find((conversation) => conversation.id === id);
  return match?.nombre ?? 'Carolina';
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
