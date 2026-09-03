import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth, RequireRole } from './auth';
import { AppShell } from '../components/layout/AppShell';
import { LoginScreen } from '../features/auth/LoginScreen';
import { WelcomeScreen } from '../features/welcome/WelcomeScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { CalendarScreen } from '../features/calendar/CalendarScreen';
import { CalendarAddActivityScreen } from '../features/calendar/CalendarAddActivityScreen';
import { TasksScreen } from '../features/tasks/TasksScreen';
import { AlertsScreen } from '../features/alerts/AlertsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { MessagesScreen } from '../features/messages/MessagesScreen';
import { MessagesConversationScreen } from '../features/messages/MessagesConversationScreen';
import { ReportsScreen } from '../features/reports/ReportsScreen';
import { ReportDetailScreen } from '../features/reports/ReportDetailScreen';
import { StockScreen } from '../features/stock/StockScreen';
import { PatientProfileScreen } from '../features/patient/PatientProfileScreen';
import { CaregiverHomeScreen } from '../features/caregiver/CaregiverHomeScreen';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/messages" element={<MessagesScreen />} />
          <Route path="/messages/:conversationId" element={<MessagesConversationScreen />} />
          <Route path="/patient-profile" element={<PatientProfileScreen />} />

          <Route element={<RequireRole role="family" />}>
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/calendar" element={<CalendarScreen />} />
            <Route path="/calendar/add" element={<CalendarAddActivityScreen />} />
            <Route path="/tasks" element={<TasksScreen />} />
            <Route path="/alerts" element={<AlertsScreen />} />
            <Route path="/stock" element={<StockScreen />} />
            <Route path="/reports" element={<ReportsScreen />} />
            <Route path="/reports/:reportId" element={<ReportDetailScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>

          <Route element={<RequireRole role="caregiver" />}>
            <Route path="/caregiver/home" element={<CaregiverHomeScreen />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
