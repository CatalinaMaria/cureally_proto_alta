import { CAROLINA_MEMBER_ID, PEDRO_MEMBER_ID } from '../../data/mockData';

export type ConversationStatus = 'respondido' | 'pendiente' | 'nuevo';

export interface Conversation {
  id: string;
  titulo: string;
  subtitulo: string;
  ultimoMensaje: string;
  hora: string;
  estado: ConversationStatus;
  esGrupo?: boolean;
}

export interface ConversationMessage {
  id: string;
  remitente: string;
  tipoRemitente: 'family' | 'caregiver';
  texto: string;
  hora: string;
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-red-juan',
    titulo: 'Red de cuidado de Juan',
    subtitulo: 'María, Diego, Carolina y Pedro',
    ultimoMensaje: 'Carolina confirmó la medicación de la mañana.',
    hora: 'Hace 10 min',
    estado: 'nuevo',
    esGrupo: true,
  },
  {
    id: 'conv-carolina',
    titulo: 'Carolina',
    subtitulo: 'Cuidadora profesional',
    ultimoMensaje: 'Estuvo bien, desayunó y tomó la medicación.',
    hora: 'Hace 24 min',
    estado: 'nuevo',
  },
  {
    id: 'conv-pedro',
    titulo: 'Pedro',
    subtitulo: 'Cuidador profesional',
    ultimoMensaje: 'Quedo atento para el turno de la tarde.',
    hora: 'Hace 1 h',
    estado: 'pendiente',
  },
];

export const CONVERSATION_THREADS: Record<string, ConversationMessage[]> = {
  'conv-red-juan': [
    {
      id: 'g-msg-1',
      remitente: 'Carolina',
      tipoRemitente: 'caregiver',
      texto: 'Juan tomó la medicación de la mañana después del desayuno.',
      hora: '08:20',
    },
    {
      id: 'g-msg-2',
      remitente: 'María',
      tipoRemitente: 'family',
      texto: 'Gracias, Carolina.',
      hora: '08:22',
    },
    {
      id: 'g-msg-3',
      remitente: 'Diego',
      tipoRemitente: 'family',
      texto: 'Perfecto, yo paso a comprar los pañales.',
      hora: '08:25',
    },
    {
      id: 'g-msg-4',
      remitente: 'Pedro',
      tipoRemitente: 'caregiver',
      texto: 'Quedo atento para el turno de la tarde.',
      hora: '08:27',
    },
  ],
  'conv-carolina': [
    {
      id: 'c-msg-1',
      remitente: 'María',
      tipoRemitente: 'family',
      texto: 'Hola Carolina, ¿me confirmás cómo estuvo Juan esta mañana?',
      hora: '08:12',
    },
    {
      id: 'c-msg-2',
      remitente: 'Carolina',
      tipoRemitente: 'caregiver',
      texto: 'Estuvo bien, desayunó y tomó la medicación.',
      hora: '08:19',
    },
    {
      id: 'c-msg-3',
      remitente: 'María',
      tipoRemitente: 'family',
      texto: 'Gracias.',
      hora: '08:21',
    },
  ],
  'conv-pedro': [
    {
      id: 'p-msg-1',
      remitente: 'María',
      tipoRemitente: 'family',
      texto: 'Pedro, ¿podés confirmar si ya está listo el traslado para la consulta?',
      hora: '09:12',
    },
    {
      id: 'p-msg-2',
      remitente: 'Pedro',
      tipoRemitente: 'caregiver',
      texto: 'Sí, traslado coordinado. Quedo atento para el turno de la tarde.',
      hora: '09:18',
    },
  ],
};

export function getConversationById(conversationId: string) {
  return CONVERSATIONS.find((conversation) => conversation.id === conversationId) ?? null;
}

export function getConversationIdFromName(name?: string) {
  if (!name) return null;

  const target = normalizeText(name);
  const match = CONVERSATIONS.find((conversation) => normalizeText(conversation.titulo) === target);
  return match?.id ?? null;
}

export function getConversationIdForMember(memberId?: string) {
  if (memberId === CAROLINA_MEMBER_ID) return 'conv-carolina';
  if (memberId === PEDRO_MEMBER_ID) return 'conv-pedro';
  return 'conv-red-juan';
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
