import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Sidebar({ open, onClose, navItems }) {
  return (
    <div className={`fixed md:static inset-y-0 left-0 z-40 w-72 transform ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-200 ease-in-out` }>
  <div className="h-full bg-white/80 backdrop-blur border-r" style={{ borderColor: 'var(--beige)' }}>
        <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-rose-100 md:hidden">
          <span className="font-semibold text-rose-600">Menu</span>
          <button onClick={onClose} aria-label="Close sidebar" className="p-2 rounded-lg hover:bg-rose-50">
            <X className="h-5 w-5 text-rose-500" />
          </button>
        </div>
        <div className="px-4 pt-4 pb-2 hidden md:block">
          <div className="text-xs uppercase tracking-wide" style={{ color: '#d17b73' }}>Navigation</div>
        </div>
        <nav className="py-2 px-3 md:px-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1.5 transition-all ${isActive ? 'bg-rose-100/80 text-rose-700 shadow-sm' : 'text-rose-500 hover:bg-rose-50 hover:text-rose-600'}`}
              onClick={onClose}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
