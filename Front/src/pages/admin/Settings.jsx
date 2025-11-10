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

        const getEmailFromToken = (obj) => {
          try {
            const token = obj?.token || obj?.accessToken || obj?.authToken || obj?.access_token;
            if (!token || typeof token !== 'string') return null;
            const payload = token.split('.')[1];
            if (!payload) return null;
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return decoded?.email || decoded?.sub || decoded?.preferred_username || null;
          } catch (e) {
            return null;
          }
        };

        // Try a number of plausible locations for username/email
        const candidate =
          parsed?.user ||
          parsed?.data?.user ||
          parsed?.currentUser ||
          parsed?.account ||
          parsed ||
          {};

        const username =
          parsed?.username ||
          parsed?.name ||
          parsed?.login ||
          candidate?.username ||
          candidate?.name ||
          candidate?.login ||
          '';

        const email =
          parsed?.email ||
          parsed?.emailAddress ||
          candidate?.email ||
          candidate?.emailAddress ||
          (candidate?.user ? candidate.user.email : null) ||
          parsed?.data?.user?.email ||
          parsed?.account?.email ||
          getEmailFromToken(parsed) ||
          '';

        const userObj = { username: username || '', email: email || '' };

        if (!mounted) return;
        setCurrentUser(userObj);

        // If we still don't have an email, try calling a me endpoint (if api has auth token)
        if (!userObj.email) {
          try {
            const meEndpoints = ['/auth/me', '/users/me', '/me'];
            for (const ep of meEndpoints) {
              try {
                const res = await api.get(ep);
                const d = res?.data || res;
                const meEmail = d?.email || d?.data?.email || d?.user?.email;
                const meUsername = d?.username || d?.name || d?.login;
                if (meEmail || meUsername) {
                  if (!mounted) break;
                  setCurrentUser(prev => ({
                    username: prev.username || meUsername || '',
                    email: meEmail || prev.email || '',
                  }));
                  break;
                }
              } catch (e) {
                // ignore and try next endpoint
              }
            }
          } catch (_) {
            // ignore
          }
        }
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
              <label className="block text-sm text-gray-700 font-medium mb-2">Username</label>
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
                      // 1) Validate current password by attempting common login endpoints
                      const loginEndpoints = ['/auth/login', '/login', '/users/login', '/token'];
                      let authToken = null;
                      let validated = false;
                      for (const ep of loginEndpoints) {
                        try {
                          const payload = currentUser.email
                            ? { email: currentUser.email, password: currentPasswordInput }
                            : { username: currentUser.username, password: currentPasswordInput };
                          const res = await api.post(ep, payload);
                          const data = res?.data || res;
                          authToken = data?.token || data?.accessToken || data?.access_token || null;
                          validated = true;
                          break;
                        } catch (err) {
                          // try next login endpoint
                        }
                      }

                      if (!validated) {
                        // As a fallback, try a "validate-password" style endpoint
                        try {
                          const validateEndpoints = ['/auth/validate-password','/users/validate-password','/validate-password'];
                          for (const ep of validateEndpoints) {
                            try {
                              await api.post(ep, { password: currentPasswordInput, email: currentUser.email, username: currentUser.username });
                              validated = true;
                              break;
                            } catch (err) {
                              // try next
                            }
                          }
                        } catch (_) {}
                      }

                      if (!validated) {
                        setChangingPassword(false);
                        return add('Current password validation failed', 'error');
                      }

                      // 2) Call change-password endpoints. Prefer using auth token if we got one.
                      const changeEndpoints = ['/auth/change-password','/users/change-password','/change-password','/user/change-password'];
                      let changed = false;
                      for (const ep of changeEndpoints) {
                        try {
                          const payload = { currentPassword: currentPasswordInput, newPassword: newPasswordInput, password: newPasswordInput, email: currentUser.email, username: currentUser.username };
                          const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
                          await api.post(ep, payload, config);
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