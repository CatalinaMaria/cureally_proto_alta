import type { Activity, Alert, CareMember, DailyReport, DemoUser, Patient, Task } from '../types/domain';

export const MARIA_MEMBER_ID = 'cm-maria';
export const CAROLINA_MEMBER_ID = 'cm-carolina';
export const PEDRO_MEMBER_ID = 'cm-pedro';
export const DIEGO_MEMBER_ID = 'cm-diego';

export const patient: Patient = {
  id: 'patient-juan',
  nombre: 'Juan Pérez',
  edad: 76,
  diagnostico: 'Alzheimer',
  alergias: 'No conocidas',
};

export const careNetwork: CareMember[] = [
  { id: MARIA_MEMBER_ID, nombre: 'María', rol: 'Familiar responsable', tipo: 'family' },
  { id: CAROLINA_MEMBER_ID, nombre: 'Carolina', rol: 'Cuidadora profesional', tipo: 'caregiver' },
  { id: PEDRO_MEMBER_ID, nombre: 'Pedro', rol: 'Cuidador profesional', tipo: 'caregiver' },
  { id: DIEGO_MEMBER_ID, nombre: 'Diego', rol: 'Hijo', tipo: 'family' },
];

export const demoUsers: DemoUser[] = [
  {
    id: 'user-maria',
    nombre: 'María',
    email: 'maria@cureally.com',
    role: 'family',
    careMemberId: MARIA_MEMBER_ID,
    descripcion: 'Supervisa y coordina el cuidado de Juan.',
  },
  {
    id: 'user-carolina',
    nombre: 'Carolina',
    email: 'carolina@cureally.com',
    role: 'caregiver',
    careMemberId: CAROLINA_MEMBER_ID,
    descripcion: 'Consulta y registra las tareas de su turno.',
  },
  {
    id: 'user-pedro',
    nombre: 'Pedro',
    email: 'pedro@cureally.com',
    role: 'caregiver',
    careMemberId: PEDRO_MEMBER_ID,
    descripcion: 'Consulta y registra las tareas de su turno.',
  },
];

export function getCareMember(memberId?: string) {
  return careNetwork.find((member) => member.id === memberId) ?? null;
}

export function getCareMemberName(memberId?: string) {
  return getCareMember(memberId)?.nombre ?? 'Sin asignar';
}

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    fecha: '2026-05-13',
    hora: '08:00',
    titulo: 'Memantina 20 mg',
    categoria: 'medicacion',
    estado: 'pendiente',
    responsableId: CAROLINA_MEMBER_ID,
  },
  {
    id: 'act-2',
    fecha: '2026-05-13',
    hora: '13:30',
    titulo: 'Aspirina 100 mg',
    categoria: 'medicacion',
    estado: 'pendiente',
    responsableId: CAROLINA_MEMBER_ID,
  },
  {
    id: 'act-3',
    fecha: '2026-05-13',
    hora: '18:00',
    titulo: 'Consulta médica',
    categoria: 'consulta',
    estado: 'pendiente',
    responsableId: PEDRO_MEMBER_ID,
  },
  {
    id: 'act-4',
    fecha: '2026-05-14',
    hora: '09:00',
    titulo: 'Control de presión arterial',
    categoria: 'tarea',
    estado: 'pendiente',
    responsableId: CAROLINA_MEMBER_ID,
  },
  {
    id: 'act-5',
    fecha: '2026-05-15',
    hora: '11:00',
    titulo: 'Revisión de historial médico',
    categoria: 'consulta',
    estado: 'pendiente',
    responsableId: PEDRO_MEMBER_ID,
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    titulo: 'Dar medicación de la mañana',
    estado: 'sin_confirmar',
    franja: 'manana',
    responsableId: CAROLINA_MEMBER_ID,
    descripcion: 'Administrar la medicación indicada luego del desayuno.',
    ultimaActualizacion: 'Aún no confirmada por la cuidadora.',
  },
  {
    id: 'task-2',
    titulo: 'Acompañar a consulta médica',
    estado: 'pendiente',
    franja: 'tarde',
    responsableId: CAROLINA_MEMBER_ID,
    descripcion: 'Coordinar traslado y acompañamiento para el control médico de la tarde.',
    ultimaActualizacion: 'Se solicitó confirmación a la cuidadora.',
  },
  {
    id: 'task-3',
    titulo: 'Preparar almuerzo',
    estado: 'confirmada',
    franja: 'tarde',
    responsableId: CAROLINA_MEMBER_ID,
    descripcion: 'Preparar un almuerzo liviano según las recomendaciones médicas.',
    ultimaActualizacion: 'Confirmada por la cuidadora a las 12:10 PM.',
  },
];

export const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    tipo: 'falta_confirmacion',
    titulo: 'Medicación sin confirmar',
    descripcion: 'Carolina aún no confirmó Memantina 20 mg de las 8:00 AM.',
    hora: '08:00 AM',
    severidad: 'alta',
    confirmada: false,
    responsableId: CAROLINA_MEMBER_ID,
  },
  {
    id: 'alert-2',
    tipo: 'turno_proximo',
    titulo: 'Turno médico próximo',
    descripcion: 'Juan tiene una consulta médica en 30 minutos.',
    hora: '05:30 PM',
    severidad: 'media',
    confirmada: false,
    responsableId: PEDRO_MEMBER_ID,
  },
  {
    id: 'alert-3',
    tipo: 'informe_nuevo',
    titulo: 'Nuevo informe disponible',
    descripcion: 'Carolina cargó el informe diario de la mañana.',
    hora: '11:45 AM',
    severidad: 'baja',
    confirmada: false,
    responsableId: CAROLINA_MEMBER_ID,
  },
  {
    id: 'alert-4',
    tipo: 'stock_bajo',
    titulo: 'Stock crítico de pañales',
    descripcion: 'Quedan 2 unidades. Se recomienda reponer hoy.',
    hora: '10:15 AM',
    severidad: 'alta',
    confirmada: false,
  },
];

export const initialDailyReport: DailyReport = {
  fecha: '2026-05-13',
  observaciones: 'Paciente con buen ánimo durante la mañana.',
  checks: ['Medicación de la mañana confirmada', 'Hidratación verificada', 'Descanso posterior al almuerzo'],
};
