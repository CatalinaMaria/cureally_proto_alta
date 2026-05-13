import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth';
import { AppShell } from '../components/layout/AppShell';
import { LoginScreen } from '../features/auth/LoginScreen';
import { WelcomeScreen } from '../features/welcome/WelcomeScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { CalendarScreen } from '../features/calendar/CalendarScreen';
import { TasksScreen } from '../features/tasks/TasksScreen';
import { AlertsScreen } from '../features/alerts/AlertsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/calendar" element={<CalendarScreen />} />
          <Route path="/tasks" element={<TasksScreen />} />
          <Route path="/alerts" element={<AlertsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
