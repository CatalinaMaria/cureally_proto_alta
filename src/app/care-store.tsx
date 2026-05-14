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
  addActivity: (activity: Omit<Activity, 'id' | 'estado'>) => void;
  requestTaskConfirmation: (taskId: string) => void;
  confirmAlert: (alertId: string) => void;
}

const CareStoreContext = createContext<CareStoreValue | null>(null);

export function CareStoreProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [dailyReport] = useState<DailyReport>(initialDailyReport);
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-13');

  const value = useMemo<CareStoreValue>(
    () => ({
      patient,
      activities,
      tasks,
      alerts,
      dailyReport,
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
      confirmAlert: (alertId) => {
        setAlerts((prev) =>
          prev.map((alert) => (alert.id === alertId ? { ...alert, confirmada: true } : alert)),
        );
      },
    }),
    [activities, alerts, dailyReport, selectedDate, tasks],
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
