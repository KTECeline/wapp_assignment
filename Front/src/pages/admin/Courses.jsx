import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, BookOpen, Users, BarChart3 } from 'lucide-react';
import { getCourses, deleteCourse } from '../../api/client';
import { useToast } from '../../components/Toast';

// Note: All accents on this page use red; neutral grays are reserved for text only.

export default function CoursesSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { add } = useToast();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourses();
      setCourses(data);
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

  const nextCourse = () => {
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  const prevCourse = () => {
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  const handleDelete = async () => {
    if (!courses[currentIndex]) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${courses[currentIndex].title}"?`);
    if (!confirmDelete) return;

    try {
      await deleteCourse(courses[currentIndex].courseId);
      add('Course deleted successfully', 'success');
      await fetchCourses();
      // Adjust index if we deleted the last item
      if (currentIndex >= courses.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      add('Failed to delete course', 'error');
    }
  };

  const handleEdit = () => {
    if (!courses[currentIndex]) return;
    const course = courses[currentIndex];
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
          <button
            onClick={handleAddCourse}
            className="flex items-center gap-2 bg-[#D9433B] hover:bg-[#B13A33] text-white px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95 text-sm font-medium"
          >
            <Plus size={20} />
            Add Course
          </button>
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
            <div
              className="bg-white rounded-2xl shadow-md p-6 md:p-8 border min-h-[420px] flex flex-col justify-between"
              style={{ borderColor: '#F2E6E0' }}
              key={currentIndex}
            >
              {/* Course Number Badge */}
              <div className="absolute top-5 right-5 bg-[#D9433B] text-white px-3 py-1.5 rounded-full font-medium text-xs shadow-sm">
                {currentIndex + 1} / {courses.length}
              </div>

              {/* Content */}
              {/* Banner Image */}
              {courses[currentIndex].courseImg && (
                <div className="w-full h-48 mb-4 overflow-hidden rounded-xl">
                  <img src={resolveImage(courses[currentIndex].courseImg)} alt={courses[currentIndex].title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-6">
                {/* Category Badge */}
                <div className="inline-block">
                  <span className="bg-[#FFF8F2] text-[#B13A33] px-3 py-1 rounded-full text-xs font-medium border" style={{ borderColor: '#F2E6E0' }}>
                    {courses[currentIndex].category?.title || 'Uncategorized'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug">
                  {courses[currentIndex].title}
                </h2>

                {/* Description */}
                {courses[currentIndex].description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {courses[currentIndex].description}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-3 bg-[#FFF8F2] p-4 rounded-xl border" style={{ borderColor: '#F2E6E0' }}>
                    <div className="bg-[#D9433B] p-2.5 rounded-lg">
                      <BarChart3 className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Difficulty</p>
                      <p className="text-base font-semibold text-gray-900">{courses[currentIndex].level?.title || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#FFF8F2] p-4 rounded-xl border" style={{ borderColor: '#F2E6E0' }}>
                    <div className="bg-[#D9433B] p-2.5 rounded-lg">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Servings</p>
                      <p className="text-base font-semibold text-gray-900">{courses[currentIndex].servings || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#FFF8F2] p-4 rounded-xl border" style={{ borderColor: '#F2E6E0' }}>
                    <div className="bg-[#D9433B] p-2.5 rounded-lg">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Cook Time</p>
                      <p className="text-base font-semibold text-gray-900">{courses[currentIndex].cookingTimeMin || 0} min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
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
          {courses.map((_, index) => (
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
            {courses.map((course, index) => (
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

        {/* Keyboard Hint */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            💡 Use arrow keys ← → to navigate between courses
          </p>
        </div>
      </div>
      )}
    </div>
  );
}