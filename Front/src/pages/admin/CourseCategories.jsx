import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2, Save, X, ImagePlus, ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import DropUpload from '../../components/DropUpload';
import { categoriesAPI, coursesAPI } from '../../services/api';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`} style={{ borderColor: 'var(--border)' }}>
    {children}
  </div>
);

export default function CourseCategories() {
  const navigate = useNavigate();
  const { add } = useToast();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    catImg: '',
    catBanner: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, coursesData] = await Promise.all([
        categoriesAPI.getAll(),
        coursesAPI.getAll()
      ]);
      setCategories(categoriesData);
      setCourses(coursesData);
    } catch (error) {
      add('Failed to load data', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoursesByCategory = (categoryId) => {
    return courses.filter(course => course.categoryId === categoryId);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ title: '', description: '', catImg: undefined, catBanner: undefined });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      description: category.description,
      catImg: category.catImg || '',
      catBanner: category.catBanner || ''
    });
    setIsModalOpen(true);
  };

  const viewCategoryDetails = (category) => {
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ title: '', description: '', catImg: undefined, catBanner: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.categoryId, formData);
        add('Category updated successfully!');
      } else {
        await categoriesAPI.create(formData);
        add('Category created successfully!');
      }
      await fetchData();
      closeModal();
    } catch (error) {
      add('Failed to save category', 'error');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(id);
        add('Category deleted');
        await fetchData();
      } catch (error) {
        add('Failed to delete category', 'error');
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[var(--accent)] border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FolderTree className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                {selectedCategory ? selectedCategory.title : 'Course Categories'}
              </h1>
              <p className="text-gray-600 mt-1">
                {selectedCategory ? `Courses in ${selectedCategory.title}` : 'Browse courses by category'}
              </p>
            </div>
          </div>
          {!selectedCategory ? (
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/courses/edit', { state: { mode: 'create', categoryId: selectedCategory.categoryId } })}
              className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                <FolderTree className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{courses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                <BookOpen className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
          </Card>
          {selectedCategory && (
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Courses in Category</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{getCoursesByCategory(selectedCategory.categoryId).length}</p>
                </div>
                <div className="text-sm" style={{ color: 'var(--accent)' }}>{selectedCategory.title}</div>
              </div>
            </Card>
          )}
        </div>

        {/* Categories or Courses Grid */}
        {!selectedCategory ? (
          // Show categories
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryCoursesCount = getCoursesByCategory(category.categoryId).length;
              return (
                <Card key={category.categoryId} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="relative cursor-pointer"
                    onClick={() => viewCategoryDetails(category)}
                  >
                    {/* Category Icon/Image */}
                    <div className="w-full h-32 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                      {category.catImg ? (
                        <img src={category.catImg} alt={category.title} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <FolderTree className="w-12 h-12" style={{ color: 'var(--accent)' }} />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-between">
                      {category.title}
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {category.description || 'No description provided'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t mb-4" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm font-medium text-gray-600">{categoryCoursesCount} courses</span>
                      <span className="text-xs px-3 py-1 rounded-full border" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(category);
                      }}
                      className="flex-1 border text-[var(--accent-dark)] hover:bg-[var(--surface)] py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm"
                      style={{ borderColor: 'var(--accent)' }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.categoryId);
                      }}
                      className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          // Show courses in selected category
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCoursesByCategory(selectedCategory.categoryId).map((course) => (
              <Card key={course.courseId} className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div onClick={() => navigate('/admin/courses/edit', { state: { course, mode: 'edit' } })}>
                  {/* Course Image */}
                  <div className="w-full h-40 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                    {course.courseImg ? (
                      <img src={course.courseImg} alt={course.title} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <BookOpen className="w-12 h-12" style={{ color: 'var(--accent)' }} />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {course.description || 'No description'}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="px-2 py-1 rounded-full border" style={{ borderColor: 'var(--border)' }}>
                      {course.level?.title || 'N/A'}
                    </span>
                    <span>{course.cookingTimeMin || 0} min</span>
                    {course.servings && <span>{course.servings} servings</span>}
                  </div>

                  {/* Edit Button */}
                  <button className="w-full border text-[var(--accent-dark)] hover:bg-[var(--surface)] py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm"
                    style={{ borderColor: 'var(--accent)' }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit Course
                  </button>
                </div>
              </Card>
            ))}
            {getCoursesByCategory(selectedCategory.categoryId).length === 0 && (
              <Card className="col-span-full text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No courses in this category yet</h3>
                <p className="text-sm text-gray-500 mb-4">Create a new course and assign it to this category</p>
                <button
                  onClick={() => navigate('/admin/courses/edit', { state: { mode: 'create', categoryId: selectedCategory.categoryId } })}
                  className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Course
                </button>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedCategory && categories.length === 0 && (
          <Card className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--surface)] mb-4">
              <FolderTree className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first category to organize courses</p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </Card>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b sticky top-0 bg-white z-10 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <FolderTree className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Category Name *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="e.g., Bread, Pastry, Cake"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full min-h-32 rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Describe this category..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                      <ImagePlus className="w-4 h-4" />
                      Category Image
                    </label>
                    <DropUpload
                      value={formData.catImg}
                      onChange={(file) => setFormData(prev => ({ ...prev, catImg: file }))}
                      description="Icon/thumbnail"
                      className="bg-white h-40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                      <ImagePlus className="w-4 h-4" />
                      Category Banner
                    </label>
                    <DropUpload
                      value={formData.catBanner}
                      onChange={(file) => setFormData(prev => ({ ...prev, catBanner: file }))}
                      description="Wide banner image"
                      className="bg-white h-40"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 border text-gray-700 hover:bg-[var(--surface)] rounded-xl font-medium transition-all duration-200"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}