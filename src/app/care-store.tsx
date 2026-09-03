import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { careNetwork, DEMO_TODAY, initialActivities, initialAlerts, initialDailyReport, initialStockItems, initialStockMovements, initialTasks, patient } from '../data/mockData';
import type { Activity, Alert, CareUpdate, DailyReport, MedicationRecord, Patient, StockItem, StockMovement, Task, TaskShift } from '../types/domain';

interface CareStoreValue {
  patient: Patient;
  activities: Activity[];
  tasks: Task[];
  alerts: Alert[];
  dailyReport: DailyReport;
  caregiverReports: DailyReport[];
  medicationRecords: MedicationRecord[];
  careUpdates: CareUpdate[];
  stockItems: StockItem[];
  stockMovements: StockMovement[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'estado'>) => void;
  requestTaskConfirmation: (taskId: string) => void;
  updateTaskResponsible: (taskId: string, responsableId: string) => void;
  completeTask: (taskId: string, caregiverId: string) => boolean;
  recordMedication: (activityId: string, caregiverId: string) => boolean;
  addCareUpdate: (caregiverId: string, texto: string) => void;
  submitDailyReport: (caregiverId: string, turno: TaskShift, observaciones: string, checks: string[]) => void;
  registerStockReplenishment: (actorId: string, stockItemId: string, cantidad: number, observacion?: string) => boolean;
  reportStockShortage: (actorId: string, stockItemId: string) => boolean;
  confirmAlert: (alertId: string) => void;
}

const CareStoreContext = createContext<CareStoreValue | null>(null);

export function CareStoreProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [dailyReport] = useState<DailyReport>(initialDailyReport);
  const [caregiverReports, setCaregiverReports] = useState<DailyReport[]>([]);
  const [medicationRecords, setMedicationRecords] = useState<MedicationRecord[]>([]);
  const [careUpdates, setCareUpdates] = useState<CareUpdate[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-13');

  const value = useMemo<CareStoreValue>(
    () => ({
      patient,
      activities,
      tasks,
      alerts,
      dailyReport,
      caregiverReports,
      medicationRecords,
      careUpdates,
      stockItems,
      stockMovements,
      selectedDate,
      setSelectedDate,
      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: `act-${Date.now()}`,
          estado: 'pendiente',
        };
        setActivities((prev) => [...prev, newActivity]);
      },
      requestTaskConfirmation: (taskId) => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId && task.estado === 'sin_confirmar' ? { ...task, estado: 'pendiente' } : task,
          ),
        );
      },
      updateTaskResponsible: (taskId, responsableId) => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  responsableId,
                  ultimaActualizacion: 'Responsable actualizado por la familiar responsable.',
                }
              : task,
          ),
        );
      },
      completeTask: (taskId, caregiverId) => {
        const task = tasks.find((candidate) => candidate.id === taskId);
        if (!task || task.responsableId !== caregiverId || task.estado === 'confirmada') return false;

        setTasks((prev) =>
          prev.map((candidate) =>
            candidate.id === taskId
              ? {
                  ...candidate,
                  estado: 'confirmada',
                  completadaPorId: caregiverId,
                  completadaEn: 'Ahora',
                  ultimaActualizacion: 'Marcada como realizada por la persona responsable.',
                }
              : candidate,
          ),
        );
        return true;
      },
      recordMedication: (activityId, caregiverId) => {
        const activity = activities.find((candidate) => candidate.id === activityId);
        if (
          !activity ||
          activity.categoria !== 'medicacion' ||
          activity.responsableId !== caregiverId ||
          activity.estado === 'completada'
        ) {
          return false;
        }

        setActivities((prev) =>
          prev.map((candidate) =>
            candidate.id === activityId ? { ...candidate, estado: 'completada' } : candidate,
          ),
        );
        setMedicationRecords((prev) => [
          {
            id: `med-record-${Date.now()}`,
            activityId,
            cuidadorId: caregiverId,
            registradaEn: 'Ahora',
          },
          ...prev,
        ]);
        if (activity.stockItemId) {
          setStockItems((prev) => prev.map((item) => item.id === activity.stockItemId ? { ...item, cantidad: Math.max(0, item.cantidad - 1) } : item));
          setStockMovements((prev) => [{ id: `move-${Date.now()}`, stockItemId: activity.stockItemId!, cantidad: -1, tipo: 'administracion', actorId: caregiverId, registradaEn: 'Ahora' }, ...prev]);
        }
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.tipo === 'falta_confirmacion' && alert.responsableId === caregiverId
              ? { ...alert, confirmada: true }
              : alert,
          ),
        );
        return true;
      },
      addCareUpdate: (caregiverId, texto) => {
        const normalizedText = texto.trim();
        if (!normalizedText) return;
        setCareUpdates((prev) => [
          {
            id: `update-${Date.now()}`,
            cuidadorId: caregiverId,
            texto: normalizedText,
            registradaEn: 'Ahora',
          },
          ...prev,
        ]);
      },
      submitDailyReport: (caregiverId, turno, observaciones, checks) => {
        setCaregiverReports((prev) => [
          {
            id: `report-${Date.now()}`,
            fecha: DEMO_TODAY,
            cuidadorId: caregiverId,
            turno,
            observaciones: observaciones.trim(),
            checks,
          },
          ...prev,
        ]);
      },
      registerStockReplenishment: (actorId, stockItemId, cantidad, observacion) => {
        const actor = careNetwork.find((member) => member.id === actorId);
        const itemExists = stockItems.some((item) => item.id === stockItemId);
        if (!actor || !itemExists || cantidad <= 0) return false;
        setStockItems((prev) => prev.map((item) => item.id === stockItemId ? { ...item, cantidad: item.cantidad + cantidad } : item));
        setStockMovements((prev) => [{ id: `move-${Date.now()}`, stockItemId, cantidad, tipo: 'reposicion', actorId, observacion: observacion?.trim() || undefined, registradaEn: 'Ahora' }, ...prev]);
        return true;
      },
      reportStockShortage: (actorId, stockItemId) => {
        const actor = careNetwork.find((member) => member.id === actorId);
        const item = stockItems.find((candidate) => candidate.id === stockItemId);
        if (!actor || actor.tipo !== 'caregiver' || !item) return false;

        setAlerts((prev) => [
          {
            id: `alert-stock-${Date.now()}`,
            tipo: 'stock_bajo',
            titulo: `Faltante de ${item.nombre}`,
            descripcion: `${actor.nombre} señaló que quedan ${item.cantidad} ${item.unidad}.`,
            hora: 'Ahora',
            severidad: item.cantidad <= 2 ? 'alta' : 'media',
            confirmada: false,
            responsableId: actorId,
          },
          ...prev,
        ]);
        return true;
      },
      confirmAlert: (alertId) => {
        setAlerts((prev) =>
          prev.map((alert) => (alert.id === alertId ? { ...alert, confirmada: true } : alert)),
        );
      },
    }),
    [activities, alerts, careUpdates, caregiverReports, dailyReport, medicationRecords, selectedDate, stockItems, stockMovements, tasks],
  );

  return <CareStoreContext.Provider value={value}>{children}</CareStoreContext.Provider>;
}

export function useCareStore() {
  const context = useContext(CareStoreContext);
  if (!context) {
    throw new Error('useCareStore debe utilizarse dentro de CareStoreProvider');
  }

  return context;
}
