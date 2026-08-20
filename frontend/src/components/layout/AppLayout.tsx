import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white dark:bg-gray-900 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 animate-fade-in border-r bg-white dark:bg-gray-900">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
