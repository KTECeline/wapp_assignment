import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, BookOpen, Users, BarChart3, Star } from 'lucide-react';
import { deleteCourse, getCategories } from '../../api/client';
import { useToast } from '../../components/Toast';

// Note: All accents on this page use red; neutral grays are reserved for text only.

export default function CoursesSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { add } = useToast();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Use endpoint that provides total enrollments per course
      const res = await fetch('/api/Courses/withstats');
      const data = await res.json();
      // data is [{ course, totalEnrollments }, ...]
  const mapped = data.map(item => ({ ...item.course, totalEnrollments: item.totalEnrollments }));
  setCourses(mapped);
  // reset current index when refetching
  setCurrentIndex(0);
        // Debug: log course image values so we can verify what the frontend received
        try {
          console.log('Courses fetched (courseImg values):', data.map(c => ({ id: c.courseId, courseImg: c.courseImg })));
        } catch (e) {
          console.log('Courses fetched');
        }
      if (data.length === 0) {
        setError('No courses found. Create your first course!');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      add('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [add]);

  // Fetch categories for filter
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await getCategories();
        if (mounted) setCategories(cats || []);
      } catch (e) {
        console.warn('Failed to load categories for admin filter', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Resolve image paths: prefer absolute backend URL in dev when given a relative '/uploads/...' path
  const resolveImage = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/uploads/')) {
      const host = window.location.hostname;
      const backendPort = '5170';
      return `${window.location.protocol}//${host}:${backendPort}${path}`;
    }
    return path;
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Compute filtered list by selected category
  const filteredCourses = selectedCategoryId
    ? courses.filter(c => c.categoryId === Number(selectedCategoryId))
    : courses;

  const nextCourse = () => {
    if (filteredCourses.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredCourses.length);
  };

  const prevCourse = () => {
    if (filteredCourses.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredCourses.length) % filteredCourses.length);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const handleDelete = async () => {
    const current = filteredCourses[currentIndex];
    if (!current) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${current.title}"?`);
    if (!confirmDelete) return;

    try {
      await deleteCourse(current.courseId);
      add('Course deleted successfully', 'success');
      await fetchCourses();
      // Adjust index if we deleted the last item
      if (currentIndex >= filteredCourses.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      add('Failed to delete course', 'error');
    }
  };

  const handleEdit = () => {
    const course = filteredCourses[currentIndex];
    if (!course) return;
    navigate('/admin/courses/edit', { state: { course, mode: 'edit' } });
  };

  const handleAddCourse = () => {
    navigate('/admin/courses/edit', { state: { mode: 'create' } });
  };

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Course Management</h1>
            <p className="text-gray-600 text-sm md:text-base">Swipe through your course catalog</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedCategoryId ?? ''}
              onChange={(e) => { setSelectedCategoryId(e.target.value === '' ? null : Number(e.target.value)); setCurrentIndex(0); }}
              className="border rounded-xl px-3 py-2 text-sm bg-white"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.title}</option>
              ))}
            </select>

            <button
              onClick={handleAddCourse}
              className="flex items-center gap-2 bg-[#D9433B] hover:bg-[#B13A33] text-white px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 text-sm font-medium"
            >
              <Plus size={20} />
              Add Course
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9433B]"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
            <p className="font-medium">{error}</p>
            {courses.length === 0 && (
              <button
                onClick={handleAddCourse}
                className="mt-4 inline-flex items-center gap-2 bg-[#D9433B] hover:bg-[#B13A33] text-white px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                <Plus size={20} />
                Create First Course
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content - Show when not loading and has courses */}
      {!loading && courses.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="relative">{/* Main Card Container */}
          {/* Large Course Card */}
          <div className="relative overflow-hidden">
            {/* If the selected category yields no courses, show a friendly message */}
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border min-h-[200px] flex flex-col justify-center items-center text-center" style={{ borderColor: '#F2E6E0' }}>
                <p className="text-gray-700 font-medium mb-4">No courses found for the selected category.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedCategoryId(null); setCurrentIndex(0); }}
                    className="bg-[#D9433B] text-white px-4 py-2 rounded-xl"
                  >
                    Clear filter
                  </button>
                </div>
              </div>
            ) : (
              (() => {
                const current = filteredCourses[currentIndex] ?? filteredCourses[0];
                return (
                  <div
                    className="bg-white rounded-2xl shadow-md border min-h-[550px] flex flex-col justify-between relative overflow-hidden"
                    style={{ borderColor: '#F2E6E0' }}
                    key={current.courseId}
                  >
                    {/* Background Image with Overlay */}
                    {current.courseImg && (
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={resolveImage(current.courseImg)} 
                          alt={current.title} 
                          className="w-full h-full object-cover "
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/55 to-white/100"></div>
                      </div>
                    )}

                    {/* Course Number Badge */}
                    <div className="absolute top-5 right-5 bg-[#D9433B] text-white px-3 py-1.5 rounded-full font-medium text-xs shadow-sm z-20">
                      {currentIndex + 1} / {filteredCourses.length}
                    </div>

                    {/* Content - positioned above background */}
                    <div className="relative z-10 p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
                      {/* Category Badge */}
                      <div className="inline-block">
                        <span className="bg-[#FFF8F2] text-[#B13A33] px-3 py-1 rounded-full text-xs font-medium border shadow-sm" style={{ borderColor: '#F2E6E0' }}>
                          {current.category?.title || 'Uncategorized'}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug drop-shadow-sm">
                        {current.title}
                      </h2>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = current.rating || 0;
                            const fillPercentage = Math.max(0, Math.min(100, (rating - (star - 1)) * 100));
                            
                            return (
                              <div key={star} className="relative">
                                {/* Empty star background */}
                                <Star size={18} className="fill-gray-300 text-gray-300" />
                                {/* Filled star overlay with clip */}
                                <div 
                                  className="absolute inset-0 overflow-hidden" 
                                  style={{ width: `${fillPercentage}%` }}
                                >
                                  <Star size={18} className="fill-[#D9433B] text-[#D9433B]" />
                                </div>
                              </div>
                            );
                          })}
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {(current.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {current.description && (
                        <p className="text-gray-700 text-sm line-clamp-2 drop-shadow-sm">
                          {current.description}
                        </p>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border shadow-sm" style={{ borderColor: '#F2E6E0' }}>
                          <div className="bg-[#D9433B] p-2.5 rounded-lg">
                            <BarChart3 className="text-white" size={24} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Difficulty</p>
                            <p className="text-base font-semibold text-gray-900">{current.level?.title || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border shadow-sm" style={{ borderColor: '#F2E6E0' }}>
                          <div className="bg-[#D9433B] p-2.5 rounded-lg">
                            <Users className="text-white" size={24} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Servings</p>
                            <p className="text-base font-semibold text-gray-900">{current.servings || 0}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border shadow-sm" style={{ borderColor: '#F2E6E0' }}>
                          <div className="bg-[#D9433B] p-2.5 rounded-lg">
                            <BookOpen className="text-white" size={24} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Cook Time</p>
                            <p className="text-base font-semibold text-gray-900">{current?.cookingTimeMin ?? 0} min</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border shadow-sm" style={{ borderColor: '#F2E6E0' }}>
                          <div className="bg-[#D9433B] p-2.5 rounded-lg">
                            <Users className="text-white" size={24} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Total Enrollments</p>
                            <p className="text-base font-semibold text-gray-900">{current?.totalEnrollments ?? 0}</p>
                          </div>
                        </div>
                      </div>
                      
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 relative z-10 px-6 md:px-8 pb-6 md:pb-8">
                      <button
                        onClick={handleEdit}
                        className="flex-1 flex items-center justify-center gap-2 border text-[#D9433B] hover:bg-[#FFF8F2] text-sm font-medium rounded-xl py-2.5 transition-all active:scale-95"
                        style={{ borderColor: '#D9433B' }}
                      >
                        <Edit size={20} /> Edit Course
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#D9433B] hover:bg-[#B13A33] text-white text-sm font-medium rounded-xl py-2.5 transition-all active:scale-95 shadow-sm"
                      >
                        <Trash2 size={20} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevCourse}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 bg-white hover:bg-[#FFF8F2] text-[#B13A33] p-3 rounded-full shadow-md transition-all active:scale-90 border"
            style={{ borderColor: '#F2E6E0' }}
            aria-label="Previous course"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextCourse}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 bg-white hover:bg-[#FFF8F2] text-[#B13A33] p-3 rounded-full shadow-md transition-all active:scale-90 border"
            style={{ borderColor: '#F2E6E0' }}
            aria-label="Next course"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {filteredCourses.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? 'bg-[#D9433B] w-10 h-2.5'
                  : 'bg-[#F2E6E0] hover:bg-[#E7D7CF] w-2.5 h-2.5'
              }`}
              aria-label={`Go to course ${index + 1}`}
            />
          ))}
        </div>

        {/* Course List Preview */}
        <div className="mt-10 bg-white rounded-2xl p-5 shadow-md border" style={{ borderColor: '#F2E6E0' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">All Courses</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {filteredCourses.map((course, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`text-left p-4 rounded-xl transition-all ${
                  index === currentIndex
                    ? 'bg-[#D9433B] text-white shadow-sm'
                    : 'bg-[#FFF8F2] hover:bg-[#FFEDEA] text-[#7A2A26] border'
                }`}
                style={{ borderColor: index === currentIndex ? 'transparent' : '#F2E6E0' }}
              >
                <p className="font-medium text-sm truncate">{course.title}</p>
                <p className={`text-xs mt-1 ${index === currentIndex ? 'text-[#FFE1DE]' : 'text-[#B13A33]'}`}>
                  {course.category?.title || 'Uncategorized'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}