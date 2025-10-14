import React, { useState } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { badges as seed } from '../../data/badges';
import { useConfirm } from '../../components/Confirm';
import { useToast } from '../../components/Toast';
import { Search, Filter, Plus, Edit, Trash2, Medal, Award, Crown } from 'lucide-react';

export default function Badges() {
  const [items, setItems] = useState(seed);
  const [filteredItems, setFilteredItems] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const { add } = useToast();
  const { confirm } = useConfirm();

  // Filter and search functionality
  React.useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(badge => 
        badge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.criteria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tier filter (placeholder for future tier functionality)
    if (tierFilter !== 'All') {
      filtered = filtered.filter(badge => badge.tier === tierFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, tierFilter]);

  const onSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const record = Object.fromEntries(form.entries());
    if (editing != null) {
      const next = [...items];
      next[editing] = record;
      setItems(next);
      add('Badge updated');
    } else {
      setItems(prev => [...prev, record]);
      add('Badge added');
    }
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Badges</h3>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9433B] to-[#B13A33] flex items-center justify-center">
              <Medal className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Bronze Tier</h3>
              <p className="text-2xl font-bold text-gray-900">{items.filter(b => b.tier === 'Bronze').length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CD7F32] to-[#B8860B] flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Gold Tier</h3>
              <p className="text-2xl font-bold text-gray-900">{items.filter(b => b.tier === 'Gold').length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search badges by name or criteria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Tier Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="pl-12 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none min-w-[140px]"
            >
              <option value="All">All Tiers</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </select>
          </div>

          {/* Add Badge Button */}
          <button 
            onClick={() => setOpen(true)} 
            className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Badge
          </button>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredItems.length} of {items.length} badges</span>
          {(searchTerm || tierFilter !== 'All') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setTierFilter('All');
              }}
              className="text-[#D9433B] hover:text-[#B13A33] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((b, idx) => (
          <Card key={idx}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{b.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">{b.title}</div>
                <div className="text-sm text-gray-600 mb-3">{b.criteria}</div>
                <div className="flex gap-2">
                  <button 
                    className="p-2 border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl transition-all duration-200" 
                    onClick={() => { setEditing(idx); setOpen(true); }}
                    title="Edit badge"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 bg-[#D9433B] text-white hover:bg-[#B13A33] rounded-xl transition-all duration-200" 
                    onClick={async () => { 
                      if (await confirm({ title: 'Delete badge?', body: 'This action cannot be undone.' })) { 
                        setItems(prev => prev.filter((_, i) => i !== idx)); 
                        add('Badge deleted'); 
                      } 
                    }}
                    title="Delete badge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Badge Modal */}
      <Modal open={open} onClose={() => { setOpen(false); setEditing(null); }} title={editing != null ? 'Edit Badge' : 'Add Badge'}
        actions={(
          <>
            <button 
              className="border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl px-4 py-2 font-medium transition-all duration-200" 
              onClick={() => { setOpen(false); setEditing(null); }}
            >
              Cancel
            </button>
            <button 
              form="badge-form" 
              className="bg-[#D9433B] text-white hover:bg-[#B13A33] rounded-xl px-4 py-2 font-medium transition-all duration-200"
            >
              Save
            </button>
          </>
        )}
      >
        <form id="badge-form" onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Icon (emoji)</label>
            <input 
              name="icon" 
              defaultValue={editing != null ? items[editing]?.icon : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="🏆"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Title</label>
            <input 
              name="title" 
              defaultValue={editing != null ? items[editing]?.title : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Badge title"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Criteria</label>
            <input 
              name="criteria" 
              defaultValue={editing != null ? items[editing]?.criteria : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="How to earn this badge"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}