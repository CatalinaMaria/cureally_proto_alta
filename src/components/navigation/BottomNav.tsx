import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/home', label: 'Inicio', icon: '⌂' },
  { to: '/tasks', label: 'Tareas', icon: '✓' },
  { to: '/alerts', label: 'Alertas', icon: '!' },
  { to: '/profile', label: 'Perfil', icon: '◯' },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
