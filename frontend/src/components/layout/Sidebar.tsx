import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart3, CheckCircle2 } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-gray-400 dark:text-gray-600">
        <p>TaskFlow v1.0</p>
      </div>
    </div>
  );
}
