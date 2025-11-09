import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, Clock, Star, TrendingUp, AlertCircle, Eye, Archive, Send, Sparkles, ChevronDown } from 'lucide-react';
import { getUserFeedbacks, updateUserFeedback, deleteUserFeedback } from '../../api/client';

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`} style={{ borderColor: 'var(--border)' }}>
      {children}
    </div>
  );
}

export default function FeedbackV2() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [showFilters, setShowFilters] = useState(false);

  // Filter functionality
  React.useEffect(() => {
    let filtered = rows;

    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(f => f.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter(f => f.priority === priorityFilter);
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(f => f.category === categoryFilter);
    }

    setFilteredRows(filtered);
  }, [rows, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  // Load feedbacks from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getUserFeedbacks();
        if (!mounted) return;
        // Map backend data to UI shape
        const mapped = data.map(f => ({
          id: f.id,
          user: f.userName || 'Unknown',
          email: f.userEmail || '',
          message: f.description || '',
          status: ['Pending','In Progress','Resolved'].includes((f.type || '').toString()) ? f.type : 'Pending',
          rating: f.rating || 0,
          date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : '',
          category: (['Pending','In Progress','Resolved'].includes((f.type || '').toString()) ? 'General' : (f.type || 'General')),
          priority: f.rating <= 2 ? 'high' : (f.rating === 3 ? 'medium' : 'low'),
          avatar: (f.userName || 'U').split(' ').map(x=>x[0]).slice(0,2).join('') || 'U'
        }));
        setRows(mapped);
        setFilteredRows(mapped);
      } catch (err) {
        console.error('Failed to load feedbacks', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = {
    total: rows.length,
    pending: rows.filter(r => r.status === 'Pending').length,
    resolved: rows.filter(r => r.status === 'Resolved').length,
    avgRating: (rows.reduce((acc, r) => acc + r.rating, 0) / rows.length).toFixed(1),
    trend: '+12%'
  };

  const getStatusColor = () => {
    // Single-accent theme: use subtle surface + accent text for all statuses
    return 'bg-[var(--surface)] text-[var(--accent-dark)] border-[var(--border)]';
  };

  const getPriorityColor = () => {
    return 'bg-[var(--surface)] text-[var(--accent-dark)]';
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  const handleStatusChange = (feedback, newStatus) => {
    // Update local UI and persist to backend by setting `type` to the status value
    setRows(prev => prev.map(r => r.id === feedback.id ? { ...r, status: newStatus } : r));
    updateUserFeedback(feedback.id, { type: newStatus }).catch(err => console.error('Failed to persist status', err));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Feedback</h1>
            <p className="text-gray-600">Monitor and respond to customer insights</p>
          </div>
          <div className="flex items-center gap-3">
            
            <button className="px-4 py-2 bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Archive
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D9433B] flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full border" style={{ color: 'var(--accent-dark)', backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>{stats.trend}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Feedback</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-2">All time submissions</p>
            </div>
          </Card>
          
          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D9433B] flex items-center justify-center shadow-sm">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-2">Requires attention</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D9433B] flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Resolved</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.resolved}</p>
              <p className="text-xs text-gray-500 mt-2">Successfully handled</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D9433B] flex items-center justify-center shadow-sm">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Rating</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
                <div className="mb-1">{renderStars(Math.round(stats.avgRating))}</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Customer satisfaction</p>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-white border rounded-xl hover:bg-[var(--surface)] transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                style={{ borderColor: 'var(--border)' }}
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="All">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="UX">UX</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredRows.length}</span> of <span className="font-semibold text-gray-900">{rows.length}</span> items
              </span>
              {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setPriorityFilter('All');
                    setCategoryFilter('All');
                  }}
                  className="text-sm text-[#D9433B] hover:text-[#B13A33] font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredRows.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-all duration-300 cursor-pointer group">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-[#D9433B] flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {feedback.avatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{feedback.user}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getPriorityColor(feedback.priority)}`}>
                          {feedback.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{feedback.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="mb-1">{renderStars(feedback.rating)}</div>
                      <p className="text-xs text-gray-500">{feedback.date}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 leading-relaxed">{feedback.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs px-3 py-1 rounded-full font-medium border" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                      {feedback.category}
                    </span>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => setSelectedFeedback(feedback)}
                        className="p-2 border rounded-lg transition-all duration-200 text-sm flex items-center gap-1.5 hover:bg-[var(--surface)]"
                        style={{ color: 'var(--accent-dark)', borderColor: 'var(--border)' }}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedFeedback(feedback)}
                        className="p-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] rounded-lg transition-all duration-200 text-sm flex items-center gap-1.5"
                        title="Reply"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {feedback.status !== 'Resolved' && (
                        <button 
                          onClick={() => handleStatusChange(feedback, 'Resolved')}
                          className="p-2 border rounded-lg transition-all duration-200 text-sm flex items-center gap-1.5 hover:bg-[var(--surface)]"
                          style={{ color: 'var(--accent-dark)', borderColor: 'var(--border)' }}
                          title="Mark as resolved"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedFeedback(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b sticky top-0 bg-white" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#D9433B] flex items-center justify-center text-white font-semibold text-lg">
                      {selectedFeedback.avatar}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedFeedback.user}</h2>
                      <p className="text-sm text-gray-600">{selectedFeedback.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(selectedFeedback.rating)}
                        <span className="text-xs text-gray-500">{selectedFeedback.date}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFeedback(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Feedback Details</h3>
                  <div className="rounded-xl p-4 space-y-3 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <select
                        value={selectedFeedback.status}
                        onChange={(e) => handleStatusChange(selectedFeedback, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedFeedback.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      <span className="text-sm font-medium text-gray-900">{selectedFeedback.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Priority</span>
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getPriorityColor(selectedFeedback.priority)}`}>
                        {selectedFeedback.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Message</h3>
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <p className="text-gray-700 leading-relaxed">{selectedFeedback.message}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Response</h3>
                  <textarea 
                    className="w-full min-h-32 rounded-xl border p-4 focus:ring-2 focus:ring-[#D9433B] focus:outline-none focus:border-transparent transition-all duration-200 resize-none" 
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Type your response here..."
                  />
                </div>
              </div>

              <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white" style={{ borderColor: 'var(--border)' }}>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="px-6 py-2.5 border text-gray-700 hover:bg-[var(--surface)] rounded-xl font-medium transition-all duration-200"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="px-6 py-2.5 bg-[#D9433B] hover:bg-[#B13A33] text-white hover:shadow-md rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}