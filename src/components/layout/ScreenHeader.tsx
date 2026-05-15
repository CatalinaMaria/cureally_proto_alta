import { useNavigate } from 'react-router-dom';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  backTo = '/home',
  actionLabel,
  onAction,
}: ScreenHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="screen-header">
      <div className="screen-header__main">
        {showBack ? (
          <button className="icon-button screen-header__back-button" type="button" onClick={() => navigate(backTo)} aria-label="Volver a inicio">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14.5 6.5L9 12l5.5 5.5" />
              <path d="M9 12h8.5" />
            </svg>
          </button>
        ) : null}
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {actionLabel && onAction ? (
        <button type="button" className="text-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
}
