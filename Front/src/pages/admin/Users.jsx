import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { getUsers, createUser } from '../../api/client';
import { useConfirm } from '../../components/Confirm';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';

export default function Users() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const { add } = useToast();
  const { confirm } = useConfirm();

  const columns = [
    { key: 'UserID', title: 'ID' },
    { key: 'Username', title: 'Username' },
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
        user.Username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.UserID?.toString().includes(searchTerm)
      );
    }

    // Role filter (placeholder for future role functionality)
    if (roleFilter !== 'All') {
      // This would filter by role when role field is added
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredRows(filtered);
  }, [rows, searchTerm, roleFilter]);

  const onSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const record = Object.fromEntries(form.entries());
    try {
      if (editing != null) {
        const next = [...rows];
        next[editing] = { ...next[editing], ...record };
        setRows(next);
        add('User updated (local only)');
      } else {
        const created = await createUser({ Username: record.name || record.Username });
        setRows(prev => [...prev, created]);
        add('User added');
      }
    } catch (e) {
      add(`Operation failed: ${e.message}`, 'error');
    }
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
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
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
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

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading users...</div>
          </div>
        ) : (
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
                      setRows(prev => prev.filter(r => r !== row)); 
                      add('User deleted (local only)'); 
                    } 
                  }}
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        )}
      </Card>

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
              defaultValue={editing != null ? rows[editing]?.Username : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Enter username"
              required
            />
          </div>
          {/* Additional fields can be added here when backend supports them */}
        </form>
      </Modal>
    </div>
  );
}