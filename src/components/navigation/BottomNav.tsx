import { NavLink } from 'react-router-dom';
import { AppIcon, type AppIconName } from '../feedback/AppIcon';

const navItems = [
  { to: '/home', label: 'Inicio', icon: 'home' as AppIconName },
  { to: '/messages', label: 'Mensajes', icon: 'messages' as AppIconName },
  { to: '/alerts', label: 'Alertas', icon: 'alerts' as AppIconName },
  { to: '/profile', label: 'Perfil', icon: 'profile' as AppIconName },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            <AppIcon name={item.icon} width={18} height={18} />
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
