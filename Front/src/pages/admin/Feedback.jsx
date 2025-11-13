import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Star, TrendingUp, ChevronDown, X, BookOpen, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserFeedbacks } from '../../api/client';

function Card({ children, className = '' }) {
  return (
    // Reduced padding to make cards more compact and align with global compact theme
    <div className={`bg-white rounded-2xl shadow-sm border p-4 transform transition-all duration-200 ${className}`} style={{ borderColor: 'var(--border)' }}>
      {children}
    </div>
  );
}

export default function FeedbackV2() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Show 12 items per page (4x3 grid)

  // Filter functionality
  React.useEffect(() => {
    let filtered = rows;

    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.courseTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(f => f.category === categoryFilter);
    }

    if (courseFilter !== 'All') {
      // courseFilter comes from a select so its value is a string; coerce to number
      const courseId = typeof courseFilter === 'string' ? parseInt(courseFilter, 10) : courseFilter;
      if (!Number.isNaN(courseId)) {
        filtered = filtered.filter(f => f.courseId === courseId);
      }
    }

    if (ratingFilter !== 'All') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(f => f.rating === rating);
    }

    setFilteredRows(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [rows, searchTerm, categoryFilter, courseFilter, ratingFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load feedbacks from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getUserFeedbacks();
        if (!mounted) return;
        
        const normalizeType = (t) => {
          if (!t) return 'Website';
          const s = String(t).toLowerCase();
          // Map backend types to display types
          if (s === 'review' || s === 'course') return 'Course';
          if (s === 'website') return 'Website';
          // Default to capitalize the type as-is
          return t.charAt(0).toUpperCase() + t.slice(1);
        };

        const mapped = data.map(f => ({
          id: f.id,
          user: f.userName || 'Unknown',
          email: f.userEmail || '',
          title: f.title || '',
          message: f.description || '',
          rating: f.rating || 0,
          date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : '',
          category: normalizeType(f.type),
          avatar: (f.userName || 'U').split(' ').map(x=>x[0]).slice(0,2).join('') || 'U',
          courseId: f.courseId || null,
          courseTitle: f.courseTitle || null
        }));

        setRows(mapped);
        setFilteredRows(mapped);
        const allowed = ['Course', 'Website'];
        setAvailableCategories(allowed);
        
        // Get unique courses
        const courses = mapped
          .filter(f => f.courseId && f.courseTitle)
          .reduce((acc, f) => {
            if (!acc.find(c => c.id === f.courseId)) {
              acc.push({ id: f.courseId, title: f.courseTitle });
            }
            return acc;
          }, [])
          .sort((a, b) => a.title.localeCompare(b.title));
        setAvailableCourses(courses);
      } catch (err) {
        console.error('Failed to load feedbacks', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const uniqueCourses = Array.from(new Set(rows.map(r => r.courseId).filter(Boolean))).length;
  const categoryCounts = rows.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {});
  const topCategory = Object.entries(categoryCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';
  
  // Calculate trend: feedback from last 24 hours vs previous 24 hours
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  
  const recentFeedback = rows.filter(r => {
    const feedbackDate = new Date(r.date);
    return feedbackDate >= oneDayAgo && feedbackDate <= now;
  }).length;
  
  const previousFeedback = rows.filter(r => {
    const feedbackDate = new Date(r.date);
    return feedbackDate >= twoDaysAgo && feedbackDate < oneDayAgo;
  }).length;
  
  const calculateTrend = () => {
    if (previousFeedback === 0) {
      return recentFeedback > 0 ? `+${recentFeedback} today` : 'No change';
    }
    const percentChange = ((recentFeedback - previousFeedback) / previousFeedback) * 100;
    const sign = percentChange > 0 ? '+' : '';
    return `${sign}${percentChange.toFixed(1)}% per day`;
  };
  
  const stats = {
    total: rows.length,
    avgRating: rows.length ? (rows.reduce((acc, r) => acc + r.rating, 0) / rows.length).toFixed(1) : '0.0',
    uniqueCourses,
    topCategory,
    trend: calculateTrend(),
    trendPositive: recentFeedback >= previousFeedback
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          // Larger stars to improve visibility in the compact layout
          <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Feedback</h1>
            <p className="text-gray-600">Monitor and respond to customer insights</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden hover:shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#D9433B] flex items-center justify-center shadow-sm flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-600">Total Feedback</h3>
                  <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                  stats.trendPositive 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {stats.trend}
                </span>
              </div>
              <p className="text-xs text-gray-500">All time submissions</p>
            </div>
          </Card>
          
          <Card className="relative overflow-hidden hover:shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#D9433B] flex items-center justify-center shadow-sm flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-600">Unique Courses</h3>
                  <p className="text-lg font-bold text-gray-900">{stats.uniqueCourses}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Courses with feedback</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#D9433B] flex items-center justify-center shadow-sm flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-600">Top Category</h3>
                  <p className="text-lg font-bold text-gray-900">{stats.topCategory}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Most common feedback type</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden hover:shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ backgroundColor: 'var(--surface)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#D9433B] flex items-center justify-center shadow-sm flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
                  <p className="text-lg font-bold text-gray-900">{stats.avgRating}</p>
                </div>
                <div className="mb-1">{renderStars(Math.round(stats.avgRating))}</div>
              </div>
              <p className="text-xs text-gray-500">Customer satisfaction</p>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, course, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border rounded-full focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              
              <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-white border rounded-xl hover:bg-[var(--surface)] transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                style={{ borderColor: 'var(--border)' }}
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setCourseFilter('All'); setRatingFilter('All'); }} className="px-3 py-2 bg-transparent text-sm text-gray-600 hover:text-gray-800 rounded-md">Clear</button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="All">All Categories</option>
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Course</label>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="All">All Courses</option>
                    {availableCourses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
                    style={{ borderColor: 'var(--border)' }}
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
            )}

            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredRows.length)}</span> of <span className="font-semibold text-gray-900">{filteredRows.length}</span> items
                {filteredRows.length !== rows.length && ` (filtered from ${rows.length} total)`}
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
                {(searchTerm || categoryFilter !== 'All' || courseFilter !== 'All' || ratingFilter !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('All');
                      setCourseFilter('All');
                      setRatingFilter('All');
                    }}
                    className="text-sm text-[#D9433B] hover:text-[#B13A33] font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

  {/* Feedback Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRows.length === 0 ? (
            <Card className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </Card>
          ) : (
            paginatedRows.map((feedback) => (
              <Card key={feedback.id} className="hover:shadow-lg transform hover:-translate-y-1 cursor-pointer group border-l-4" style={{ borderLeftColor: feedback.rating >= 4 ? '#10b981' : feedback.rating >= 3 ? '#f59e0b' : '#ef4444' }} onClick={() => setExpandedId(expandedId === feedback.id ? null : feedback.id)}>
                <div className="flex items-start gap-4">
                  {/* Avatar + Eye (eye sits under avatar, beside description) */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D9433B] to-[#B13A33] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {feedback.avatar}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedFeedback(feedback); }}
                      className="mt-2 p-1 rounded hover:bg-gray-100"
                      aria-label={`View details for ${feedback.user}`}
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-gray-900 mb-0.5 truncate">{feedback.user}</h3>
                        <p className="text-xs text-gray-500 truncate">{feedback.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-3">
                        {renderStars(feedback.rating)}
                        <span className="text-[11px] text-gray-400">{feedback.date}</span>
                      </div>
                    </div>

                    {/* Course Info - More Prominent */}
                    {feedback.courseTitle && (
                      <div className="mb-2 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-gradient-to-r from-[#D9433B]/8 to-[#B13A33]/8 border border-[#D9433B]/10">
                        <BookOpen className="w-4 h-4 text-[#D9433B]" />
                        <span className="text-sm font-semibold text-[#D9433B] truncate">{feedback.courseTitle}</span>
                      </div>
                    )}

                    {/* Title */}
                    {feedback.title && (
                      <h4 className="font-medium text-gray-900 mb-1 text-sm truncate">{feedback.title}</h4>
                    )}
                    
                    {/* Message Preview with inline badges and inline expand */}
                    <div className="mb-2">
                        <div className="flex items-start justify-between">
                        <p
                          className={`flex-1 text-gray-600 text-sm transition-all duration-200 ${expandedId === feedback.id ? 'max-h-[400px]' : 'max-h-6 overflow-hidden'}`}
                        >
                          {feedback.message}
                        </p>

                        <div className="ml-3 flex items-start gap-2">
                          {feedback.category === 'Website' && (
                            <span className="inline-flex items-center text-xs px-2 py-1 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                              Website
                            </span>
                          )}

                          {feedback.category === 'Course' && (
                            <span className="inline-flex items-center text-xs px-2 py-1 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                              Course
                            </span>
                          )}

                          {feedback.message && feedback.message.length > 140 && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === feedback.id ? null : feedback.id); }}
                              aria-expanded={expandedId === feedback.id}
                              className="text-sm text-[#D9433B] hover:underline px-2 py-1"
                            >
                              {expandedId === feedback.id ? 'Hide' : 'Read more'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer: Empty or for other actions */}
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                      {/* Footer content can go here if needed */}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {filteredRows.length > 0 && totalPages > 1 && (
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 rounded-lg transition-all ${
                            page === currentPage
                              ? 'bg-[#D9433B] text-white font-semibold shadow-sm'
                              : 'bg-white border hover:bg-gray-50'
                          }`}
                          style={{ borderColor: page === currentPage ? 'transparent' : 'var(--border)' }}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Detail Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={() => setSelectedFeedback(null)}>
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="p-6 border-b sticky top-0 bg-white z-10 rounded-t-3xl" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D9433B] to-[#B13A33] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {selectedFeedback.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{selectedFeedback.user}</h2>
                    <p className="text-xs text-gray-600 mb-2">{selectedFeedback.email}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {renderStars(selectedFeedback.rating)}
                      <span className="text-xs text-gray-500">{selectedFeedback.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFeedback(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-4 flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Course Info */}
                {selectedFeedback.courseTitle && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D9433B]/10 to-[#B13A33]/10 border-2 border-[#D9433B]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#D9433B] flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#D9433B] mb-1">COURSE FEEDBACK</p>
                        <p className="text-base font-bold text-gray-900">{selectedFeedback.courseTitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subject */}
                {selectedFeedback.title && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Subject</h3>
                    <div className="rounded-2xl p-5 bg-gray-50 border-2" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-lg font-semibold text-gray-900">{selectedFeedback.title}</p>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Feedback Message</h3>
                  <div className="rounded-2xl p-6 bg-gray-50 border-2" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">{selectedFeedback.message}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t flex justify-end sticky bottom-0 bg-white rounded-b-3xl" style={{ borderColor: 'var(--border)' }}>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="px-8 py-3 bg-gradient-to-r from-[#D9433B] to-[#B13A33] hover:from-[#B13A33] hover:to-[#8f2e28] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}