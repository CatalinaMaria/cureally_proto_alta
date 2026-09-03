import type { Activity, Alert, CareMember, DailyReport, DemoUser, Patient, StockItem, StockMovement, Task } from '../types/domain';

export const CARINA_MEMBER_ID = 'cm-carina';
export const MARIA_MEMBER_ID = 'cm-maria';
export const PEDRO_MEMBER_ID = 'cm-pedro';
export const DIEGO_MEMBER_ID = 'cm-diego';
export const DEMO_TODAY = '2026-05-13';

export const patient: Patient = {
  id: 'patient-juan',
  nombre: 'Juan Pérez',
  edad: 76,
  diagnostico: 'Alzheimer',
  alergias: 'No conocidas',
};

export const careNetwork: CareMember[] = [
  { id: CARINA_MEMBER_ID, nombre: 'Carina', rol: 'Hija · Familiar responsable', tipo: 'family' },
  { id: DIEGO_MEMBER_ID, nombre: 'Diego', rol: 'Hijo · Familiar', tipo: 'family' },
  { id: MARIA_MEMBER_ID, nombre: 'María', rol: 'Cuidadora profesional', tipo: 'caregiver' },
  { id: PEDRO_MEMBER_ID, nombre: 'Pedro', rol: 'Cuidador profesional', tipo: 'caregiver' },
];

export const demoUsers: DemoUser[] = [
  {
    id: 'user-carina',
    nombre: 'Carina',
    email: 'carina@cureally.com',
    role: 'family',
    careMemberId: CARINA_MEMBER_ID,
    descripcion: 'Supervisa y coordina el cuidado de Juan.',
    isCoordinator: true,
  },
  {
    id: 'user-diego',
    nombre: 'Diego',
    email: 'diego@cureally.com',
    role: 'family',
    careMemberId: DIEGO_MEMBER_ID,
    descripcion: 'Participa y colabora con la red de cuidado.',
  },
  {
    id: 'user-maria',
    nombre: 'María',
    email: 'maria@cureally.com',
    role: 'caregiver',
    careMemberId: MARIA_MEMBER_ID,
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
    responsableId: MARIA_MEMBER_ID,
    stockItemId: 'stock-memantina',
  },
  {
    id: 'act-2',
    fecha: '2026-05-13',
    hora: '13:30',
    titulo: 'Aspirina 100 mg',
    categoria: 'medicacion',
    estado: 'pendiente',
    responsableId: PEDRO_MEMBER_ID,
    stockItemId: 'stock-aspirina',
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
    responsableId: MARIA_MEMBER_ID,
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
    responsableId: MARIA_MEMBER_ID,
    descripcion: 'Administrar la medicación indicada luego del desayuno.',
    ultimaActualizacion: 'Aún no confirmada por la persona responsable.',
  },
  {
    id: 'task-2',
    titulo: 'Acompañar a consulta médica',
    estado: 'pendiente',
    franja: 'tarde',
    responsableId: PEDRO_MEMBER_ID,
    descripcion: 'Coordinar traslado y acompañamiento para el control médico de la tarde.',
    ultimaActualizacion: 'Se solicitó confirmación a la persona responsable.',
  },
  {
    id: 'task-3',
    titulo: 'Preparar almuerzo',
    estado: 'confirmada',
    franja: 'tarde',
    responsableId: MARIA_MEMBER_ID,
    descripcion: 'Preparar un almuerzo liviano según las recomendaciones médicas.',
    ultimaActualizacion: 'Confirmada por la persona responsable a las 12:10 PM.',
  },
];

export const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    tipo: 'falta_confirmacion',
    titulo: 'Medicación sin confirmar',
    descripcion: 'María aún no confirmó Memantina 20 mg de las 8:00 AM.',
    hora: '08:00 AM',
    severidad: 'alta',
    confirmada: false,
    responsableId: MARIA_MEMBER_ID,
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
    descripcion: 'María cargó el informe diario de la mañana.',
    hora: '11:45 AM',
    severidad: 'baja',
    confirmada: false,
    responsableId: MARIA_MEMBER_ID,
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
  id: 'report-initial-maria',
  fecha: '2026-05-13',
  cuidadorId: MARIA_MEMBER_ID,
  turno: 'manana',
  observaciones: 'Juan estuvo de buen ánimo durante la mañana.',
  checks: ['Medicación de la mañana confirmada', 'Hidratación verificada', 'Descanso posterior al almuerzo'],
};

export const initialStockItems: StockItem[] = [
  { id: 'stock-memantina', categoria: 'medicacion', nombre: 'Memantina 20 mg', cantidad: 5, unidad: 'dosis' },
  { id: 'stock-aspirina', categoria: 'medicacion', nombre: 'Aspirina 100 mg', cantidad: 12, unidad: 'dosis' },
  { id: 'stock-panales', categoria: 'insumo', nombre: 'Pañales', cantidad: 2, unidad: 'unidades' },
  { id: 'stock-gasas', categoria: 'insumo', nombre: 'Gasas', cantidad: 24, unidad: 'unidades' },
];

export const initialStockMovements: StockMovement[] = [
  { id: 'move-1', stockItemId: 'stock-memantina', cantidad: 30, tipo: 'reposicion', actorId: CARINA_MEMBER_ID, registradaEn: 'Ayer' },
  { id: 'move-2', stockItemId: 'stock-panales', cantidad: 20, tipo: 'reposicion', actorId: DIEGO_MEMBER_ID, registradaEn: 'Hace 2 días' },
];
