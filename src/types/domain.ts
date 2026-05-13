export interface DemoCredentials {
  email: string;
  password: string;
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
}

export type ActivityCategory = 'medicacion' | 'consulta' | 'tarea';
export type ActivityStatus = 'pendiente' | 'completada';

export interface Activity {
  id: string;
  fecha: string;
  hora: string;
  titulo: string;
  categoria: ActivityCategory;
  estado: ActivityStatus;
}

export type TaskStatus = 'pendiente' | 'completada';
export type TaskShift = 'manana' | 'tarde' | 'noche';

export interface Task {
  id: string;
  titulo: string;
  estado: TaskStatus;
  franja?: TaskShift;
}

export type AlertSeverity = 'alta' | 'media' | 'baja';

export interface Alert {
  id: string;
  titulo: string;
  hora: string;
  severidad: AlertSeverity;
  confirmada: boolean;
}

export interface DailyReport {
  fecha: string;
  observaciones: string;
  checks: string[];
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
