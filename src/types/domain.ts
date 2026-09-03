export interface DemoCredentials {
  email: string;
  password: string;
}

export type UserRole = 'family' | 'caregiver';

export interface DemoUser {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  careMemberId: string;
  descripcion: string;
  isCoordinator?: boolean;
}

export interface Patient {
  id: string;
  nombre: string;
  edad: number;
  diagnostico: string;
  alergias: string;
}

export interface CareMember {
  id: string;
  nombre: string;
  rol: string;
  tipo: 'family' | 'caregiver';
}

export type ActivityCategory = 'medicacion' | 'consulta' | 'tarea';
export type ActivityStatus = 'pendiente' | 'completada';
export type ActivityRecurrence = 'una_vez' | 'todos_los_dias' | 'semanal' | 'personalizado';
export type ActivityDuration = 'indefinida' | 'hasta_fecha';

export interface Activity {
  id: string;
  fecha: string;
  hora: string;
  titulo: string;
  categoria: ActivityCategory;
  estado: ActivityStatus;
  responsableId?: string;
  nota?: string;
  repeticion?: ActivityRecurrence;
  duracion?: ActivityDuration;
  fechaFinalizacion?: string;
  stockItemId?: string;
}

export type StockCategory = 'medicacion' | 'insumo';

export interface StockItem {
  id: string;
  categoria: StockCategory;
  nombre: string;
  cantidad: number;
  unidad: string;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  cantidad: number;
  tipo: 'reposicion' | 'administracion';
  actorId: string;
  observacion?: string;
  registradaEn: string;
}

export type TaskStatus = 'sin_confirmar' | 'confirmada' | 'pendiente';
export type TaskShift = 'manana' | 'tarde' | 'noche';

export interface Task {
  id: string;
  titulo: string;
  estado: TaskStatus;
  responsableId: string;
  franja?: TaskShift;
  hora?: string;
  descripcion?: string;
  ultimaActualizacion?: string;
  completadaPorId?: string;
  completadaEn?: string;
}

export type AlertSeverity = 'alta' | 'media' | 'baja';
export type AlertType = 'falta_confirmacion' | 'turno_proximo' | 'informe_nuevo' | 'stock_bajo';

export interface Alert {
  id: string;
  tipo: AlertType;
  titulo: string;
  descripcion: string;
  hora: string;
  severidad: AlertSeverity;
  confirmada: boolean;
  responsableId?: string;
}

export interface DailyReport {
  id: string;
  fecha: string;
  cuidadorId: string;
  turno: TaskShift;
  observaciones: string;
  checks: string[];
}

export interface MedicationRecord {
  id: string;
  activityId: string;
  cuidadorId: string;
  registradaEn: string;
}

export interface CareUpdate {
  id: string;
  cuidadorId: string;
  texto: string;
  registradaEn: string;
}

export interface AppState {
  auth: {
    isAuthenticated: boolean;
  };
  fechaSeleccionada: string;
  tareas: Task[];
  alertas: Alert[];
  reporteDiario: DailyReport;
}
