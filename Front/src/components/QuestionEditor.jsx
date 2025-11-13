import React, { useState, useEffect } from 'react';
import { Save, Trash2, ImagePlus, Type, Image as ImageIcon } from 'lucide-react';
import DropUpload from './DropUpload';

/**
 * QuestionEditor Component
 * Handles creation and editing of MCQ and Drag & Drop questions
 * 
 * @param {Object} question - The question object being edited
 * @param {Function} onSave - Callback when question is saved
 * @param {Function} onDelete - Callback when question is deleted
 */
export default function QuestionEditor({ question, onSave, onDelete }) {
  const [questionType, setQuestionType] = useState(question?.type || null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    questionImg: undefined,
    correctAnswer: 0,
    options: [],
    items: []
  });

  // Initialize form data when question changes
  useEffect(() => {
    if (question) {
      setQuestionType(question.type || null);
      setFormData({
        title: question.title || '',
        content: question.content || '',
        questionImg: question.questionImg || undefined,
        correctAnswer: question.correctAnswer || 0,
        options: question.options || (question.type === 'mcq' ? Array(4).fill(null).map((_, idx) => ({
          id: `opt-${idx}`,
          text: '',
          image: undefined,
          useImage: false
        })) : Array(4).fill(null).map((_, idx) => ({
          id: `opt-${idx}`,
          text: '',
          image: undefined,
          useImage: false
        }))),
        items: question.items || (question.type === 'dragdrop' ? Array(4).fill(null).map((_, idx) => ({
          id: `item-${idx}`,
          text: '',
          image: undefined,
          useImage: false
        })) : [])
      });
    }
  }, [question]);

  const handleTypeSelection = (type) => {
    setQuestionType(type);
    // Initialize options and items based on type
    if (type === 'mcq') {
      setFormData(prev => ({
        ...prev,
        options: Array(4).fill(null).map((_, idx) => ({
          id: `opt-${idx}`,
          text: '',
          image: undefined,
          useImage: false
        })),
        items: []
      }));
    } else if (type === 'dragdrop') {
      setFormData(prev => ({
        ...prev,
        options: Array(4).fill(null).map((_, idx) => ({
          id: `opt-${idx}`,
          text: '',
          image: undefined,
          useImage: false
        })),
        items: Array(4).fill(null).map((_, idx) => ({
          id: `item-${idx}`,
          text: '',
          image: undefined,
          useImage: false
        }))
      }));
    }
  };

  const handleSave = () => {
    if (!questionType) {
      alert('Please select a question type');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a question title');
      return;
    }

    // Validate that all options are filled
    const hasEmptyOptions = formData.options.some(opt => 
      (!opt.useImage && !opt.text.trim()) || (opt.useImage && !opt.image)
    );
    if (hasEmptyOptions) {
      alert('Please fill in all options');
      return;
    }

    // For drag and drop, validate items
    if (questionType === 'dragdrop') {
      const hasEmptyItems = formData.items.some(item => 
        (!item.useImage && !item.text.trim()) || (item.useImage && !item.image)
      );
      if (hasEmptyItems) {
        alert('Please fill in all items');
        return;
      }
    }

    const questionData = {
      ...question,
      type: questionType,
      title: formData.title,
      content: formData.content,
      questionImg: formData.questionImg,
      correctAnswer: formData.correctAnswer,
      options: formData.options,
      items: formData.items
    };

    console.log('[QuestionEditor] Saving question:', questionData);
    console.log('[QuestionEditor] Question type:', questionType);
    console.log('[QuestionEditor] Options:', formData.options);
    console.log('[QuestionEditor] Items:', formData.items);

    onSave(questionData);
  };

  const updateOption = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => 
        idx === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, idx) => 
        idx === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const toggleOptionType = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => 
        idx === index ? { ...opt, useImage: !opt.useImage, text: '', image: undefined } : opt
      )
    }));
  };

  const toggleItemType = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, idx) => 
        idx === index ? { ...item, useImage: !item.useImage, text: '', image: undefined } : item
      )
    }));
  };

  // Type Selection Screen
  if (!questionType) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Question Type</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose whether this will be a Multiple Choice Question or a Drag & Drop exercise
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTypeSelection('mcq')}
            className="p-6 border-2 rounded-xl hover:border-[var(--accent)] hover:bg-[var(--surface)] transition-all group"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Type className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold mb-1">Multiple Choice</div>
                <div className="text-xs text-gray-600">Question with 4 options (text or image)</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleTypeSelection('dragdrop')}
            className="p-6 border-2 rounded-xl hover:border-[var(--accent)] hover:bg-[var(--surface)] transition-all group"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div className="text-center">
                <div className="font-semibold mb-1">Drag & Drop</div>
                <div className="text-xs text-gray-600">Match 4 items to 4 options</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // MCQ Form
  if (questionType === 'mcq') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Multiple Choice Question</h3>
            <p className="text-sm text-gray-600">Create a question with 4 answer options</p>
          </div>
          <button
            onClick={() => setQuestionType(null)}
            className="text-sm text-gray-600 hover:text-[var(--accent)] px-3 py-1 rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            Change Type
          </button>
        </div>

        {/* Question Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Question Title *</label>
          <input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            style={{ borderColor: 'var(--border)' }}
            placeholder="e.g., What is the ideal temperature for proofing dough?"
          />
        </div>

        {/* Question Content */}
        <div>
          <label className="block text-sm font-medium mb-2">Question Content (optional)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full min-h-24 rounded-xl border p-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            style={{ borderColor: 'var(--border)' }}
            placeholder="Add additional context or instructions..."
          />
        </div>

        {/* Question Image */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <ImagePlus className="w-4 h-4" />
            Question Image (optional)
          </label>
          <DropUpload
            value={formData.questionImg}
            onChange={(fileOrDataUrl) => setFormData(prev => ({ ...prev, questionImg: fileOrDataUrl }))}
            description="Upload an optional image for the question"
            className="bg-white h-40"
          />
        </div>

        {/* Correct Answer Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Correct Answer *</label>
          <select
            value={formData.correctAnswer}
            onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            style={{ borderColor: 'var(--border)' }}
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium mb-3">Answer Options *</label>
          <div className="space-y-3">
            {formData.options.map((opt, idx) => (
              <div key={idx} className="border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      formData.correctAnswer === idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium">Option {idx + 1}</span>
                    {formData.correctAnswer === idx && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Correct Answer
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleOptionType(idx)}
                    className="btn btn-outline btn-sm"
                  >
                    {opt.useImage ? <Type className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    {opt.useImage ? 'Use Text' : 'Use Image'}
                  </button>
                </div>

                {opt.useImage ? (
                  <DropUpload
                    value={opt.image}
                    onChange={(fileOrDataUrl) => updateOption(idx, 'image', fileOrDataUrl)}
                    description={`Upload image for Option ${idx + 1}`}
                    className="bg-white h-32"
                  />
                ) : (
                  <input
                    value={opt.text}
                    onChange={(e) => updateOption(idx, 'text', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder={`Enter text for Option ${idx + 1}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => onDelete(question?.id)} className="btn btn-danger">
            <Trash2 className="w-4 h-4" /> Delete Question
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <Save className="w-4 h-4" /> Save Question
          </button>
        </div>
      </div>
    );
  }

  // Drag & Drop Form
  if (questionType === 'dragdrop') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Drag & Drop Question</h3>
            <p className="text-sm text-gray-600">Create a matching exercise with 4 items and 4 options</p>
          </div>
          <button
            onClick={() => setQuestionType(null)}
            className="text-sm text-gray-600 hover:text-[var(--accent)] px-3 py-1 rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            Change Type
          </button>
        </div>

        {/* Question Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Question Title *</label>
          <input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            style={{ borderColor: 'var(--border)' }}
            placeholder="e.g., Match each ingredient to its category"
          />
        </div>

        {/* Question Content */}
        <div>
          <label className="block text-sm font-medium mb-2">Instructions (optional)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full min-h-20 rounded-xl border p-3 focus:ring-2 focus:ring-[var(--accent)] outline-none"
            style={{ borderColor: 'var(--border)' }}
            placeholder="Drag each item to the correct category..."
          />
        </div>

        {/* Items (Draggable Content) */}
        <div>
          <label className="block text-sm font-medium mb-3">Items (Draggable) *</label>
          <div className="space-y-3">
            {formData.items.map((item, idx) => (
              <div key={idx} className="border rounded-xl p-4 bg-blue-50" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Item {idx + 1}</span>
                  <button
                    onClick={() => toggleItemType(idx)}
                    className="btn btn-outline btn-sm"
                  >
                    {item.useImage ? <Type className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    {item.useImage ? 'Use Text' : 'Use Image'}
                  </button>
                </div>

                {item.useImage ? (
                  <DropUpload
                    value={item.image}
                    onChange={(fileOrDataUrl) => updateItem(idx, 'image', fileOrDataUrl)}
                    description={`Upload image for Item ${idx + 1}`}
                    className="bg-white h-32"
                  />
                ) : (
                  <input
                    value={item.text}
                    onChange={(e) => updateItem(idx, 'text', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder={`Enter text for Item ${idx + 1}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Options (Drop Targets) */}
        <div>
          <label className="block text-sm font-medium mb-3">Options (Drop Targets) *</label>
          <div className="space-y-3">
            {formData.options.map((opt, idx) => (
              <div key={idx} className="border rounded-xl p-4 bg-purple-50" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Option {idx + 1}</span>
                  <button
                    onClick={() => toggleOptionType(idx)}
                    className="btn btn-outline btn-sm"
                  >
                    {opt.useImage ? <Type className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    {opt.useImage ? 'Use Text' : 'Use Image'}
                  </button>
                </div>

                {opt.useImage ? (
                  <DropUpload
                    value={opt.image}
                    onChange={(fileOrDataUrl) => updateOption(idx, 'image', fileOrDataUrl)}
                    description={`Upload image for Option ${idx + 1}`}
                    className="bg-white h-32"
                  />
                ) : (
                  <input
                    value={opt.text}
                    onChange={(e) => updateOption(idx, 'text', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-[var(--accent)] outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder={`Enter text for Option ${idx + 1}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => onDelete(question?.id)} className="btn btn-danger">
            <Trash2 className="w-4 h-4" /> Delete Question
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <Save className="w-4 h-4" /> Save Question
          </button>
        </div>
      </div>
    );
  }

  return null;
}
