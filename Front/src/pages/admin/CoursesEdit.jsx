import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { motion } from 'framer-motion';
import { Save, ListChecks, ChevronRight, ImagePlus, Video, Lightbulb, UtensilsCrossed, ListOrdered, HelpCircle, Plus, Trash2, Clock, Users as UsersIcon, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../../components/Toast';
import DropUpload from '../../components/DropUpload.jsx';

// Mock data for levels and categories - replace with API calls
const mockLevels = [
  { id: 1, title: 'Beginner' },
  { id: 2, title: 'Intermediate' },
  { id: 3, title: 'Advanced' }
];

const mockCategories = [
  { id: 1, title: 'Bread' },
  { id: 2, title: 'Pastry' },
  { id: 3, title: 'Cake' },
  { id: 4, title: 'Cookies' }
];

const seedQuestions = [
  { id: 1, title: 'What is gluten?', content: 'Explain how gluten forms and its role in bread structure.', type: 'mcq', options: ['Protein', 'Sugar', 'Fat', 'Water'], correctAnswer: 0 },
  { id: 2, title: 'Ideal dough temperature', content: 'What is the ideal dough temperature for sourdough bulk fermentation?', type: 'mcq', options: ['18°C', '22–24°C', '28°C', '35°C'], correctAnswer: 1 }
];

export default function CoursesEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseFromState = location.state?.course;
  const mode = location.state?.mode || (courseFromState ? 'edit' : 'edit');
  const { add } = useToast();

  // Active section management
  const [activeSection, setActiveSection] = useState('basic');

  // Course Meta
  const [courseMeta, setCourseMeta] = useState({
    title: courseFromState?.title || '',
    description: courseFromState?.description || '',
    category: courseFromState?.category || '',
    categoryId: courseFromState?.categoryId || 1,
    difficulty: courseFromState?.difficulty || '',
    levelId: courseFromState?.levelId || 1,
    cookingTime: courseFromState?.cookingTime || '',
    servings: courseFromState?.servings || '',
    courseType: courseFromState?.courseType || 'Recipe',
    video: courseFromState?.video || '',
    courseImage: undefined,
    badgeImage: undefined,
    quizBadgeImage: undefined
  });

  // Tips
  const [tips, setTips] = useState([
    { id: 1, description: 'Always use room temperature eggs for better mixing.' },
    { id: 2, description: 'Preheat your oven at least 15 minutes before baking.' }
  ]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [tipForm, setTipForm] = useState({ description: '' });

  // Prep Items (Ingredients)
  const [prepItems, setPrepItems] = useState([
    { id: 1, title: 'All-Purpose Flour', description: 'Sifted', amount: 2, metric: 'cups', type: 'Dry', itemImg: '' },
    { id: 2, title: 'Sugar', description: 'Granulated', amount: 1, metric: 'cup', type: 'Dry', itemImg: '' }
  ]);
  const [selectedPrepItem, setSelectedPrepItem] = useState(null);
  const [prepItemForm, setPrepItemForm] = useState({ title: '', description: '', amount: '', metric: '', type: 'Dry', itemImg: undefined });

  // Course Steps
  const [steps, setSteps] = useState([
    { id: 1, step: 1, description: 'Preheat the oven to 350°F (175°C).', stepImg: '' },
    { id: 2, step: 2, description: 'Mix flour, sugar, and salt in a large bowl.', stepImg: '' }
  ]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [stepForm, setStepForm] = useState({ step: '', description: '', stepImg: undefined });

  // Questions
  const [questions, setQuestions] = useState(() => (mode === 'create' ? [] : seedQuestions));
  const [selectedQuestion, setSelectedQuestion] = useState(() => (mode === 'create' ? null : (seedQuestions[0]?.id ?? null)));
  const [questionForm, setQuestionForm] = useState({ title: '', content: '', type: 'mcq', options: [], correctAnswer: 0 });

  const selectedQuestionObj = useMemo(() => questions.find(q => q.id === selectedQuestion) || null, [questions, selectedQuestion]);

  // Collapsed sections state
  const [collapsedSections, setCollapsedSections] = useState({
    tips: false,
    prepItems: false,
    steps: false,
    questions: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (selectedQuestionObj) setQuestionForm({
      title: selectedQuestionObj.title,
      content: selectedQuestionObj.content,
      type: selectedQuestionObj.type,
      options: selectedQuestionObj.options || [],
      correctAnswer: selectedQuestionObj.correctAnswer || 0
    });
  }, [selectedQuestionObj]);

  useEffect(() => {
    if (selectedTip) setTipForm({ description: selectedTip.description });
  }, [selectedTip]);

  useEffect(() => {
    if (selectedPrepItem) setPrepItemForm({
      title: selectedPrepItem.title,
      description: selectedPrepItem.description,
      amount: selectedPrepItem.amount,
      metric: selectedPrepItem.metric,
      type: selectedPrepItem.type,
      itemImg: undefined
    });
  }, [selectedPrepItem]);

  useEffect(() => {
    if (selectedStep) setStepForm({
      step: selectedStep.step,
      description: selectedStep.description,
      stepImg: undefined
    });
  }, [selectedStep]);

  const onChangeCourseMeta = (e) => {
    const { name, value } = e.target;
    setCourseMeta(prev => ({ ...prev, [name]: value }));
  };

  const onSaveCourse = () => {
    const courseData = {
      ...courseMeta,
      tips,
      prepItems,
      steps,
      questions
    };
    console.log('Saving course:', courseData);
    add(`${mode === 'create' ? 'Course created' : 'Course updated'} successfully!`);
    // TODO: API call to save course
  };

  // Tips handlers
  const onAddTip = () => {
    const newId = Date.now();
    const newTip = { id: newId, description: '' };
    setTips(prev => [...prev, newTip]);
    setSelectedTip(newTip);
    setTipForm({ description: '' });
  };

  const onSaveTip = () => {
    if (!selectedTip) return;
    setTips(prev => prev.map(t => t.id === selectedTip.id ? { ...t, ...tipForm } : t));
    add('Tip saved');
  };

  const onDeleteTip = (id) => {
    setTips(prev => prev.filter(t => t.id !== id));
    if (selectedTip?.id === id) setSelectedTip(null);
    add('Tip deleted');
  };

  // Prep Items handlers
  const onAddPrepItem = () => {
    const newId = Date.now();
    const newItem = { id: newId, title: '', description: '', amount: '', metric: '', type: 'Dry', itemImg: '' };
    setPrepItems(prev => [...prev, newItem]);
    setSelectedPrepItem(newItem);
    setPrepItemForm({ title: '', description: '', amount: '', metric: '', type: 'Dry', itemImg: undefined });
  };

  const onSavePrepItem = () => {
    if (!selectedPrepItem) return;
    setPrepItems(prev => prev.map(p => p.id === selectedPrepItem.id ? { ...p, ...prepItemForm } : p));
    add('Ingredient saved');
  };

  const onDeletePrepItem = (id) => {
    setPrepItems(prev => prev.filter(p => p.id !== id));
    if (selectedPrepItem?.id === id) setSelectedPrepItem(null);
    add('Ingredient deleted');
  };

  // Steps handlers
  const onAddStep = () => {
    const newId = Date.now();
    const newStep = { id: newId, step: steps.length + 1, description: '', stepImg: '' };
    setSteps(prev => [...prev, newStep]);
    setSelectedStep(newStep);
    setStepForm({ step: steps.length + 1, description: '', stepImg: undefined });
  };

  const onSaveStep = () => {
    if (!selectedStep) return;
    setSteps(prev => prev.map(s => s.id === selectedStep.id ? { ...s, ...stepForm } : s));
    add('Step saved');
  };

  const onDeleteStep = (id) => {
    setSteps(prev => prev.filter(s => s.id !== id));
    if (selectedStep?.id === id) setSelectedStep(null);
    add('Step deleted');
  };

  // Questions handlers
  const onAddQuestion = () => {
    const newId = Date.now();
    const newQ = { id: newId, title: '', content: '', type: 'mcq', options: [], correctAnswer: 0 };
    setQuestions(prev => [...prev, newQ]);
    setSelectedQuestion(newId);
    setQuestionForm({ title: '', content: '', type: 'mcq', options: [], correctAnswer: 0 });
  };

  const onSaveQuestion = () => {
    if (!selectedQuestionObj) return;
    setQuestions(prev => prev.map(q => q.id === selectedQuestionObj.id ? { ...q, ...questionForm } : q));
    add('Question saved');
  };

  const onDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (selectedQuestion === id) setSelectedQuestion(null);
    add('Question deleted');
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: ImagePlus },
    { id: 'tips', label: 'Tips', icon: Lightbulb, count: tips.length },
    { id: 'ingredients', label: 'Ingredients', icon: UtensilsCrossed, count: prepItems.length },
    { id: 'steps', label: 'Steps', icon: ListOrdered, count: steps.length },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, count: questions.length }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/courses')}
              className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {mode === 'create' ? 'Create New Course' : `Edit: ${courseMeta.title || 'Untitled Course'}`}
              </h1>
              <p className="text-gray-600 mt-1">Fill in all sections to create a complete course</p>
            </div>
          </div>
          <button
            onClick={onSaveCourse}
            className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Save className="w-5 h-5" />
            Save Course
          </button>
        </div>

        {/* Section Navigation */}
        <Card className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'bg-white border text-gray-700 hover:bg-[var(--surface)]'
                }`}
                style={activeSection !== section.id ? { borderColor: 'var(--border)' } : {}}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
                {section.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeSection === section.id ? 'bg-white/20' : 'bg-[var(--surface)]'
                  }`}>
                    {section.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImagePlus className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Course Basic Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Course Title *</label>
                  <input
                    name="title"
                    value={courseMeta.title}
                    onChange={onChangeCourseMeta}
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="e.g., The Art of Sourdough Bread"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={courseMeta.description}
                    onChange={onChangeCourseMeta}
                    className="w-full min-h-32 rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Describe what students will learn in this course..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Category *</label>
                    <select
                      name="categoryId"
                      value={courseMeta.categoryId}
                      onChange={onChangeCourseMeta}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {mockCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Difficulty Level *</label>
                    <select
                      name="levelId"
                      value={courseMeta.levelId}
                      onChange={onChangeCourseMeta}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {mockLevels.map(level => (
                        <option key={level.id} value={level.id}>{level.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Cooking Time (min)
                    </label>
                    <input
                      name="cookingTime"
                      type="number"
                      value={courseMeta.cookingTime}
                      onChange={onChangeCourseMeta}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="45"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                      <UsersIcon className="w-4 h-4" />
                      Servings
                    </label>
                    <input
                      name="servings"
                      type="number"
                      value={courseMeta.servings}
                      onChange={onChangeCourseMeta}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Course Type</label>
                    <input
                      name="courseType"
                      value={courseMeta.courseType}
                      onChange={onChangeCourseMeta}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Recipe, Tutorial, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video URL
                  </label>
                  <input
                    name="video"
                    value={courseMeta.video}
                    onChange={onChangeCourseMeta}
                    className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Right Column - Image Uploads */}
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    Course Cover Image *
                  </label>
                  <DropUpload
                    value={courseMeta.courseImage}
                    onChange={(file) => setCourseMeta(prev => ({ ...prev, courseImage: file }))}
                    description="Main course image"
                    className="bg-white h-48"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Badge Image</label>
                  <DropUpload
                    value={courseMeta.badgeImage}
                    onChange={(file) => setCourseMeta(prev => ({ ...prev, badgeImage: file }))}
                    description="Completion badge"
                    className="bg-white h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Quiz Badge Image</label>
                  <DropUpload
                    value={courseMeta.quizBadgeImage}
                    onChange={(file) => setCourseMeta(prev => ({ ...prev, quizBadgeImage: file }))}
                    description="Quiz completion badge"
                    className="bg-white h-32"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tips Section */}
        {activeSection === 'tips' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list */}
            <Card className="lg:col-span-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h2 className="text-lg font-semibold">Course Tips</h2>
                </div>
                <button onClick={onAddTip} className="btn btn-outline btn-sm">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="max-h-[60vh] overflow-auto pr-1 space-y-2">
                {tips.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
                    No tips yet. Click "Add" to create one.
                  </div>
                ) : (
                  tips.map((tip) => {
                    const active = tip.id === selectedTip?.id;
                    return (
                      <motion.div
                        key={tip.id}
                        layout
                        onClick={() => setSelectedTip(tip)}
                        className={`cursor-pointer rounded-xl border px-4 py-3 text-sm flex items-center justify-between ${active ? 'bg-[var(--surface)]' : 'bg-white'} transition-colors hover:shadow-sm`}
                        style={{ borderColor: 'var(--border)' }}
                        whileHover={{ y: -1 }}
                      >
                        <div className="truncate pr-2 flex-1">
                          <div className="font-medium truncate" style={{ color: active ? 'var(--accent-dark)' : 'inherit' }}>
                            {tip.description || 'Untitled tip'}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Right editor */}
            <Card className="lg:col-span-8">
              <h2 className="text-lg font-bold mb-4">
                {selectedTip ? 'Edit Tip' : 'Select or Create a Tip'}
              </h2>
              {selectedTip ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tip Description</label>
                    <textarea
                      value={tipForm.description}
                      onChange={(e) => setTipForm({ description: e.target.value })}
                      className="w-full min-h-32 rounded-xl border p-3 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Enter a helpful cooking tip..."
                    />
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => onDeleteTip(selectedTip.id)} className="btn btn-danger">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button onClick={onSaveTip} className="btn btn-primary">
                      <Save className="w-4 h-4" /> Save Tip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-6 text-center" style={{ borderColor: 'var(--border)' }}>
                  Select a tip from the list or click "Add" to create a new one.
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Ingredients Section */}
        {activeSection === 'ingredients' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h2 className="text-lg font-semibold">Ingredients</h2>
                </div>
                <button onClick={onAddPrepItem} className="btn btn-outline btn-sm">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="max-h-[60vh] overflow-auto pr-1 space-y-2">
                {prepItems.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
                    No ingredients yet.
                  </div>
                ) : (
                  prepItems.map((item) => {
                    const active = item.id === selectedPrepItem?.id;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        onClick={() => setSelectedPrepItem(item)}
                        className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${active ? 'bg-[var(--surface)]' : 'bg-white'} transition-colors hover:shadow-sm`}
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="font-medium" style={{ color: active ? 'var(--accent-dark)' : 'inherit' }}>
                          {item.title || 'Untitled ingredient'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.amount} {item.metric}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>

            <Card className="lg:col-span-8">
              <h2 className="text-lg font-bold mb-4">
                {selectedPrepItem ? 'Edit Ingredient' : 'Select or Create an Ingredient'}
              </h2>
              {selectedPrepItem ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ingredient Name *</label>
                    <input
                      value={prepItemForm.title}
                      onChange={(e) => setPrepItemForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="e.g., All-Purpose Flour"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <input
                      value={prepItemForm.description}
                      onChange={(e) => setPrepItemForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="e.g., Sifted"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount</label>
                      <input
                        type="number"
                        value={prepItemForm.amount}
                        onChange={(e) => setPrepItemForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                        style={{ borderColor: 'var(--border)' }}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Metric</label>
                      <input
                        value={prepItemForm.metric}
                        onChange={(e) => setPrepItemForm(prev => ({ ...prev, metric: e.target.value }))}
                        className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                        style={{ borderColor: 'var(--border)' }}
                        placeholder="cups"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={prepItemForm.type}
                        onChange={(e) => setPrepItemForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <option value="Dry">Dry</option>
                        <option value="Wet">Wet</option>
                        <option value="Fresh">Fresh</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => onDeletePrepItem(selectedPrepItem.id)} className="btn btn-danger">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button onClick={onSavePrepItem} className="btn btn-primary">
                      <Save className="w-4 h-4" /> Save Ingredient
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-6 text-center" style={{ borderColor: 'var(--border)' }}>
                  Select an ingredient or click "Add" to create one.
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Steps Section */}
        {activeSection === 'steps' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h2 className="text-lg font-semibold">Cooking Steps</h2>
                </div>
                <button onClick={onAddStep} className="btn btn-outline btn-sm">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="max-h-[60vh] overflow-auto pr-1 space-y-2">
                {steps.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
                    No steps yet.
                  </div>
                ) : (
                  steps.map((step) => {
                    const active = step.id === selectedStep?.id;
                    return (
                      <motion.div
                        key={step.id}
                        layout
                        onClick={() => setSelectedStep(step)}
                        className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${active ? 'bg-[var(--surface)]' : 'bg-white'} transition-colors hover:shadow-sm`}
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                            {step.step}
                          </div>
                          <div className="font-medium truncate flex-1" style={{ color: active ? 'var(--accent-dark)' : 'inherit' }}>
                            {step.description || 'Untitled step'}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>

            <Card className="lg:col-span-8">
              <h2 className="text-lg font-bold mb-4">
                {selectedStep ? `Edit Step ${selectedStep.step}` : 'Select or Create a Step'}
              </h2>
              {selectedStep ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Step Number</label>
                    <input
                      type="number"
                      value={stepForm.step}
                      onChange={(e) => setStepForm(prev => ({ ...prev, step: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Step Instructions *</label>
                    <textarea
                      value={stepForm.description}
                      onChange={(e) => setStepForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full min-h-32 rounded-xl border p-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Describe this cooking step in detail..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Step Image</label>
                    <DropUpload
                      value={stepForm.stepImg}
                      onChange={(file) => setStepForm(prev => ({ ...prev, stepImg: file }))}
                      description="Upload step image"
                      className="bg-white"
                    />
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => onDeleteStep(selectedStep.id)} className="btn btn-danger">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button onClick={onSaveStep} className="btn btn-primary">
                      <Save className="w-4 h-4" /> Save Step
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-6 text-center" style={{ borderColor: 'var(--border)' }}>
                  Select a step or click "Add" to create one.
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Quiz Section */}
        {activeSection === 'quiz' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <h2 className="text-lg font-semibold">Quiz Questions</h2>
                </div>
                <button onClick={onAddQuestion} className="btn btn-outline btn-sm">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="max-h-[60vh] overflow-auto pr-1 space-y-2">
                {questions.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
                    No questions yet.
                  </div>
                ) : (
                  questions.map((q) => {
                    const active = q.id === selectedQuestion;
                    return (
                      <motion.div
                        key={q.id}
                        layout
                        onClick={() => setSelectedQuestion(q.id)}
                        className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${active ? 'bg-[var(--surface)]' : 'bg-white'} transition-colors hover:shadow-sm`}
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="font-medium truncate" style={{ color: active ? 'var(--accent-dark)' : 'inherit' }}>
                          {q.title || 'Untitled question'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {q.type === 'mcq' ? 'Multiple Choice' : 'Drag & Drop'}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>

            <Card className="lg:col-span-8">
              <h2 className="text-lg font-bold mb-4">
                {selectedQuestionObj ? 'Edit Question' : 'Select or Create a Question'}
              </h2>
              {selectedQuestionObj ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Title *</label>
                    <input
                      value={questionForm.title}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Question title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Content</label>
                    <textarea
                      value={questionForm.content}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full min-h-24 rounded-xl border p-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Describe the question..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Type</label>
                    <select
                      value={questionForm.type}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="dragdrop">Drag & Drop</option>
                    </select>
                  </div>
                  {questionForm.type === 'mcq' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Answer Options</label>
                        <button
                          onClick={() => setQuestionForm(prev => ({ ...prev, options: [...prev.options, ''] }))}
                          className="btn btn-outline btn-sm"
                        >
                          <Plus className="w-4 h-4" /> Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {questionForm.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={questionForm.correctAnswer === idx}
                              onChange={() => setQuestionForm(prev => ({ ...prev, correctAnswer: idx }))}
                              className="w-4 h-4"
                            />
                            <input
                              value={opt}
                              onChange={(e) => setQuestionForm(prev => ({
                                ...prev,
                                options: prev.options.map((o, i) => i === idx ? e.target.value : o)
                              }))}
                              className="flex-1 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                              style={{ borderColor: 'var(--border)' }}
                              placeholder={`Option ${idx + 1}`}
                            />
                            <button
                              onClick={() => setQuestionForm(prev => ({
                                ...prev,
                                options: prev.options.filter((_, i) => i !== idx)
                              }))}
                              className="btn btn-danger btn-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <button onClick={() => onDeleteQuestion(selectedQuestionObj.id)} className="btn btn-danger">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button onClick={onSaveQuestion} className="btn btn-primary">
                      <Save className="w-4 h-4" /> Save Question
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-6 text-center" style={{ borderColor: 'var(--border)' }}>
                  Select a question or click "Add" to create one.
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
