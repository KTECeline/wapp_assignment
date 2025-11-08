import React from 'react';
import Card from '../../components/Card';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/api';
import { User, Bell, Shield, Palette, Database, LogOut } from 'lucide-react';

export default function Settings() {
  const { add } = useToast();
  const navigate = useNavigate();
  
  const onSave = (e) => { 
    e.preventDefault(); 
    add('Profile saved successfully!'); 
  };

  const onThemeToggle = () => {
    add('Theme preference updated');
  };

  const onLogout = async () => {
    try {
      await logout();
      add('Logged out successfully');
      navigate('/Login');
    } catch (error) {
      console.error('Logout failed:', error);
      add('Logout failed, but redirecting...');
      navigate('/Login');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card title="Profile Settings" subtitle="Manage your personal information">
        <form onSubmit={onSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Full Name</label>
              <input 
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                defaultValue="Admin User" 
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Email Address</label>
              <input 
                type="email"
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                defaultValue="admin@pastry.lab" 
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Current Password</label>
              <input 
                type="password" 
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Preferences" subtitle="Configure how you receive updates">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#FAF6F1] rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#D9433B]" />
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D9433B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D9433B]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FAF6F1] rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#D9433B]" />
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive browser notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#D9433B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D9433B]"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card title="Security Settings" subtitle="Manage your account security">
        <div className="space-y-4">
          <div className="p-4 bg-[#FAF6F1] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-[#D9433B]" />
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
            <button className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-4 py-2 font-medium transition-all duration-200">
              Enable 2FA
            </button>
          </div>

          <div className="p-4 bg-[#FAF6F1] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-[#D9433B]" />
              <h4 className="font-medium text-gray-900">Data Export</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Download a copy of your data</p>
            <button className="border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl px-4 py-2 font-medium transition-all duration-200">
              Export Data
            </button>
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card title="Appearance" subtitle="Customize your interface">
        <div className="flex items-center justify-between p-4 bg-[#FAF6F1] rounded-xl">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-[#D9433B]" />
            <div>
              <h4 className="font-medium text-gray-900">Dark Mode</h4>
              <p className="text-sm text-gray-600">Switch between light and dark themes</p>
            </div>
          </div>
          <button 
            onClick={onThemeToggle}
            className="border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl px-4 py-2 font-medium transition-all duration-200"
          >
            Toggle Theme
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Danger Zone" subtitle="Irreversible actions">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <LogOut className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-900">Logout</h4>
          </div>
          <p className="text-sm text-red-700 mb-4">Sign out of your account</p>
          <button 
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-medium transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </Card>
    </div>
  );
}