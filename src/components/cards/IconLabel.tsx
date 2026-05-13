import type { ReactNode } from 'react';

interface IconLabelProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

export function IconLabel({ icon, label, className = '' }: IconLabelProps) {
  return (
    <span className={`icon-label ${className}`.trim()}>
      <span className="icon-label__icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
}
