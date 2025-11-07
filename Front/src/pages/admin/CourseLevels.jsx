import React, { useState } from 'react';
import { BarChart3, Plus, Edit, Trash2, Save, X, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border p-6 ${className}`} style={{ borderColor: 'var(--border)' }}>
    {children}
  </div>
);

// Mock data - replace with API
const initialLevels = [
  { id: 1, title: 'Beginner', description: 'Perfect for those just starting their baking journey', deleted: false, order: 1, color: '#10b981' },
  { id: 2, title: 'Intermediate', description: 'For bakers with some experience looking to expand skills', deleted: false, order: 2, color: '#f59e0b' },
  { id: 3, title: 'Advanced', description: 'Master-level techniques for experienced bakers', deleted: false, order: 3, color: '#ef4444' }
];

export default function CourseLevels() {
  const navigate = useNavigate();
  const { add } = useToast();
  const [levels, setLevels] = useState(initialLevels);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const openCreateModal = () => {
    setEditingLevel(null);
    setFormData({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (level) => {
    setEditingLevel(level);
    setFormData({
      title: level.title,
      description: level.description
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLevel(null);
    setFormData({ title: '', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLevel) {
      // Update existing level
      setLevels(prev => prev.map(lvl =>
        lvl.id === editingLevel.id ? { ...lvl, ...formData } : lvl
      ));
      add('Level updated successfully!');
    } else {
      // Create new level
      const newLevel = {
        id: Date.now(),
        ...formData,
        deleted: false,
        order: levels.length + 1,
        color: '#6366f1'
      };
      setLevels(prev => [...prev, newLevel]);
      add('Level created successfully!');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this level?')) {
      setLevels(prev => prev.map(lvl =>
        lvl.id === id ? { ...lvl, deleted: true } : lvl
      ));
      add('Level deleted');
    }
  };

  const activeLevels = levels.filter(lvl => !lvl.deleted).sort((a, b) => a.order - b.order);

  // Mock course counts per level
  const levelStats = {
    1: 15,
    2: 8,
    3: 5
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/course-management')}
              className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                Course Difficulty Levels
              </h1>
              <p className="text-gray-600 mt-1">Define difficulty levels for your courses</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Level
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Levels</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{activeLevels.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
                <BarChart3 className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
          </Card>
          {activeLevels.map((level) => (
            <Card key={level.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{level.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{levelStats[level.id] || 0}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${level.color}20` }}
                >
                  <Award className="w-6 h-6" style={{ color: level.color }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">courses</p>
            </Card>
          ))}
        </div>

        {/* Levels List */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            All Difficulty Levels
          </h2>
          <div className="space-y-4">
            {activeLevels.map((level, index) => (
              <div
                key={level.id}
                className="group p-6 rounded-xl border hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between">
                  {/* Left Content */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Order Badge */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm"
                      style={{ backgroundColor: level.color }}
                    >
                      {index + 1}
                    </div>

                    {/* Level Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{level.title}</h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: `${level.color}20`, color: level.color }}
                        >
                          Level {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {level.description || 'No description provided'}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{levelStats[level.id] || 0} courses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">Popular</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(level)}
                      className="p-2 border text-[var(--accent-dark)] hover:bg-[var(--surface)] rounded-lg transition-all"
                      style={{ borderColor: 'var(--accent)' }}
                      title="Edit level"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(level.id)}
                      className="p-2 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-lg transition-all shadow-sm"
                      title="Delete level"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Empty State */}
        {activeLevels.length === 0 && (
          <Card className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--surface)] mb-4">
              <BarChart3 className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No levels yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create difficulty levels to help students choose courses</p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Level
            </button>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-2" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--surface)' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">About Difficulty Levels</h3>
              <p className="text-sm text-gray-600">
                Difficulty levels help students choose courses appropriate for their skill level. Common levels include Beginner, Intermediate, and Advanced.
                Each course must be assigned to one difficulty level.
              </p>
            </div>
          </div>
        </Card>

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
                  <BarChart3 className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  {editingLevel ? 'Edit Difficulty Level' : 'Create New Level'}
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">Level Name *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="e.g., Beginner, Intermediate, Advanced"
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
                    placeholder="Describe who this level is for and what skills are expected..."
                  />
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <p className="text-sm text-gray-600">
                    <strong>Tip:</strong> Be clear about the expected skill level. This helps students choose courses that match their abilities.
                  </p>
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
                    {editingLevel ? 'Update Level' : 'Create Level'}
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
