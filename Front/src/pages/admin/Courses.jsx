import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/Confirm';
import { courses as seed } from '../../data/courses';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function Courses() {
  const [rows, setRows] = useState(seed);
  const { add } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-red-600 tracking-tight">Courses</h1>
          <p className="text-gray-500 text-sm">Manage and update your course offerings</p>
        </div>
        <button
          onClick={() => navigate('/admin/courses/edit', { state: { mode: 'create' } })}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-95"
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {/* Course Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-[0_6px_20px_rgba(229,57,53,0.15)] border border-red-100 transition-all p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Category:</strong> {course.category}</p>
                <p><strong>Difficulty:</strong> {course.difficulty}</p>
                <p><strong>Enrolled:</strong> {course.enrolled}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate('/admin/courses/edit', { state: { course } })}
                className="flex-1 flex items-center justify-center gap-1 border border-red-400 text-red-600 hover:bg-red-50 font-medium text-sm rounded-lg py-2 transition"
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={async () => {
                  if (await confirm({ title: 'Delete course?', body: 'This action cannot be undone.' })) {
                    setRows((prev) => prev.filter((r) => r !== course));
                    add('Course deleted');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg py-2 transition"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
