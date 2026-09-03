import { NavLink } from 'react-router-dom';
import { AppIcon, type AppIconName } from '../feedback/AppIcon';
import { useAuth } from '../../app/auth';

const familyNavItems = [
  { to: '/home', label: 'Inicio', icon: 'home' as AppIconName },
  { to: '/messages', label: 'Mensajes', icon: 'messages' as AppIconName },
  { to: '/alerts', label: 'Alertas', icon: 'alerts' as AppIconName },
  { to: '/profile', label: 'Perfil', icon: 'profile' as AppIconName },
];

const caregiverNavItems = [
  { to: '/caregiver/home', label: 'Inicio', icon: 'home' as AppIconName },
  { to: '/messages', label: 'Mensajes', icon: 'messages' as AppIconName },
];

export function BottomNav() {
  const { currentUser } = useAuth();
  const navItems = currentUser?.role === 'caregiver' ? caregiverNavItems : familyNavItems;

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
