import type { SVGProps } from 'react';

export type AppIconName = 'home' | 'tasks' | 'messages' | 'alerts' | 'calendar' | 'profile' | 'reports';

interface AppIconProps extends SVGProps<SVGSVGElement> {
  name: AppIconName;
}

export function AppIcon({ name, ...props }: AppIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {name === 'home' ? (
        <>
          <path d="M3.5 10.5L12 4l8.5 6.5" />
          <path d="M6 9.5V20h12V9.5" />
        </>
      ) : null}
      {name === 'tasks' ? (
        <>
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <path d="M9 9h6" />
          <path d="M9 13h3" />
          <path d="M14.5 13.5l1.5 1.5 3-3" />
        </>
      ) : null}
      {name === 'messages' ? (
        <>
          <path d="M5 6.5h14a2 2 0 012 2v7a2 2 0 01-2 2h-8l-4 3v-3H5a2 2 0 01-2-2v-7a2 2 0 012-2z" />
          <path d="M8 10h8" />
          <path d="M8 13h5" />
        </>
      ) : null}
      {name === 'alerts' ? (
        <>
          <path d="M15.5 18H8.5a2.5 2.5 0 01-2.2-3.7l.9-1.7V10a4.8 4.8 0 019.6 0v2.6l.9 1.7A2.5 2.5 0 0115.5 18z" />
          <path d="M10 19.5a2 2 0 004 0" />
        </>
      ) : null}
      {name === 'calendar' ? (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3.5v3" />
          <path d="M16 3.5v3" />
          <path d="M4 9h16" />
          <path d="M8 13h3" />
        </>
      ) : null}
      {name === 'profile' ? (
        <>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 19a6.5 6.5 0 0113 0" />
        </>
      ) : null}
      {name === 'reports' ? (
        <>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 9h6" />
          <path d="M9 12.5h6" />
          <path d="M9 16h4.5" />
        </>
      ) : null}
    </svg>
  );
}
