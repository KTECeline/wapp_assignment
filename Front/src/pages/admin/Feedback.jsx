import React, { useState } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { feedback as seed } from '../../data/feedback';
import { useToast } from '../../components/Toast';
import { Search, Filter, MessageSquare, CheckCircle, Clock, Star } from 'lucide-react';

export default function Feedback() {
  const [rows, setRows] = useState(seed);
  const [filteredRows, setFilteredRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const { add } = useToast();

  const columns = [
    { key: 'user', title: 'User' },
    { key: 'message', title: 'Message' },
    { key: 'status', title: 'Status' },
  ];

  // Filter and search functionality
  React.useEffect(() => {
    let filtered = rows;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(feedback => 
        feedback.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(feedback => feedback.status === statusFilter);
    }

    // Rating filter (placeholder for future rating functionality)
    if (ratingFilter !== 'All') {
      filtered = filtered.filter(feedback => feedback.rating === ratingFilter);
    }

    setFilteredRows(filtered);
  }, [rows, searchTerm, statusFilter, ratingFilter]);

  // Get unique statuses for filter options
  const statuses = ['All', ...new Set(rows.map(feedback => feedback.status))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Feedback</h3>
              <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9433B] to-[#B13A33] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
              <p className="text-2xl font-bold text-gray-900">{rows.filter(r => r.status === 'Pending').length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EFBF71] to-[#D4A574] flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Resolved</h3>
              <p className="text-2xl font-bold text-gray-900">{rows.filter(r => r.status === 'Resolved').length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Rating</h3>
              <p className="text-2xl font-bold text-gray-900">4.2</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FADADD] to-[#F2C2C7] flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
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
              placeholder="Search feedback by user or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none min-w-[140px]"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="relative">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="pl-4 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none min-w-[140px]"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredRows.length} of {rows.length} feedback items</span>
          {(searchTerm || statusFilter !== 'All' || ratingFilter !== 'All') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setRatingFilter('All');
              }}
              className="text-[#D9433B] hover:text-[#B13A33] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Feedback Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredRows}
          actions={(row) => (
            <div className="flex gap-2">
              <button 
                className="p-2 border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl transition-all duration-200" 
                onClick={() => { setReplyTo(row); setOpen(true); }}
                title="Reply to feedback"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button 
                className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-xl transition-all duration-200" 
                onClick={() => { 
                  setRows(prev => prev.map(r => r === row ? { ...r, status: 'Resolved' } : r)); 
                  add('Marked as resolved'); 
                }}
                title="Mark as resolved"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </Card>
      
      {/* Reply Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={`Reply to ${replyTo?.user || ''}`}
        actions={(
          <>
            <button 
              className="border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl px-4 py-2 font-medium transition-all duration-200" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="bg-[#D9433B] text-white hover:bg-[#B13A33] rounded-xl px-4 py-2 font-medium transition-all duration-200" 
              onClick={() => { setOpen(false); add('Reply sent'); }}
            >
              Send Reply
            </button>
          </>
        )}
      >
        <div className="space-y-4">
          <div className="p-4 bg-[#FAF6F1] rounded-xl">
            <p className="text-sm font-medium text-gray-900 mb-2">Original Message:</p>
            <p className="text-sm text-gray-700">{replyTo?.message}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Your Reply</label>
            <textarea 
              className="w-full min-h-32 rounded-xl border border-[#EADCD2] p-4 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Type your reply..." 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}