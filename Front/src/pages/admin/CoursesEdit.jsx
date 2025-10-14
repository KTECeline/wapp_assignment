import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../components/Card';
import { motion } from 'framer-motion';
import { Save, ListChecks, ChevronRight, ImagePlus } from 'lucide-react';
import { useToast } from '../../components/Toast';
import DropUpload from '../../components/DropUpload.jsx';

// Local mock questions; can be replaced by API later
const seedQuestions = [
  { id: 1, title: 'What is gluten?', content: 'Explain how gluten forms and its role in bread structure.', options: ['Protein', 'Sugar', 'Fat', 'Water'] },
  { id: 2, title: 'Ideal dough temperature', content: 'What is the ideal dough temperature for sourdough bulk fermentation?', options: ['18°C', '22–24°C', '28°C', '35°C'] },
  { id: 3, title: 'Autolyse technique', content: 'Describe the autolyse method and its benefits for dough development.', options: [] },
];

export default function CoursesEdit() {
  const location = useLocation();
  const courseFromState = location.state?.course;
  const mode = location.state?.mode || (courseFromState ? 'edit' : 'edit');
  const [courseMeta, setCourseMeta] = useState({
    title: courseFromState?.title || '',
    category: courseFromState?.category || '',
    difficulty: courseFromState?.difficulty || '',
    image: undefined,
  });
  const [questions, setQuestions] = useState(() => (mode === 'create' ? [] : seedQuestions));
  const [selectedId, setSelectedId] = useState(() => (mode === 'create' ? null : (seedQuestions[0]?.id ?? null)));
  const [form, setForm] = useState({ title: '', content: '', options: [] });
  const { add } = useToast();

  const selected = useMemo(() => questions.find(q => q.id === selectedId) || null, [questions, selectedId]);

  useEffect(() => {
    if (selected) setForm({ title: selected.title, content: selected.content, options: selected.options || [] });
  }, [selected]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onChangeOption = (idx, value) => {
    setForm(prev => ({ ...prev, options: prev.options.map((o, i) => i === idx ? value : o) }));
  };

  const onAddOption = () => setForm(prev => ({ ...prev, options: [...prev.options, ''] }));
  const onRemoveOption = (idx) => setForm(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));

  const onSave = () => {
    if (!selected) return;
    setQuestions(prev => prev.map(q => q.id === selected.id ? { ...q, ...form } : q));
    add('Question saved');
  };

  const onSaveCourse = () => {
    // For now, just toast; later: POST/PUT to backend with meta + questions and optional image upload
    const questionCount = questions.length;
    add(`${mode === 'create' ? 'Course created' : 'Course updated'} (${questionCount} questions)`);
  };

  const onAddQuestion = () => {
    const newId = Date.now();
    const newQ = { id: newId, title: '', content: '', options: [] };
    setQuestions(prev => [...prev, newQ]);
    setSelectedId(newId);
    setForm({ title: '', content: '', options: [] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" style={{ color: 'var(--text)' }}>
      {/* Left list */}
      <Card className="lg:col-span-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h2 className="text-base font-semibold">Questions</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onAddQuestion}>Add Question</button>
        </div>
        <div className="max-h-[60vh] overflow-auto pr-1">
          {questions.length === 0 ? (
            <div className="text-sm text-gray-500 bg-rose-50/40 border rounded-xl p-4" style={{ borderColor: 'var(--beige)' }}>
              No questions yet. Click "Add Question" to create the first one.
            </div>
          ) : (
            <ul className="space-y-2">
              {questions.map((q) => {
                const active = q.id === selectedId;
                return (
                  <motion.li key={q.id} layout onClick={() => setSelectedId(q.id)}
                    className={`cursor-pointer rounded-xl border px-3 py-2 text-sm flex items-center justify-between ${active ? 'bg-rose-50' : 'bg-white'} transition-colors`}
                    style={{ borderColor: 'var(--beige)' }}
                    whileHover={{ y: -1 }}
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium truncate" style={{ color: active ? 'var(--accent-dark)' : 'inherit' }}>{q.title || 'Untitled question'}</div>
                      <div className="text-xs opacity-70 truncate">{q.content || 'No description yet'}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>

      {/* Right editor */}
      <div className="lg:col-span-8 space-y-5">
        <Card
          title={mode === 'create' ? 'Create New Course' : courseFromState ? `Editing: ${courseFromState.title}` : 'Edit Question'}
          subtitle={mode === 'create' ? 'Set course details and add questions' : courseFromState ? `Category: ${courseFromState.category} • Difficulty: ${courseFromState.difficulty}` : 'Update the title, content, and options'}
        >
          {/* Course meta section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title</label>
                <input
                  value={courseMeta.title}
                  onChange={(e) => setCourseMeta(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--beige)' }}
                  placeholder="e.g., The Art of Sourdough"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    value={courseMeta.category}
                    onChange={(e) => setCourseMeta(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--beige)' }}
                    placeholder="e.g., Bread, Pastry, Cake"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <input
                    value={courseMeta.difficulty}
                    onChange={(e) => setCourseMeta(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full rounded-xl border px-3 py-2"
                    style={{ borderColor: 'var(--beige)' }}
                    placeholder="e.g., Beginner, Intermediate, Advanced"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium mb-1 flex items-center gap-2"><ImagePlus className="w-4 h-4" /> Course Cover</label>
              <DropUpload
                value={courseMeta.image}
                onChange={(file) => setCourseMeta(prev => ({ ...prev, image: file }))}
                description="PNG, JPG, GIF, or WEBP"
                className="bg-white"
              />
            </div>
          </div>
          {selected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full rounded-xl border px-3 py-2"
                  style={{ borderColor: 'var(--beige)' }}
                  placeholder="Question title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={onChange}
                  className="w-full min-h-32 rounded-xl border p-3"
                  style={{ borderColor: 'var(--beige)' }}
                  placeholder="Describe the question, include context or details..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Options (optional)</label>
                  <button className="btn btn-outline" onClick={onAddOption}>Add option</button>
                </div>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={opt}
                        onChange={(e) => onChangeOption(idx, e.target.value)}
                        className="flex-1 rounded-xl border px-3 py-2"
                        style={{ borderColor: 'var(--beige)' }}
                        placeholder={`Option ${idx + 1}`}
                      />
                      <button className="btn btn-danger" onClick={() => onRemoveOption(idx)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary inline-flex items-center gap-2" onClick={onSave}>
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-rose-50/40 border rounded-xl p-4" style={{ borderColor: 'var(--beige)' }}>
              Select a question from the list, or click "Add Question" to create one.
            </div>
          )}
        </Card>
        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={onSaveCourse}>Save Course</button>
        </div>
      </div>
    </div>
  );
}
