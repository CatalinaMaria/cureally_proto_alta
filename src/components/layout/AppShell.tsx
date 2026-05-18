import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '../navigation/BottomNav';
import { MobileFrame } from './MobileFrame';
import { PatientContextStrip } from './PatientContextStrip';

export function AppShell() {
  const location = useLocation();
  const contentRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <MobileFrame>
      <div className="app-shell">
        <PatientContextStrip />
        <main ref={contentRef} className="app-shell__content" aria-live="polite">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </MobileFrame>
  );
}
