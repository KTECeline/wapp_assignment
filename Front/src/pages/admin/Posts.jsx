import React, { useState } from 'react';
import { X, Heart, Share2, Check, XCircle, Eye, Trash2, Filter } from 'lucide-react';

// Mock data for posts
const initialPosts = [
  {
    id: 1,
    user: 'Amy Wong',
    title: 'My Freshly Baked Brownies',
  description: `WOW — the chocolate flavor is next-level! Can't wait to share them with the family tonight. 🥰`,
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400',
    avatar: '',
    date: 'Oct 4, 2025',
    likes: 100,
    courses: [
      { name: 'Small-Batch Brownies', link: '/courses/brownies' },
      { name: 'Cakes', link: '/courses/cakes' },
    ],
    status: 'pending'
  },
  {
    id: 2,
    user: 'John Smith',
    title: 'Perfect Sourdough Bread',
    description: 'After 3 days of fermentation, finally got the perfect crust and crumb! The tangy flavor is amazing.',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400',
    avatar: '',
    date: 'Oct 3, 2025',
    likes: 85,
    courses: [
      { name: 'Artisan Bread', link: '/courses/bread' },
    ],
    status: 'pending'
  },
  {
    id: 3,
    user: 'Sarah Chen',
    title: 'Homemade Croissants',
    description: 'My first attempt at laminated dough! So many layers of buttery goodness. Took forever but worth it! 🥐',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    avatar: '',
    date: 'Oct 2, 2025',
    likes: 142,
    courses: [
      { name: 'French Pastries', link: '/courses/pastries' },
    ],
    status: 'approved'
  },
  {
    id: 4,
    user: 'Mike Johnson',
    title: 'Chocolate Chip Cookies',
    description: 'Classic recipe with a twist - added sea salt on top. These disappeared in minutes!',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    avatar: '',
    date: 'Oct 1, 2025',
    likes: 67,
    courses: [
      { name: 'Cookie Basics', link: '/courses/cookies' },
    ],
    status: 'approved'
  },
  {
    id: 5,
    user: 'Lisa Park',
    title: 'Matcha Swiss Roll',
    description: 'Light and fluffy cake with smooth matcha cream filling. The color is so vibrant! 🍵',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    avatar: '',
    date: 'Sep 30, 2025',
    likes: 95,
    courses: [
      { name: 'Japanese Desserts', link: '/courses/japanese' },
    ],
    status: 'rejected'
  }
];

// Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 px-5 py-3 rounded-xl shadow-xl text-white z-50 animate-slide-in ${
    type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
    type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
    'bg-gradient-to-r from-blue-500 to-blue-600'
  }`}>
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
        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors z-30 bg-white rounded-full p-1 shadow-md"
      >
        <X size={24} />
      </button>

      <button className="absolute top-3 right-14 cursor-pointer z-30 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors">
        <Heart className="w-6 h-6 text-slate-300 hover:text-red-500 transition-colors" />
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
                className="w-11 h-11 rounded-full object-cover mr-3 border-2 border-rose-200"
              />
            ) : (
              <div className="w-11 h-11 bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center rounded-full text-white text-lg font-semibold mr-3 shadow-md">
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
                className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium hover:bg-rose-100 transition-colors"
              >
                #{course.name}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={20} />
              <span className="text-base font-semibold text-slate-700">{post.likes} likes</span>
            </div>
            <button className="text-slate-400 hover:text-blue-500 transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          {post.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => onApprove(post.id)}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <Check size={18} /> Approve
              </button>
              <button
                onClick={() => onReject(post.id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
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

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    setSelectedPost(null);
    showToast('Post approved successfully!', 'success');
  };

  const handleReject = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    setSelectedPost(null);
    showToast('Post rejected', 'error');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      setPosts(prev => prev.filter(p => p.id !== id));
      showToast('Post deleted', 'success');
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
          <h2 className="text-2xl font-bold text-slate-900">Manage Posts</h2>
          <p className="text-sm text-slate-500 mt-1">Review and moderate user-generated content</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
          <Filter size={16} className="text-slate-400 ml-2" />
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? status === 'pending' ? 'bg-amber-500 text-white shadow-md' :
                    status === 'approved' ? 'bg-green-500 text-white shadow-md' :
                    status === 'rejected' ? 'bg-red-500 text-white shadow-md' :
                    'bg-slate-800 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
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
              <div key={post.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm shadow-lg ${
                    post.status === 'pending' ? 'bg-amber-500/90 text-white' :
                    post.status === 'approved' ? 'bg-green-500/90 text-white' :
                    'bg-red-500/90 text-white'
                  }`}>
                    {post.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    {post.avatar ? (
                      <img src={post.avatar} alt={post.user} className="w-9 h-9 rounded-full mr-2.5 border-2 border-rose-200" />
                    ) : (
                      <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center rounded-full text-white text-sm font-semibold mr-2.5 shadow-sm">
                        {post.user?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{post.user}</p>
                      <p className="text-xs text-slate-500">{post.date}</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-base mb-2 text-slate-900 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">{post.description}</p>

                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <Heart className="text-rose-500 fill-rose-500" size={16} />
                    <span className="text-sm font-semibold text-slate-700">{post.likes}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                    >
                      <Eye size={16} /> View
                    </button>
                    {post.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(post.id)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(post.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="bg-slate-500 hover:bg-slate-600 text-white p-2 rounded-lg transition-all shadow-sm hover:shadow-md"
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Filter size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No posts found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filter to see more results</p>
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