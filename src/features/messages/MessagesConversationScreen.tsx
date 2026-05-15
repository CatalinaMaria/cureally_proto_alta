import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '../../components/forms/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { CONVERSATION_THREADS, getConversationById, type ConversationMessage } from './messagesData';

export function MessagesConversationScreen() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const conversation = conversationId ? getConversationById(conversationId) : null;

  if (!conversation || !conversationId) {
    return <Navigate to="/messages" replace />;
  }

  return <MessagesConversationContent key={conversationId} conversationId={conversationId} conversation={conversation} />;
}

function MessagesConversationContent({
  conversationId,
  conversation,
}: {
  conversationId: string;
  conversation: NonNullable<ReturnType<typeof getConversationById>>;
}) {
  const [messages, setMessages] = useState<ConversationMessage[]>(() => [...(CONVERSATION_THREADS[conversationId] ?? [])]);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        remitente: 'María',
        tipoRemitente: 'maria',
        texto: content,
        hora: 'Ahora',
      },
    ]);
    setDraft('');
  };

  const chatAriaLabel = `${conversation.esGrupo ? 'Conversación grupal' : 'Conversación'}: ${conversation.titulo}`;

  return (
    <section className="screen messages-chat-page">
      <ScreenHeader title={conversation.titulo} subtitle={conversation.subtitulo} showBack backTo="/messages" />

      <div className="messages-chat-thread" aria-label={chatAriaLabel}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble ${message.tipoRemitente === 'maria' ? 'message-bubble--maria' : 'message-bubble--carolina'}`}
          >
            {message.tipoRemitente !== 'maria' ? <p className="message-bubble__sender">{message.remitente}</p> : null}
            <p>{message.texto}</p>
            <span>{message.hora}</span>
          </div>
        ))}
      </div>

      <div className="messages-chat-composer">
        <input
          className="field__input"
          type="text"
          placeholder="Escribir mensaje…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button type="button" onClick={handleSend} disabled={!draft.trim()}>
          Enviar
        </Button>
      </div>
    </section>
  );
}
