import type { Activity, Alert, CareMember, DailyReport, DemoCredentials, Patient, Task } from '../types/domain';

export const demoCredentials: DemoCredentials = {
  email: 'maria@cureally.com',
  password: '123456',
};

export const caregiverName = 'María';

export const patient: Patient = {
  id: 'patient-juan',
  nombre: 'Juan Pérez',
  edad: 76,
  diagnostico: 'Alzheimer',
  alergias: 'No conocidas',
};

export const careNetwork: CareMember[] = [
  { id: 'cm-1', nombre: 'María', rol: 'Familiar responsable' },
  { id: 'cm-2', nombre: 'Carolina', rol: 'Cuidadora' },
  { id: 'cm-3', nombre: 'Juan', rol: 'Padre' },
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    fecha: '2026-05-13',
    hora: '08:00',
    titulo: 'Memantina 20 mg',
    categoria: 'medicacion',
    estado: 'pendiente',
  },
  {
    id: 'act-2',
    fecha: '2026-05-13',
    hora: '13:30',
    titulo: 'Aspirina 100 mg',
    categoria: 'medicacion',
    estado: 'pendiente',
  },
  {
    id: 'act-3',
    fecha: '2026-05-13',
    hora: '18:00',
    titulo: 'Consulta médica',
    categoria: 'consulta',
    estado: 'pendiente',
  },
  {
    id: 'act-4',
    fecha: '2026-05-14',
    hora: '09:00',
    titulo: 'Control de presión arterial',
    categoria: 'tarea',
    estado: 'pendiente',
  },
  {
    id: 'act-5',
    fecha: '2026-05-15',
    hora: '11:00',
    titulo: 'Revisión de historial médico',
    categoria: 'consulta',
    estado: 'pendiente',
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    titulo: 'Dar medicación de la mañana',
    estado: 'sin_confirmar',
    franja: 'manana',
    responsable: 'Carolina',
    descripcion: 'Administrar la medicación indicada luego del desayuno.',
    ultimaActualizacion: 'Aún no confirmada por la cuidadora.',
  },
  {
    id: 'task-2',
    titulo: 'Acompañar a consulta médica',
    estado: 'pendiente',
    franja: 'tarde',
    responsable: 'Carolina',
    descripcion: 'Coordinar traslado y acompañamiento para el control médico de la tarde.',
    ultimaActualizacion: 'Se solicitó confirmación a la cuidadora.',
  },
  {
    id: 'task-3',
    titulo: 'Preparar almuerzo',
    estado: 'confirmada',
    franja: 'tarde',
    responsable: 'Carolina',
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
  },
  {
    id: 'alert-2',
    tipo: 'turno_proximo',
    titulo: 'Turno médico próximo',
    descripcion: 'Juan tiene una consulta médica en 30 minutos.',
    hora: '05:30 PM',
    severidad: 'media',
    confirmada: false,
  },
  {
    id: 'alert-3',
    tipo: 'informe_nuevo',
    titulo: 'Nuevo informe disponible',
    descripcion: 'Carolina cargó el informe diario de la mañana.',
    hora: '11:45 AM',
    severidad: 'baja',
    confirmada: false,
  },
];

export const initialDailyReport: DailyReport = {
  fecha: '2026-05-13',
  observaciones: 'Paciente con buen ánimo durante la mañana.',
  checks: ['Medicación de la mañana confirmada', 'Hidratación verificada', 'Descanso posterior al almuerzo'],
};
