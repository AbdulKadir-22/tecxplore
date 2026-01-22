import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, User, Shield, LayoutDashboard } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:px-4 rounded-lg transition-colors ${
      active ? 'text-cyan-400 md:bg-cyan-900/20' : 'text-gray-400 hover:text-gray-200'
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px] md:text-sm font-medium">{label}</span>
  </Link>
);

const Layout = ({ children }) => {
  const { currentUser } = useApp();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-100 flex flex-col">
      {/* DESKTOP TOP NAV */}
      <header className="hidden md:flex h-16 border-b border-gray-800 bg-[#0f172a] px-6 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">T</div>
          <div>
            <h1 className="font-bold tracking-wide text-sm">TECXPLORE 3.0</h1>
            <p className="text-gray-500 text-xs">CONTROL CONSOLE</p>
          </div>
        </div>
        
        <nav className="flex gap-2">
          {/* 1. Standard Dashboard (For Everyone) */}
          <NavItem to="/dashboard" icon={Home} label="Dashboard" active={path === '/dashboard'} />

          {/* 2. Admin Console (Only for Admins) */}
          {currentUser?.role === 'SYSTEM_ADMIN' && (
            <NavItem 
              to="/admin/dashboard" 
              icon={Shield} 
              label="Admin Console" 
              active={path.startsWith('/admin')} 
            />
          )}

          <NavItem to="/moderator" icon={User} label="Profile" active={path === '/moderator'} />
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 pb-20 md:pb-8 overflow-y-auto">
        {children}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f172a] border-t border-gray-800 flex justify-around items-center px-2 z-50">
        <NavItem to="/dashboard" icon={Home} label="Home" active={path === '/dashboard'} />
        
        {currentUser?.role === 'SYSTEM_ADMIN' && (
          <NavItem to="/admin/dashboard" icon={Shield} label="Admin" active={path.startsWith('/admin')} />
        )}

        <NavItem to="/moderator" icon={User} label="Profile" active={path === '/moderator'} />
      </nav>
    </div>
  );
};

export default Layout;