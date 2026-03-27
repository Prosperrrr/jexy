import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ScissorsLineDashed, SlidersHorizontal, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    displayName: 'User',
    photoURL: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          photoURL: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email || 'User')}&background=random`,
        });
      } else {
        // Only redirect if they aren't on auth pages if you prefer, but usually layout protections handle this.
        // Leaving it here as an extra safety measure.
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Track Separation', path: '/track-separation', icon: ScissorsLineDashed },
    { name: 'Audio Enhancer', path: '/audio-enhancer', icon: SlidersHorizontal },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen flex-col fixed left-0 top-0 z-50">
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
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${isActive
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
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center space-x-3 truncate">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-slate-500 font-semibold text-sm">
                    {user.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <span className="font-display font-semibold text-sm text-slate-900 truncate max-w-[100px]">
                {user.displayName || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout} 
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Top Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 flex justify-between items-center h-16 px-5 z-50">
        <Link to="/" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20 M17 5v14 M22 10v4 M7 5v14 M2 10v4" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight">jexy</span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-slate-100">
                <span className="text-slate-500 font-semibold text-sm">
                  {user.displayName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-1.5 rounded-md"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-display text-[10px] font-medium truncate max-w-[80px] text-center">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
