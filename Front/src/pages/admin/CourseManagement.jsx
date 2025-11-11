import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FolderTree, BarChart3, Lightbulb, UtensilsCrossed, ListOrdered, HelpCircle, Plus, Settings, TrendingUp, Star } from 'lucide-react';
import { getCourses, getCategories, getLevels } from '../../api/client';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`} style={{ borderColor: 'var(--border)' }}>
    {children}
  </div>
);

export default function CourseManagement() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, categoriesData, levelsData] = await Promise.all([
        getCourses(),
        getCategories(),
        getLevels()
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
      setLevels(levelsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average rating from courses
  const avgRating = courses.length > 0 
    ? (courses.reduce((acc, course) => acc + (course.rating || 0), 0) / courses.length).toFixed(1)
    : '0.0';

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, change: '', color: 'var(--accent)' },
    { label: 'Categories', value: categories.length, icon: FolderTree, change: '', color: 'var(--accent)' },
    { label: 'Levels', value: levels.length, icon: BarChart3, change: '', color: 'var(--accent)' },
    { label: 'Avg Rating', value: avgRating, icon: Star, change: '', color: 'var(--accent)' }
  ];

  const managementCards = [
    {
      title: 'Manage Courses',
      description: 'Create, edit, and delete courses. Add videos, images, and content.',
      icon: BookOpen,
      path: '/admin/courses',
      color: 'var(--accent)',
      bgColor: 'var(--surface)',
      // show an explicit call-to-action instead of count so it's clear this goes to the courses list
      stats: 'View all courses'
    },
    {
      title: 'Course Categories',
      description: 'Organize courses into categories with custom images and banners.',
      icon: FolderTree,
      path: '/admin/course-categories',
      color: 'var(--accent)',
      bgColor: 'var(--surface)',
      stats: `${categories.length} categories`
    }
  ];

  const courseComponentCards = [
    {
      title: 'Course Tips',
      description: 'Add helpful cooking tips and tricks to courses.',
      icon: Lightbulb,
      path: '/admin/courses/edit',
      color: 'var(--accent-dark)',
      badge: 'In Course Editor'
    },
    {
      title: 'Ingredients & Prep',
      description: 'Manage ingredients, measurements, and prep items.',
      icon: UtensilsCrossed,
      path: '/admin/courses/edit',
      color: 'var(--accent-dark)',
      badge: 'In Course Editor'
    },
    {
      title: 'Cooking Steps',
      description: 'Add step-by-step instructions with images.',
      icon: ListOrdered,
      path: '/admin/courses/edit',
      color: 'var(--accent-dark)',
      badge: 'In Course Editor'
    },
    {
      title: 'Quiz Questions',
      description: 'Create MCQ and drag-drop quiz questions.',
      icon: HelpCircle,
      path: '/admin/courses/edit',
      color: 'var(--accent-dark)',
      badge: 'In Course Editor'
    }
  ];

  const quickActions = [
    {
      label: 'New Course',
      icon: Plus,
      action: () => navigate('/admin/courses/edit', { state: { mode: 'create' } }),
      primary: true
    },
    {
      label: 'View All Courses',
      icon: BookOpen,
      action: () => navigate('/admin/courses')
    },
    
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Content - Show when not loading */}
        {!loading && (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
                <p className="text-gray-600">Complete control over your learning platform content</p>
              </div>
              <button
                onClick={() => navigate('/admin/courses/edit', { state: { mode: 'create' } })}
                className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create New Course
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'var(--surface)' }} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: stat.color }}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full border" style={{ color: 'var(--accent-dark)', backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Main Management Cards */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                Core Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {managementCards.map((card, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    onClick={() => navigate(card.path)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: card.bgColor }}>
                        <card.icon className="w-8 h-8" style={{ color: card.color }} />
                      </div>
                      <TrendingUp className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{card.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--accent-dark)' }}>{card.stats}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(card.path); }}
                        className="text-xs font-medium text-gray-400 group-hover:text-[var(--accent)] transition-colors focus:outline-none"
                        aria-label={`Manage ${card.title}`}
                      >
                        Manage →
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Course Components */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    Course Components
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">These are managed within the Course Editor</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {courseComponentCards.map((card, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-md transition-all duration-300 cursor-pointer relative"
                    onClick={() => navigate(card.path)}
                  >
                    <div className="absolute top-4 right-4">
                      <span className="text-xs px-2 py-1 rounded-full border font-medium" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                        {card.badge}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl mb-3 inline-block group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--surface)' }}>
                      <card.icon className="w-6 h-6" style={{ color: card.color }} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{card.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}