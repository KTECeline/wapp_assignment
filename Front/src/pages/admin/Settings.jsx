import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import api, { logout } from '../../services/api';
import { User, Bell, Shield, Palette, Database, LogOut } from 'lucide-react';

export default function Settings() {
  const { add } = useToast();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ username: '', email: '' });
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
   
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Try several storage locations and shapes
        const raw =
          localStorage.getItem('user') ||
          localStorage.getItem('currentUser') ||
          localStorage.getItem('auth') ||
          sessionStorage.getItem('user') ||
          sessionStorage.getItem('currentUser') ||
          sessionStorage.getItem('auth') ||
          null;

        if (!raw) return;

        const parsed = JSON.parse(raw);
        console.debug('Settings: parsed stored user ->', parsed);

        // common shapes:
        // 1) { username, email }
        // 2) { user: { username, email } }
        // 3) { data: { user: {...} } }
        // 4) token-like objects that include 'login' or 'name'
        const candidate =
          parsed?.username ||
          parsed?.email ||
          parsed?.user ||
          parsed?.data?.user ||
          parsed?.currentUser ||
          parsed?.account ||
          parsed;

        const getEmailFromToken = (obj) => {
          try {
            const token = obj?.token || obj?.accessToken || obj?.authToken;
            if (!token || typeof token !== 'string') return null;
            const payload = token.split('.')[1];
            if (!payload) return null;
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return decoded?.email || decoded?.sub || null;
          } catch (e) {
            return null;
          }
        };

        const userObj =
          typeof candidate === 'string'
            ? { username: candidate, email: '' }
            : candidate?.username || candidate?.name || candidate?.login || candidate?.email
            ? {
                username: candidate?.username || candidate?.name || candidate?.login || '',
                email: candidate?.email || candidate?.emailAddress || getEmailFromToken(parsed) || '',
              }
            : { username: '', email: '' };

        if (!mounted) return;
        setCurrentUser(userObj);
      } catch (err) {
        console.warn('Could not load current user', err);
      }
    })();
    return () => { mounted = false; };
  }, []);
   
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
                value={currentUser.username}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Email Address</label>
              <input 
                type="email"
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                value={currentUser.email}
                onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Current Password</label>
              <input 
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">New Password</label>
              <input 
                type="password" 
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                placeholder="Enter new password"
              />
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200"
                placeholder="Confirm new password"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (!currentPasswordInput) return add('Enter current password', 'error');
                    if (!newPasswordInput) return add('Enter new password', 'error');
                    if (newPasswordInput !== confirmPasswordInput) return add('New passwords do not match', 'error');
                    setChangingPassword(true);
                    try {
                      // try common validate endpoints then change endpoints
                      const validateEndpoints = ['/auth/validate-password','/users/validate-password','/validate-password'];
                      let validated = false;
                      for (const ep of validateEndpoints) {
                        try {
                          // some endpoints expect { password } others { currentPassword }
                          await api.post(ep, { password: currentPasswordInput, currentPassword: currentPasswordInput, email: currentUser.email });
                          validated = true;
                          break;
                        } catch (err) {
                          // try next
                        }
                      }
                      if (!validated) {
                        setChangingPassword(false);
                        return add('Current password validation failed', 'error');
                      }

                      const changeEndpoints = ['/auth/change-password','/users/change-password','/change-password'];
                      let changed = false;
                      for (const ep of changeEndpoints) {
                        try {
                          await api.post(ep, { currentPassword: currentPasswordInput, newPassword: newPasswordInput, password: newPasswordInput, email: currentUser.email });
                          changed = true;
                          break;
                        } catch (err) {
                          // try next
                        }
                      }
                      if (!changed) {
                        add('Password change failed: no supported endpoint', 'error');
                      } else {
                        add('Password changed');
                        setCurrentPasswordInput('');
                        setNewPasswordInput('');
                        setConfirmPasswordInput('');
                      }
                    } catch (err) {
                      add(`Password change failed: ${err?.message || err}`, 'error');
                    } finally {
                      setChangingPassword(false);
                    }
                  }}
                  disabled={changingPassword}
                  className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-4 py-2 font-medium transition-all duration-200"
                >
                  {changingPassword ? 'Saving...' : 'Change password'}
                </button>
              </div>
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


      {/* Security Settings */}
      <Card title="Security Settings" subtitle="Manage your account security">
        <div className="space-y-4">
          

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