import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, Check, XCircle, Eye, Trash2, Filter } from 'lucide-react';

// We'll fetch posts from the backend API and map them into the UI shape
const initialPosts = [];

// Card Component
const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border ${className}`}
    style={{ borderColor: '#F2E6E0' }}
  >
    {children}
  </div>
);

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-xl text-white z-50 animate-slide-in`}
    style={{ backgroundColor: type === 'error' ? '#B13A33' : '#D9433B' }}
  >
    <div className="flex items-center gap-3">
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity">
        <X size={18} />
      </button>
    </div>
  </div>
);

// Display Post Modal
const DisplayPost = ({ post, onClose, onApprove, onReject }) => (
  <div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center cursor-pointer p-4 animate-fade-in"
    onClick={onClose}
  >
    <div
      className="cursor-default relative flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl p-4 w-full max-w-4xl max-h-[90vh] overflow-auto animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-[#D9433B] transition-colors z-30 bg-white rounded-full p-1 shadow-md"
      >
        <X size={24} />
      </button>

      <button className="absolute top-3 right-14 cursor-pointer z-30 bg-white rounded-full p-1 shadow-md hover:bg-[#FFF8F2] transition-colors">
        <Heart className="w-6 h-6 text-slate-300 hover:text-[#D9433B] transition-colors" />
      </button>

      <div className="relative w-full md:w-[340px] h-64 md:h-full rounded-xl overflow-hidden flex-shrink-0">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="flex flex-col justify-between w-full md:ml-6 mt-4 md:mt-0">
        <div>
          <div className="flex items-center mb-4">
            {post.avatar ? (
              <img
                src={post.avatar}
                alt={post.user}
                className="w-11 h-11 rounded-full object-cover mr-3 border-2"
                style={{ borderColor: '#F2E6E0' }}
              />
            ) : (
              <div className="w-11 h-11 bg-[#D9433B] flex items-center justify-center rounded-full text-white text-lg font-semibold mr-3 shadow-md">
                {post.user?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-slate-800">{post.user}</p>
              <p className="text-xs text-slate-500">{post.date}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3 text-slate-900">
            {post.title}
          </h2>

          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.courses.map((course, index) => (
              <a
                key={index}
                href={course.link}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium border hover:bg-[#FFF1EC] transition-colors"
                style={{ backgroundColor: '#FFF8F2', color: '#B13A33', borderColor: '#F2E6E0' }}
              >
                #{course.name}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#F2E6E0' }}>
            <div className="flex items-center gap-2">
              <Heart className="" size={20} style={{ color: '#D9433B', fill: '#D9433B' }} />
              <span className="text-base font-semibold text-slate-700">{post.likes} likes</span>
            </div>
            <button className="text-slate-400 hover:text-[#B13A33] transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          {post.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => onApprove(post.id)}
                className="flex-1 border text-[#D9433B] hover:bg-[#FFF8F2] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md font-medium"
                style={{ borderColor: '#D9433B' }}
              >
                <Check size={18} /> Approve
              </button>
              <button
                onClick={() => onReject(post.id)}
                className="flex-1 bg-[#D9433B] hover:bg-[#B13A33] text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md font-medium"
              >
                <XCircle size={18} /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Main Component
export default function Posts() {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // fetch posts from backend API
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/UserPosts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();

        // map backend shape to UI shape
        const mapped = data.map(p => ({
          id: p.postId,
          user: p.user || 'Unknown',
          title: p.title,
          description: p.description,
          image: p.postImg || 'https://via.placeholder.com/400x300?text=No+Image',
          avatar: '',
          date: new Date(p.createdAt).toLocaleDateString(),
          likes: p.likes || 0,
          courses: p.course ? [{ name: p.course.name, link: `/courses/${p.course.id}` }] : [],
          status: p.approveStatus || 'pending'
        }));

        setPosts(mapped);
      } catch (err) {
        console.error(err);
        setPosts([]);
        setToast({ message: 'Failed to load posts from server', type: 'error' });
      }
    };

    fetchPosts();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    // call backend to approve
    fetch(`/api/UserPosts/${id}/approve`, { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to approve post');
        setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
        setSelectedPost(null);
        showToast('Post approved successfully!', 'success');
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to approve post', 'error');
      });
  };

  const handleReject = (id) => {
    // call backend to reject
    fetch(`/api/UserPosts/${id}/reject`, { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to reject post');
        setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
        setSelectedPost(null);
        showToast('Post rejected', 'error');
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to reject post', 'error');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      fetch(`/api/UserPosts/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok && res.status !== 204) throw new Error('Failed to delete post');
          setPosts(prev => prev.filter(p => p.id !== id));
          showToast('Post deleted', 'success');
        })
        .catch(err => {
          console.error(err);
          showToast('Failed to delete post', 'error');
        });
    }
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.status === filter);
  const statusCounts = {
    all: posts.length,
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manage Posts</h2>
          <p className="text-sm text-gray-500 mt-1">Review and moderate user-generated content</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border" style={{ borderColor: '#F2E6E0' }}>
          <Filter size={16} className="text-slate-400 ml-2" />
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-[#D9433B] text-white shadow-sm'
                  : 'text-[#B13A33] hover:bg-[#FFF8F2] border'
              }`}
              style={{ borderColor: filter === status ? 'transparent' : '#F2E6E0' }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 group" style={{ borderColor: '#F2E6E0' }}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm border`}
                    style={{ backgroundColor: '#FFF8F2', color: '#B13A33', borderColor: '#F2E6E0' }}
                  >
                    {post.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    {post.avatar ? (
                      <img src={post.avatar} alt={post.user} className="w-9 h-9 rounded-full mr-2.5 border-2" style={{ borderColor: '#F2E6E0' }} />
                    ) : (
                      <div className="w-9 h-9 bg-[#D9433B] flex items-center justify-center rounded-full text-white text-sm font-semibold mr-2.5 shadow-sm">
                        {post.user?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{post.user}</p>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-base mb-2 text-gray-900 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">{post.description}</p>

                  <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: '#F2E6E0' }}>
                    <Heart size={16} style={{ color: '#D9433B', fill: '#D9433B' }} />
                    <span className="text-sm font-semibold text-gray-700">{post.likes}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex-1 border text-[#D9433B] hover:bg-[#FFF8F2] py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                      style={{ borderColor: '#D9433B' }}
                    >
                      <Eye size={16} /> View
                    </button>
                    {post.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(post.id)}
                          className="border text-[#D9433B] hover:bg-[#FFF8F2] p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                          style={{ borderColor: '#D9433B' }}
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(post.id)}
                          className="bg-[#D9433B] hover:bg-[#B13A33] text-white p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="border text-[#B13A33] hover:bg-[#FFF8F2] p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                      style={{ borderColor: '#F2E6E0' }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF8F2] mb-4 border" style={{ borderColor: '#F2E6E0' }}>
              <Filter size={28} className="" style={{ color: '#B13A33' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filter to see more results</p>
          </div>
        )}
      </Card>

      {selectedPost && (
        <DisplayPost
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}