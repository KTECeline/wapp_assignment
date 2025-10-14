import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return (
  <div className="sticky top-0 z-30 h-16 w-full bg-white/80 backdrop-blur shadow-sm flex items-center px-4 md:px-6" style={{ borderBottom: '1px solid var(--beige)' }}>
      <button className="md:hidden mr-3 p-2 rounded-lg hover:bg-rose-50" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu className="h-5 w-5 text-rose-500" />
      </button>
      <div className="flex items-center gap-2">
        <img src="/images/WAPP_Logo.png" alt="WAPP Logo" className="h-12 w-12" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-rose-50 transition-colors" aria-label="Notifications">
          <Bell className="h-5 w-5 text-rose-500" />
        </button>
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(v=>!v)} className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-rose-100 border" style={{ borderColor: 'var(--beige)' }} aria-haspopup="menu" aria-expanded={open} />
          {open && (
            <div role="menu" className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-md border border-rose-100 py-1">
              <button role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-rose-50">Profile</button>
              <button role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-rose-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
