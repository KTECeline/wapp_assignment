import React, { useState } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { courses as seed } from '../../data/courses';
import { useConfirm } from '../../components/Confirm';
import { Search, Filter, Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react';

export default function Courses() {
  const [rows, setRows] = useState(seed);
  const [filteredRows, setFilteredRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const { add } = useToast();
  const { confirm } = useConfirm();

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'category', title: 'Category' },
    { key: 'difficulty', title: 'Difficulty' },
    { key: 'enrolled', title: 'Enrolled' },
  ];

  // Filter and search functionality
  React.useEffect(() => {
    let filtered = rows;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.difficulty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(course => course.difficulty === difficultyFilter);
    }

    setFilteredRows(filtered);
  }, [rows, searchTerm, categoryFilter, difficultyFilter]);

  const onSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const record = Object.fromEntries(form.entries());
    record.enrolled = Number(record.enrolled || 0);
    if (editing != null) {
      const next = [...rows];
      next[editing] = record;
      setRows(next);
      add('Course updated');
    } else {
      setRows(prev => [...prev, record]);
      add('Course added');
    }
    setOpen(false);
    setEditing(null);
  };

  // Get unique categories and difficulties for filter options
  const categories = ['All', ...new Set(rows.map(course => course.category))];
  const difficulties = ['All', ...new Set(rows.map(course => course.difficulty))];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Courses</h3>
              <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9433B] to-[#B13A33] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Enrolled</h3>
              <p className="text-2xl font-bold text-gray-900">{rows.reduce((sum, course) => sum + course.enrolled, 0)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EFBF71] to-[#D4A574] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Categories</h3>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FADADD] to-[#F2C2C7] flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
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
              placeholder="Search courses by title, category, or difficulty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-12 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none min-w-[140px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="pl-4 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none min-w-[140px]"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          {/* Add Course Button */}
          <button 
            onClick={() => setOpen(true)} 
            className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredRows.length} of {rows.length} courses</span>
          {(searchTerm || categoryFilter !== 'All' || difficultyFilter !== 'All') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setDifficultyFilter('All');
              }}
              className="text-[#D9433B] hover:text-[#B13A33] transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Courses Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredRows}
          actions={(row) => (
            <div className="flex gap-2">
              <button 
                className="p-2 border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl transition-all duration-200" 
                onClick={() => { setEditing(rows.indexOf(row)); setOpen(true); }}
                title="Edit course"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                className="p-2 bg-[#D9433B] text-white hover:bg-[#B13A33] rounded-xl transition-all duration-200" 
                onClick={async () => { 
                  if (await confirm({ title: 'Delete course?', body: 'This action cannot be undone.' })) { 
                    setRows(prev => prev.filter(r => r !== row)); 
                    add('Course deleted'); 
                  } 
                }}
                title="Delete course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </Card>

      {/* Add/Edit Course Modal */}
      <Modal open={open} onClose={() => { setOpen(false); setEditing(null); }} title={editing != null ? 'Edit Course' : 'Add Course'}
        actions={(
          <>
            <button 
              className="border border-[#D9433B] text-[#D9433B] hover:bg-[#FFF0EE] rounded-xl px-4 py-2 font-medium transition-all duration-200" 
              onClick={() => { setOpen(false); setEditing(null); }}
            >
              Cancel
            </button>
            <button 
              form="course-form" 
              className="bg-[#D9433B] text-white hover:bg-[#B13A33] rounded-xl px-4 py-2 font-medium transition-all duration-200"
            >
              Save
            </button>
          </>
        )}
      >
        <form id="course-form" onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Title</label>
            <input 
              name="title" 
              defaultValue={editing != null ? rows[editing]?.title : ''} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Course title"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Category</label>
              <input 
                name="category" 
                defaultValue={editing != null ? rows[editing]?.category : ''} 
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                placeholder="e.g., Bread, Pastry"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-2">Difficulty</label>
              <input 
                name="difficulty" 
                defaultValue={editing != null ? rows[editing]?.difficulty : ''} 
                className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
                placeholder="e.g., Beginner, Intermediate"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Enrolled</label>
            <input 
              name="enrolled" 
              type="number" 
              defaultValue={editing != null ? rows[editing]?.enrolled : 0} 
              className="w-full rounded-xl border border-[#EADCD2] px-4 py-3 focus:ring-2 focus:ring-[#D9433B] focus:outline-none transition-all duration-200" 
              placeholder="Number of enrolled students"
              min="0"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}