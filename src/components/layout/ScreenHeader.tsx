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
          <button className="icon-button" type="button" onClick={() => navigate(backTo)} aria-label="Volver">
            ←
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
