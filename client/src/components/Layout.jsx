import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Box, LogOut, Home, Layers, ClipboardList, Settings, User } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/projects', label: 'Projects', icon: Layers },
  { path: '/tasks', label: 'Tasks', icon: ClipboardList },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-6 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sky-400 font-bold uppercase tracking-[0.2em]">Team Task</p>
              <h1 className="text-2xl font-semibold mt-3">Task Manager</h1>
            </div>
            <button className="md:hidden" onClick={() => setOpen(false)}>
              <Menu size={24} />
            </button>
          </div>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                      isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Box size={18} />
                Admin Panel
              </NavLink>
            )}
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="text-slate-400 mb-3">Signed in as</div>
          <div className="font-medium">{user?.name}</div>
          <div className="text-sm text-slate-500">{user?.email}</div>
          <button onClick={handleLogout} className="mt-5 inline-flex items-center gap-2 btn-secondary w-full justify-center">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-h-screen md:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur p-4 md:p-6 flex items-center justify-between">
          <button className="md:hidden p-2 rounded-2xl bg-slate-900" onClick={() => setOpen(!open)}>
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-lg font-semibold">Welcome back, {user?.name}</h2>
            <p className="text-sm text-slate-400">{user?.role === 'admin' ? 'Admin dashboard' : 'Team member workspace'}</p>
          </div>
        </header>

        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
