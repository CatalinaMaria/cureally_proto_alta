import type { ReactNode } from 'react';

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-frame">
      <div className="mobile-frame__inner">{children}</div>
    </div>
  );
}
