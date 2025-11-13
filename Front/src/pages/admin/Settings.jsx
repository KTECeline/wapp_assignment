import React, { useEffect, useState } from 'react';
import { User, Bell, Shield, Database, LogOut, Check, X, Eye, EyeOff, Download } from 'lucide-react';
import { exportAllAdminData } from '../../api/client';

// Mock Card component
const Card = ({ title, subtitle, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-[#FAF6F1] to-white px-6 py-5 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function Settings() {
  const [currentUser, setCurrentUser] = useState({ username: '', email: '' });
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSave = (e) => { 
    e.preventDefault(); 
    showToast('Profile saved successfully!');
  };

  const onLogout = () => {
    showToast('Logged out successfully');
  };

  const handleChangePassword = async () => {
    if (!currentPasswordInput) return showToast('Enter current password', 'error');
    if (!newPasswordInput) return showToast('Enter new password', 'error');
    if (newPasswordInput !== confirmPasswordInput) return showToast('New passwords do not match', 'error');

    const pwd = newPasswordInput;
    const checks = [
      { ok: /.{8,}/.test(pwd), msg: 'Password must be at least 8 characters.' },
      { ok: /[A-Z]/.test(pwd), msg: 'Password must include an uppercase letter.' },
      { ok: /[a-z]/.test(pwd), msg: 'Password must include a lowercase letter.' },
      { ok: /[0-9]/.test(pwd), msg: 'Password must include a number.' },
      { ok: /[^A-Za-z0-9]/.test(pwd), msg: 'Password must include a special character.' },
    ];

    const failed = checks.find(c => !c.ok);
    if (failed) return showToast(failed.msg, 'error');

    setChangingPassword(true);
    setTimeout(() => {
      showToast('Password changed successfully!');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setChangingPassword(false);
    }, 1000);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    showToast('Preparing your data export...', 'success');
    
    try {
      const data = await exportAllAdminData();
      
      // Helper function to convert array of objects to CSV
      const arrayToCSV = (arr, title) => {
        if (!arr || arr.length === 0) return `${title}\nNo data available\n\n`;
        
        const headers = Object.keys(arr[0]);
        const csvRows = [
          `${title}`,
          headers.join(','),
          ...arr.map(row => 
            headers.map(header => {
              const value = row[header];
              // Handle null, undefined, objects, and arrays
              if (value === null || value === undefined) return '';
              if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
              // Escape commas and quotes in strings
              const stringValue = String(value).replace(/"/g, '""');
              return stringValue.includes(',') || stringValue.includes('\n') ? `"${stringValue}"` : stringValue;
            }).join(',')
          ),
          '' // Empty line between sections
        ];
        
        return csvRows.join('\n') + '\n\n';
      };

      // Build comprehensive CSV with all data sections
      let csvContent = `Admin Data Export - ${new Date().toLocaleString()}\n`;
      csvContent += `Generated at: ${data.exportDate}\n\n`;
      csvContent += '='.repeat(80) + '\n\n';
      
      csvContent += arrayToCSV(data.users, 'USERS');
      csvContent += arrayToCSV(data.courses, 'COURSES');
      csvContent += arrayToCSV(data.categories, 'CATEGORIES');
      csvContent += arrayToCSV(data.levels, 'LEVELS');
      csvContent += arrayToCSV(data.feedback, 'USER FEEDBACK');
      csvContent += arrayToCSV(data.announcements, 'ANNOUNCEMENTS');
      csvContent += arrayToCSV(data.badges, 'BADGES');
      csvContent += arrayToCSV(data.userCourses, 'USER COURSE ENROLLMENTS');
      csvContent += arrayToCSV(data.messages, 'MESSAGES');
      csvContent += arrayToCSV(data.helpSessions, 'HELP SESSIONS');
      csvContent += arrayToCSV(data.userPosts, 'USER POSTS');

      // Create summary statistics
      const summary = [
        { Metric: 'Total Users', Count: data.users?.length || 0 },
        { Metric: 'Total Courses', Count: data.courses?.length || 0 },
        { Metric: 'Total Categories', Count: data.categories?.length || 0 },
        { Metric: 'Total Levels', Count: data.levels?.length || 0 },
        { Metric: 'Total Feedback', Count: data.feedback?.length || 0 },
        { Metric: 'Total Announcements', Count: data.announcements?.length || 0 },
        { Metric: 'Total Badges', Count: data.badges?.length || 0 },
        { Metric: 'Total Enrollments', Count: data.userCourses?.length || 0 },
        { Metric: 'Total Messages', Count: data.messages?.length || 0 },
        { Metric: 'Total Help Sessions', Count: data.helpSessions?.length || 0 },
        { Metric: 'Total User Posts', Count: data.userPosts?.length || 0 }
      ];
      
      csvContent = arrayToCSV(summary, 'SUMMARY STATISTICS') + '\n' + csvContent;

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `admin_data_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Data exported successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to export data. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const passwordRules = {
    minLength: (pwd) => pwd.length >= 8,
    uppercase: (pwd) => /[A-Z]/.test(pwd),
    lowercase: (pwd) => /[a-z]/.test(pwd),
    number: (pwd) => /[0-9]/.test(pwd),
    special: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  };

  // Load current user from common storage keys or fallback to /me endpoints
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Try several storage locations and shapes
        const raw =
          localStorage.getItem('user') ||
          localStorage.getItem('currentUser') ||
          localStorage.getItem('auth') ||
          localStorage.getItem('account') ||
          sessionStorage.getItem('user') ||
          sessionStorage.getItem('currentUser') ||
          sessionStorage.getItem('auth') ||
          null;

        const parsed = raw ? JSON.parse(raw) : null;

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

        const candidate = parsed?.user || parsed?.data?.user || parsed?.currentUser || parsed?.account || parsed || {};

        const username = parsed?.username || parsed?.name || parsed?.login || candidate?.username || candidate?.name || candidate?.login || '';
        const email = parsed?.email || parsed?.emailAddress || candidate?.email || candidate?.emailAddress || (candidate?.user ? candidate.user.email : null) || getEmailFromToken(parsed) || '';

        const userObj = { username: username || '', email: email || '' };

        if (!mounted) return;
        if (userObj.username || userObj.email) setCurrentUser(userObj);

        // If still missing email, try calling common me endpoints (if auth token present)
        if (!userObj.email) {
          try {
            const meEndpoints = ['/auth/me', '/users/me', '/me'];
            for (const ep of meEndpoints) {
              try {
                const res = await fetch(ep, { credentials: 'include' });
                if (!res.ok) continue;
                const d = await res.json();
                const meEmail = d?.email || d?.data?.email || d?.user?.email || null;
                const meUsername = d?.username || d?.name || d?.login || null;
                if (meEmail || meUsername) {
                  if (!mounted) break;
                  setCurrentUser(prev => ({ username: prev.username || meUsername || '', email: meEmail || prev.email || '' }));
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
        // ignore parse errors
        console.warn('Could not load current user', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const rulesList = [
    { key: 'minLength', label: 'At least 8 characters' },
    { key: 'uppercase', label: 'One uppercase letter' },
    { key: 'lowercase', label: 'One lowercase letter' },
    { key: 'number', label: 'One number' },
    { key: 'special', label: 'One special character' },
  ];

  const allRulesPassed = rulesList.every(rule => passwordRules[rule.key](newPasswordInput)) && 
                         newPasswordInput && 
                         (newPasswordInput === confirmPasswordInput);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white`}>
            <div className="flex items-center gap-2">
              {toast.type === 'error' ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}



        {/* Profile Settings */}
        <Card title="Profile Information" subtitle="Update your personal details">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" 
                    value={currentUser.username}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email"
                    className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" 
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="button"
                onClick={onSave}
                className="bg-gradient-to-r from-[#D9433B] to-[#B13A33] hover:shadow-lg text-white rounded-xl px-8 py-3 font-semibold transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <Check className="w-5 h-5" />
                Save Profile
              </button>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card title="Change Password" subtitle="Update your password to keep your account secure">
          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-11 pr-12 py-3 focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" 
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* New Password Inputs */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 pl-11 pr-12 py-3 focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white" 
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 pl-11 pr-12 py-3 focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements - Side Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#FAF6F1] to-[#FFF0EE] rounded-xl p-4 border border-[#EADCD2] h-full">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#D9433B]" />
                    Password Requirements
                  </h4>
                  <ul className="space-y-2">
                    {rulesList.map(rule => {
                      const ok = passwordRules[rule.key](newPasswordInput);
                      return (
                        <li key={rule.key} className="flex items-start gap-2 text-xs">
                          <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 border ${
                                    ok ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-100'
                                  }`}>
                                    {ok ? <Check className="w-4 h-4 text-emerald-700" /> : <X className="w-4 h-4 text-rose-500" />}
                                  </div>
                                  <span className={`transition-colors duration-200 text-sm ${ok ? 'text-emerald-700 font-medium' : 'text-gray-600'}`}>
                                    {rule.label}
                                  </span>
                        </li>
                      );
                    })}
                    <li className="flex items-start gap-2 text-xs">
                      <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 border ${
                        newPasswordInput && (newPasswordInput === confirmPasswordInput) ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-100'
                      }`}>
                        {newPasswordInput && (newPasswordInput === confirmPasswordInput) ? <Check className="w-4 h-4 text-emerald-700" /> : <X className="w-4 h-4 text-rose-500" />}
                      </div>
                      <span className={`transition-colors duration-200 text-sm ${
                        newPasswordInput && (newPasswordInput === confirmPasswordInput) ? 'text-emerald-700 font-medium' : 'text-gray-600'
                      }`}>
                        Passwords match
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={changingPassword || !allRulesPassed}
                className={`rounded-xl px-8 py-3 font-semibold transition-all duration-200 flex items-center gap-2 transform ${
                  changingPassword || !allRulesPassed
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D9433B] to-[#B13A33] hover:shadow-lg text-white hover:scale-105'
                }`}
              >
                <Shield className="w-5 h-5" />
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </Card>

        {/* Security & Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Data Export" subtitle="Download your information">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <Database className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Complete Admin Data Export</p>
                  <p className="text-xs text-gray-600">
                    Downloads all users, courses, categories, levels, feedback, announcements, badges, enrollments, messages, help sessions, and user posts in CSV format
                  </p>
                </div>
              </div>
              <button 
                onClick={handleExportData}
                disabled={isExporting}
                className={`w-full rounded-xl px-4 py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 transform ${
                  isExporting 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
              >
                <Download className="w-5 h-5" />
                {isExporting ? 'Exporting...' : 'Export All Admin Data'}
              </button>
            </div>
          </Card>

          <Card title="Danger Zone" subtitle="Irreversible actions" className="border-red-200">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
                <LogOut className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Sign out from your account</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg text-white rounded-xl px-4 py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}