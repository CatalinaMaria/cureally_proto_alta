import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { initialActivities, initialAlerts, initialDailyReport, initialTasks, patient } from '../data/mockData';
import type { Activity, Alert, DailyReport, Patient, Task } from '../types/domain';

interface CareStoreValue {
  patient: Patient;
  activities: Activity[];
  tasks: Task[];
  alerts: Alert[];
  dailyReport: DailyReport;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  confirmAlert: (alertId: string) => void;
  updateDailyReport: (notes: string) => void;
}

const CareStoreContext = createContext<CareStoreValue | null>(null);

export function CareStoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [dailyReport, setDailyReport] = useState<DailyReport>(initialDailyReport);
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-13');

  const value = useMemo<CareStoreValue>(
    () => ({
      patient,
      activities: initialActivities,
      tasks,
      alerts,
      dailyReport,
      selectedDate,
      setSelectedDate,
      toggleTaskStatus: (taskId) => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, estado: task.estado === 'pendiente' ? 'completada' : 'pendiente' }
              : task,
          ),
        );
      },
      confirmAlert: (alertId) => {
        setAlerts((prev) =>
          prev.map((alert) => (alert.id === alertId ? { ...alert, confirmada: true } : alert)),
        );
      },
      updateDailyReport: (notes) => {
        setDailyReport((prev) => ({ ...prev, observaciones: notes }));
      },
    }),
    [alerts, dailyReport, selectedDate, tasks],
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
