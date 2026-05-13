import { Outlet } from 'react-router-dom';
import { BottomNav } from '../navigation/BottomNav';
import { MobileFrame } from './MobileFrame';
import { PatientContextStrip } from './PatientContextStrip';

export function AppShell() {
  return (
    <MobileFrame>
      <div className="app-shell">
        <PatientContextStrip />
        <main className="app-shell__content" aria-live="polite">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </MobileFrame>
  );
}
