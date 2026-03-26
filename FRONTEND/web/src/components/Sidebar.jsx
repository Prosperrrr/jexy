import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ScissorsLineDashed, SlidersHorizontal } from 'lucide-react';

const Sidebar = () => {
  // Use mock user for now per instructions
  const user = {
    displayName: 'Sobamiwa Prosper',
    photoURL: 'https://ui-avatars.com/api/?name=Sobamiwa+Prosper&background=random',
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Track Separation', path: '/track-separation', icon: ScissorsLineDashed },
    { name: 'Audio Enhancer', path: '/audio-enhancer', icon: SlidersHorizontal },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <Link to="/" className="p-6 flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
          {/* Custom waveform logo icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20 M17 5v14 M22 10v4 M7 5v14 M2 10v4" />
          </svg>
        </div>
        <span className="font-display font-bold text-xl text-slate-900 tracking-tight">jexy</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-display">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 px-2 py-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-slate-500 font-semibold text-sm">
                {user.displayName?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <span className="font-display font-semibold text-sm text-slate-900 truncate">
            {user.displayName || 'User'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
