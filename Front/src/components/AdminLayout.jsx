import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, MessageSquare, MessagesSquare, Megaphone, BarChart3, Settings, Search, Bell, User, FolderTree, Layers, LifeBuoy } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { logout } from '../services/api';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/course-management', label: 'Course Management', icon: Layers },
  { to: '/admin/posts', label: 'Posts', icon: MessageSquare },
  { to: '/admin/feedback', label: 'Feedback', icon: MessagesSquare },
  { to: '/admin/help-sessions', label: 'Help Sessions', icon: LifeBuoy },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/Login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/Login');
    }
  };


  return (
    <div className="min-h-screen bg-[#FAF6F1] font-inter">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 h-16 w-full bg-white/90 backdrop-blur shadow-sm border-b border-[#F2E6E0]">
        <div className="flex items-center justify-between px-6 h-full">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-xl hover:bg-[#FFF8F2] transition-all duration-200" 
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5 text-[#D9433B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img src="/images/WAPP_Logo.png" alt="WAPP Logo" className="h-10 w-50" />
            
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-12 pr-4 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center gap-3">
            
            
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#FFF8F2] transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#D9433B] to-[#B13A33] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-[#F2E6E0] py-2 z-50">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#FFF8F2] transition-colors">Settings</button>
                  <hr className="my-2 border-[#F2E6E0]" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#FFF8F2] transition-colors text-[#D9433B]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed md:static inset-y-0 left-0 z-40 w-72 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out`}>
          <div className="h-full bg-white border-r border-[#F2E6E0] shadow-sm">
            {/* Mobile close button */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-[#F2E6E0]">
              <span className="font-ibarra text-lg font-bold text-[#D9433B]">Menu</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-[#FFF8F2] transition-all duration-200"
              >
                <svg className="w-5 h-5 text-[#D9433B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-[#D9433B] uppercase tracking-wider mb-3">Navigation</h2>
                <div className="space-y-1">
                  {navItems.map((item, index) => {
                    // If it's a section with sub-items
                    if (item.section) {
                      return (
                        <div key={index} className="mb-4">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                            {item.section}
                          </h3>
                          <div className="space-y-1">
                            {item.items.map(({ to, label, icon: Icon }) => (
                              <a
                                key={to}
                                href={to}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                  location.pathname === to
                                    ? 'bg-[#FFF0EE] text-[#D9433B] border-l-4 border-[#D9433B]'
                                    : 'text-gray-600 hover:bg-[#FFF8F2] hover:text-[#D9433B]'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium text-sm">{label}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // Regular single item
                    const { to, label, icon: Icon } = item;
                    return (
                      <a
                        key={to}
                        href={to}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          location.pathname === to
                            ? 'bg-[#FFF0EE] text-[#D9433B] border-l-4 border-[#D9433B]'
                            : 'text-gray-600 hover:bg-[#FFF8F2] hover:text-[#D9433B]'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
             

              {/* Page Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
