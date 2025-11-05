import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { badges as seed } from '../../data/badges';
import { useConfirm } from '../../components/Confirm';
import { useToast } from '../../components/Toast';
import { Search, Filter, Plus, Edit, Trash2, Medal, Award, Crown, Users as UsersIcon, Sparkles, TrendingUp, Star } from 'lucide-react';
import { getBadgeStats } from '../../api/client';

export default function Badges() {
  const [items, setItems] = useState(seed);
  const [filteredItems, setFilteredItems] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  // const [viewMode, setViewMode] = useState('grid'); // grid or list (reserved for future)
  const { add } = useToast();
  const { confirm } = useConfirm();
  const [statsMap, setStatsMap] = useState({});

  // Filter and search functionality
  React.useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(badge => 
        badge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.criteria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tierFilter !== 'All') {
      filtered = filtered.filter(badge => badge.tier === tierFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, tierFilter]);

  // Load badge stats from backend if available
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stats = await getBadgeStats();
        if (!mounted) return;
        const map = {};
        stats.forEach((s) => { if (s && s.title != null) map[s.title] = Number(s.count || 0); });
        setStatsMap(map);
      } catch (e) {
        // silently ignore if endpoint not present
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const record = Object.fromEntries(form.entries());
    if (editing != null) {
      const next = [...items];
      next[editing] = record;
      setItems(next);
      add('Badge updated successfully! 🎉');
    } else {
      setItems(prev => [...prev, record]);
      add('New badge created! 🎊');
    }
    setOpen(false);
    setEditing(null);
  };

  const totalEarned = Object.values(statsMap).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="border-b mb-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
               
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Badges</h1>
                  <p className="text-gray-500 text-sm">Achievements & Recognition</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setOpen(true)} 
              className="group bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-5 py-2.5 font-medium transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Badge
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 border bg-white transition-all duration-200 shadow-sm hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                  <Medal className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="px-2 py-0.5 rounded-full border text-[10px] font-medium" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                  TOTAL
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{items.length}</p>
              <p className="text-sm text-gray-600">Total Badges</p>
            </div>
            
            <div className="rounded-2xl p-5 border bg-white transition-all duration-200 shadow-sm hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                  <Award className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="px-2 py-0.5 rounded-full border text-[10px] font-medium" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                  BRONZE
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{items.filter(b => b.tier === 'Bronze').length}</p>
              <p className="text-sm text-gray-600">Bronze Tier</p>
            </div>

            <div className="rounded-2xl p-5 border bg-white transition-all duration-200 shadow-sm hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                  <Crown className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="px-2 py-0.5 rounded-full border text-[10px] font-medium" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                  GOLD
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{items.filter(b => b.tier === 'Gold').length}</p>
              <p className="text-sm text-gray-600">Gold Tier</p>
            </div>

            <div className="rounded-2xl p-5 border bg-white transition-all duration-200 shadow-sm hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="px-2 py-0.5 rounded-full border text-[10px] font-medium" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                  EARNED
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{totalEarned}</p>
              <p className="text-sm text-gray-600">Times Awarded</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Advanced Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#D9433B] transition-colors" />
              <input
                type="text"
                placeholder="Search by name, criteria, or tier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border rounded-xl focus:ring-2 outline-none transition-all duration-200 placeholder:text-gray-400 font-medium"
                style={{ borderColor: 'var(--border)', boxShadow: 'inset 0 0 0 0px transparent' }}
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="pl-14 pr-12 py-4 bg-white border rounded-xl focus:ring-2 outline-none transition-all duration-200 appearance-none min-w-[180px] cursor-pointer font-medium"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value="All">All Tiers</option>
                <option value="Bronze">🥉 Bronze</option>
                <option value="Silver">🥈 Silver</option>
                <option value="Gold">🥇 Gold</option>
              </select>
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {(searchTerm || tierFilter !== 'All') && (
            <div className="mt-5 pt-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Found <span className="font-bold text-[#D9433B] text-lg">{filteredItems.length}</span> of <span className="font-semibold text-gray-900">{items.length}</span> badges
                </span>
                {filteredItems.length > 0 && (
                  <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                )}
                {filteredItems.length > 0 && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ color: 'var(--accent-dark)', backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    Results found
                  </span>
                )}
              </div>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setTierFilter('All');
                }}
                className="text-[#D9433B] hover:text-[#B13A33] font-semibold text-sm transition-colors flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Badges Grid with Modern Cards */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((b, idx) => {
              const count = statsMap[b.title] ?? Number(b.count || 0);
              return (
                <div 
                  key={idx} 
                  className="group bg-white rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden hover:shadow-md"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {/* Badge Header with Gradient */}
                  <div className="p-4 border-b transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-start gap-4">
                      <div className="text-3xl md:text-4xl transform group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                        {b.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1 group-hover:text-[#B13A33] transition-colors">
                          {b.title}
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                          {b.criteria}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badge Body */}
                  <div className="p-5 space-y-4">
                    {/* Stats Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <UsersIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{count}</span>
                          <span className="text-xs font-medium text-gray-600">EARNED</span>
                        </div>
                      </div>
                      {count > 10 && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                          <Star className="w-4 h-4" style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--accent-dark)' }}>POPULAR</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button 
                        className="flex-1 group/btn border text-[#D9433B] hover:bg-[#FFF8F2] rounded-xl py-2.5 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md" 
                        style={{ borderColor: 'var(--accent)' }}
                        onClick={() => { setEditing(idx); setOpen(true); }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        className="group/btn bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-5 py-2.5 transition-colors duration-200 flex items-center justify-center shadow-sm hover:shadow-md" 
                        onClick={async () => { 
                          if (await confirm({ title: 'Delete this badge?', body: 'This action cannot be undone.' })) { 
                            setItems(prev => prev.filter((_, i) => i !== idx)); 
                            add('Badge deleted successfully'); 
                          } 
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed p-16" style={{ borderColor: 'var(--border)' }}>
            <div className="text-center max-w-md mx-auto">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                  <Medal className="w-10 h-10" style={{ color: 'var(--border)' }} />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--accent)' }}>
                  <Search className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No badges found</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm || tierFilter !== 'All' 
                  ? 'Try adjusting your search criteria or filters to discover more badges.' 
                  : 'Start building your badge collection by creating your first achievement badge.'}
              </p>
              {!searchTerm && tierFilter === 'All' ? (
                <button 
                  onClick={() => setOpen(true)} 
                  className="group bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-6 py-3 font-medium transition-colors inline-flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Badge
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setTierFilter('All');
                  }}
                  className="text-[#D9433B] hover:text-[#B13A33] font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      <Modal 
        open={open} 
        onClose={() => { setOpen(false); setEditing(null); }} 
        title={
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
              {editing != null ? <Edit className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
            </div>
            <span className="text-2xl font-bold">{editing != null ? 'Edit Badge' : 'Create New Badge'}</span>
          </div>
        }
        actions={(
          <>
            <button 
              className="border text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-2.5 font-medium transition-colors" 
              style={{ borderColor: 'var(--border)' }}
              onClick={() => { setOpen(false); setEditing(null); }}
            >
              Cancel
            </button>
            <button 
              form="badge-form" 
              className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-6 py-2.5 font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
            >
              {editing != null ? (
                <>
                  <Edit className="w-4 h-4" />
                  Update Badge
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Badge
                </>
              )}
            </button>
          </>
        )}
      >
        <form id="badge-form" onSubmit={onSave} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D9433B] text-white rounded-lg flex items-center justify-center text-xs font-black">1</span>
              Badge Icon
            </label>
            <div className="relative">
              <input 
                name="icon" 
                defaultValue={editing != null ? items[editing]?.icon : ''} 
                className="w-full rounded-xl border px-6 py-4 focus:ring-2 focus:outline-none transition-all duration-200 text-3xl text-center bg-white" 
                style={{ borderColor: 'var(--border)' }}
                placeholder="🏆"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center">Choose an emoji that represents this achievement</p>
          </div>

          <div>
            <label className="block text-sm text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D9433B] text-white rounded-lg flex items-center justify-center text-xs font-black">2</span>
              Badge Title
            </label>
            <input 
              name="title" 
              defaultValue={editing != null ? items[editing]?.title : ''} 
              className="w-full rounded-xl border px-6 py-3 focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 bg-white" 
              style={{ borderColor: 'var(--border)' }}
              placeholder="e.g., Early Bird Champion"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-900 font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D9433B] text-white rounded-lg flex items-center justify-center text-xs font-black">3</span>
              Achievement Criteria
            </label>
            <textarea 
              name="criteria" 
              defaultValue={editing != null ? items[editing]?.criteria : ''} 
              className="w-full rounded-xl border px-6 py-3 focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none bg-white leading-relaxed" 
              style={{ borderColor: 'var(--border)' }}
              placeholder="Describe how users can earn this badge..."
              rows={4}
              required
            />
            <p className="mt-2 text-sm text-gray-500">Be specific about the requirements to earn this badge</p>
          </div>
        </form>
      </Modal>
    </div>
  );
}