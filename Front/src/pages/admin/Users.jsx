import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { getUsers, createUser, updateUser, deleteUser, login } from '../../api/client';
import { useConfirm } from '../../components/Confirm';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';

export default function Users() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [adminValidated, setAdminValidated] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminLoginInput, setAdminLoginInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [validatedAdmin, setValidatedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const { add } = useToast();
  const { confirm } = useConfirm();

  const columns = [
    { key: 'userId', title: 'ID' },
    { key: 'username', title: 'Username' },
    { key: 'email', title: 'Email' },
    { key: 'firstName', title: 'First Name' },
    { key: 'lastName', title: 'Last Name' },
    { key: 'userType', title: 'User Type' },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getUsers();
        if (mounted) {
          setRows(list);
          setFilteredRows(list);
        }
      } catch (e) {
        add(`Failed to load users: ${e.message}`, 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [add]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = rows;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId?.toString().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter (Admin / User)
    if (roleFilter !== 'All') {
      filtered = filtered.filter(user => {
        // Normalize both sides to lower-case for safe comparison
        return (user.userType || '').toString().toLowerCase() === roleFilter.toLowerCase();
      });
    }

    setFilteredRows(filtered);
  }, [rows, searchTerm, roleFilter]);

  const onSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const record = Object.fromEntries(form.entries());
    try {
      if (editing != null) {
        const current = rows[editing];
        const updatePayload = {
          username: record.name || current.username,
          email: record.email || current.email,
          firstName: record.firstName || current.firstName,
          lastName: record.lastName || current.lastName,
          userType: record.userType || current.userType,
        };

        // If attempting to change userType, require admin validation first
        if (updatePayload.userType && updatePayload.userType !== current.userType && !adminValidated) {
          // Open admin validation modal so admin can provide credentials
          setShowAdminModal(true);
          return;
        }

        // If admin validated and a new password is provided, include it and admin creds
        if (newPassword) {
          if (!adminValidated) throw new Error('Admin validation required to change password');
          updatePayload.password = newPassword;
          updatePayload.adminLogin = validatedAdmin?.login;
          updatePayload.adminPassword = validatedAdmin?.password;
        }

        // If admin validated and userType changed, include admin creds so server can authorize role change
        if (adminValidated && updatePayload.userType && updatePayload.userType !== current.userType) {
          updatePayload.adminLogin = validatedAdmin?.login;
          updatePayload.adminPassword = validatedAdmin?.password;
        }

        const updated = await updateUser(current.userId, updatePayload);
        const next = [...rows];
        next[editing] = updated;
        setRows(next);
        add('User updated');
      } else {
        // include password when creating a user
        const created = await createUser({
          username: record.name,
          email: record.email,
          firstName: record.firstName || '',
          lastName: record.lastName || '',
          userType: record.userType || 'User',
          password: record.password || '',
        });
        setRows(prev => [...prev, created]);
        add('User added');
      }
    } catch (e) {
      add(`Operation failed: ${e.message}`, 'error');
    }
    setOpen(false);
    setEditing(null);
    // reset password/admin validation when modal closes
    setNewPassword('');
    setAdminValidated(false);
    setValidatedAdmin(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      {/* Search and Filter Bar - Fixed at Top */}
      <div className="flex-shrink-0 mb-6">
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-12 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Add User Button */}
          <button 
            onClick={() => setOpen(true)} 
            className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredRows.length} of {rows.length} users</span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-[#D9433B] hover:text-[#B13A33] transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      </Card>
      </div>

      {/* Users Table - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full flex flex-col">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table
              columns={columns}
              data={filteredRows}
              actions={(row) => (
                <div className="flex gap-2">
                  <button 
                    className="p-2 border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl transition-all duration-200" 
                    onClick={() => { setEditing(rows.indexOf(row)); setOpen(true); }}
                    title="Edit user"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 bg-[#D9433B] text-white hover:bg-[#B13A33] rounded-xl transition-all duration-200" 
                    onClick={async () => { 
                      if (await confirm({ title: 'Delete user?', body: 'This action cannot be undone.' })) { 
                        try {
                          await deleteUser(row.userId);
                          setRows(prev => prev.filter(r => r.userId !== row.userId));
                          add('User deleted');
                        } catch(e) {
                          add(`Delete failed: ${e.message}`, 'error');
                        }
                      } 
                    }}
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            />
          </div>
        )}
        </Card>
      </div>

      {/* Add/Edit User Modal */}
      <Modal open={open} onClose={() => { setOpen(false); setEditing(null); }} title={editing != null ? 'Edit User' : 'Add User'}
        actions={(
          <>
            <button 
              className="border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl px-4 py-2 font-medium transition-all duration-200" 
              onClick={() => { setOpen(false); setEditing(null); }}
            >
              Cancel
            </button>
            <button 
              form="user-form"
              className="bg-[#D9433B] text-white hover:bg-[#B13A33] rounded-xl px-4 py-2 font-medium transition-all duration-200"
            >
              Save
            </button>
          </>
        )}
      >
        <form id="user-form" onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Username</label>
            <input 
              name="name" 
              defaultValue={editing != null ? rows[editing]?.username : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Email</label>
            <input 
              name="email" 
              type="email"
              defaultValue={editing != null ? rows[editing]?.email : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">First Name</label>
            <input 
              name="firstName" 
              defaultValue={editing != null ? rows[editing]?.firstName : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Last Name</label>
            <input 
              name="lastName" 
              defaultValue={editing != null ? rows[editing]?.lastName : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">User Type</label>
            <select
              name="userType"
              defaultValue={editing != null ? rows[editing]?.userType : 'User'}
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200 appearance-none"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {editing == null && (
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200"
                placeholder="Enter password for new user"
              />
            </div>
          )}
          {editing != null && (
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">New Password (admin validation required)</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!adminValidated}
                  className="flex-1 rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200"
                  placeholder={adminValidated ? 'Enter new password' : 'Validate as admin to enable'}
                />
                <button
                  type="button"
                  onClick={() => setShowAdminModal(true)}
                  className="px-4 py-2 border rounded-xl text-sm font-medium"
                >
                  {adminValidated ? 'Admin validated' : 'Validate Admin'}
                </button>
              </div>
            </div>
          )}
          {/* Additional fields can be added here when backend supports them */}
        </form>
      </Modal>
      {/* Admin validation modal */}
      <Modal open={showAdminModal} onClose={() => setShowAdminModal(false)} title="Admin validation"
        actions={(
          <>
            <button className="border rounded-xl px-4 py-2" onClick={() => setShowAdminModal(false)}>Cancel</button>
            <button
              className="bg-[#D9433B] text-white rounded-xl px-4 py-2"
              onClick={async () => {
                try {
                  const resp = await login(adminLoginInput, adminPasswordInput);
                  if (resp.userType && resp.userType.toLowerCase() === 'admin') {
                    setAdminValidated(true);
                    setValidatedAdmin({ login: adminLoginInput, password: adminPasswordInput });
                    setShowAdminModal(false);
                    add('Admin validated');
                  } else {
                    add('Provided account is not an admin', 'error');
                  }
                } catch (err) {
                  console.error(err);
                  add('Admin validation failed', 'error');
                }
              }}
            >
              Validate
            </button>
          </>
        )}
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Admin username or email</label>
            <input value={adminLoginInput} onChange={(e) => setAdminLoginInput(e.target.value)} className="w-full rounded-xl border border-[#EADCD2] px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Admin password</label>
            <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full rounded-xl border border-[#EADCD2] px-4 py-3" />
          </div>
        </form>
      </Modal>
    </div>
  );
}