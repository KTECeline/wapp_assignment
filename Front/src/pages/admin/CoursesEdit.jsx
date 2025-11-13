import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { motion } from 'framer-motion';
import { Save, ChevronRight, ImagePlus, Video, Lightbulb, UtensilsCrossed, ListOrdered, HelpCircle, Plus, Trash2, Clock, Users as UsersIcon, ArrowLeft } from 'lucide-react';
import { useToast } from '../../components/Toast';
import DropUpload from '../../components/DropUpload';
import QuestionEditor from '../../components/QuestionEditor';
import { createCourse, updateCourse, getCategories, getLevels, getCourseWithDetails } from '../../api/client.js';
import { tipsAPI, prepItemsAPI, stepsAPI, questionsAPI } from '../../services/api';

export default function CoursesEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseFromState = location.state?.course;
  const mode = location.state?.mode || (courseFromState ? 'edit' : 'create');
  const { add } = useToast();
  // Load categories and levels from database
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, levelsData] = await Promise.all([
          getCategories(),
          getLevels()
        ]);
        setCategories(categoriesData);
        setLevels(levelsData);
      } catch (err) {
        console.error('Error fetching categories/levels:', err);
        add('Error loading form data', 'error');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [add]);
  // Active section management
  const [activeSection, setActiveSection] = useState('basic');
  // Course Meta
  const [courseMeta, setCourseMeta] = useState({
    title: courseFromState?.title || '',
    description: courseFromState?.description || '',
    category: courseFromState?.category || '',
    categoryId: courseFromState?.categoryId || '',
    difficulty: courseFromState?.difficulty || '',
    levelId: courseFromState?.levelId || '',
    cookingTime: courseFromState?.cookingTimeMin || '',
  servings: courseFromState?.servings || '',
  video: courseFromState?.video || '',
    courseImage: courseFromState?.courseImg || undefined,
    badgeImage: courseFromState?.badgeImg || undefined,
    quizBadgeImage: courseFromState?.quizBadgeImg || undefined
  });
  // Set default category and level when data loads
  useEffect(() => {
    if (categories.length > 0 && !courseMeta.categoryId) {
      setCourseMeta(prev => ({ ...prev, categoryId: categories[0].categoryId }));
    }
  }, [categories, courseMeta.categoryId]);
  useEffect(() => {
    if (levels.length > 0 && !courseMeta.levelId) {
      setCourseMeta(prev => ({ ...prev, levelId: levels[0].levelId }));
    }
  }, [levels, courseMeta.levelId]);
  // Tips
  const [tips, setTips] = useState(mode === 'create' ? [] : [
    { id: 1, description: 'Always use room temperature eggs for better mixing.' },
    { id: 2, description: 'Preheat your oven at least 15 minutes before baking.' }
  ]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [tipForm, setTipForm] = useState({ description: '' });
  // Prep Items (Ingredients)
  const [prepItems, setPrepItems] = useState(mode === 'create' ? [] : [
    { id: 1, title: 'All-Purpose Flour', description: 'Sifted', amount: 2, metric: 'cups', type: 'Dry', itemImg: '' },
    { id: 2, title: 'Sugar', description: 'Granulated', amount: 1, metric: 'cup', type: 'Dry', itemImg: '' }
  ]);
  const [selectedPrepItem, setSelectedPrepItem] = useState(null);
  const [prepItemForm, setPrepItemForm] = useState({ title: '', description: '', amount: '', metric: '', type: 'Dry', itemImg: undefined });
  // Course Steps
  const [steps, setSteps] = useState(mode === 'create' ? [] : [
    { id: 1, step: 1, description: 'Preheat the oven to 350°F (175°C).', stepImg: '' },
    { id: 2, step: 2, description: 'Mix flour, sugar, and salt in a large bowl.', stepImg: '' }
  ]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [stepForm, setStepForm] = useState({ step: '', description: '', stepImg: undefined });
  // Questions - supports both MCQ and Drag & Drop types
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const selectedQuestionObj = useMemo(() => questions.find(q => q.id === selectedQuestion) || null, [questions, selectedQuestion]);

  // Keep original server-side IDs so we can detect deletes on update
  const [originalTipIds, setOriginalTipIds] = useState([]);
  const [originalPrepItemIds, setOriginalPrepItemIds] = useState([]);
  const [originalStepIds, setOriginalStepIds] = useState([]);
  const [originalQuestionIds, setOriginalQuestionIds] = useState([]);

  // If we're editing an existing course, fetch full details (tips, prep items, steps, questions)
  useEffect(() => {
    const loadCourseDetails = async () => {
      if (mode !== 'edit') return;
      const id = courseFromState?.courseId || courseFromState?.course_id;
      if (!id) return;
      try {
        const details = await getCourseWithDetails(id);
        console.log('Loaded course details:', details);
        const course = details.course || details.course;
        if (course) {
            setCourseMeta(prev => ({
            ...prev,
            title: course.title || prev.title,
            description: course.description || prev.description,
            categoryId: course.categoryId ?? prev.categoryId,
            levelId: course.levelId ?? prev.levelId,
            cookingTime: course.cookingTimeMin ?? prev.cookingTime,
            servings: course.servings ?? prev.servings,
            video: course.video ?? prev.video,
            courseImage: course.courseImg || prev.courseImage,
            badgeImage: course.badgeImg || prev.badgeImage,
            quizBadgeImage: course.quizBadgeImg || prev.quizBadgeImage
          }));
        }

        // Normalize children arrays - map DB fields to UI fields with proper IDs
        const serverTips = details.tips || [];
        console.log('Server tips raw:', serverTips);
        setTips(serverTips.map(t => ({
          ...t,
          id: t.courseTipId ?? t.course_tip_id,
          description: t.description
        })));
        setOriginalTipIds(serverTips.map(t => t.courseTipId ?? t.course_tip_id).filter(Boolean));

        const serverPrep = details.prepItems || [];
        setPrepItems(serverPrep.map(p => ({
          ...p,
          id: p.coursePrepItemId ?? p.course_prep_item_id,
          title: p.title,
          description: p.description,
          amount: p.amount,
          metric: p.metric,
          type: p.type,
          itemImg: p.itemImg ?? p.item_img ?? ''
        })));
        setOriginalPrepItemIds(serverPrep.map(p => p.coursePrepItemId ?? p.course_prep_item_id).filter(Boolean));

        const serverSteps = details.steps || [];
        setSteps(serverSteps.map(s => ({
          ...s,
          id: s.courseStepId ?? s.course_step_id,
          step: s.step,
          description: s.description,
          stepImg: s.courseStepImg ?? s.course_step_img ?? ''
        })));
        setOriginalStepIds(serverSteps.map(s => s.courseStepId ?? s.course_step_id).filter(Boolean));

        const serverQuestions = details.questions || [];
        setQuestions(serverQuestions.map(q => ({
          ...q,
          id: q.questionId ?? q.question_id,
          title: q.questionText ?? q.question_text ?? q.title ?? '',
          content: q.questionText ?? q.question_text ?? q.content ?? '',
          type: q.questionType ?? q.question_type ?? null,  // Use actual type from DB
          questionImg: q.questionImg ?? q.question_img ?? undefined,
          correctAnswer: q.correctAnswer ?? q.question_answer ?? 0,
          options: (q.options || q.optionsList || []).map((opt, idx) => ({
            id: opt.optionId ?? opt.option_id ?? `${q.questionId ?? q.question_id}-opt-${idx}`,
            text: opt.optionText ?? opt.option_text ?? opt.text ?? '',
            image: opt.optionImg ?? opt.option_img ?? opt.image ?? undefined,
            useImage: !!(opt.optionImg ?? opt.option_img ?? opt.image)
          })),
          items: (q.items || q.itemsList || []).map((item, idx) => ({
            id: item.itemId ?? item.item_id ?? `${q.questionId ?? q.question_id}-item-${idx}`,
            text: item.itemText ?? item.item_text ?? item.text ?? '',
            image: item.itemImg ?? item.item_img ?? item.image ?? undefined,
            useImage: !!(item.itemImg ?? item.item_img ?? item.image)
          }))
        })));
        setOriginalQuestionIds(serverQuestions.map(q => q.questionId ?? q.question_id).filter(Boolean));
      } catch (err) {
        console.error('Failed to load course details:', err);
        add('Failed to load full course details', 'error');
      }
    };
    loadCourseDetails();
  }, [mode, courseFromState, add]);
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
      itemImg: selectedPrepItem.itemImg || undefined
    });
  }, [selectedPrepItem]);
  useEffect(() => {
    if (selectedStep) setStepForm({
      step: selectedStep.step,
      description: selectedStep.description,
      stepImg: selectedStep.stepImg || undefined
    });
  }, [selectedStep]);
  const onChangeCourseMeta = (e) => {
    const { name, value } = e.target;
    setCourseMeta(prev => ({ ...prev, [name]: value }));
  };
  const onSaveCourse = async () => {
    // Questions are now managed by QuestionEditor - no need to merge form state
    const questionsToPersist = questions || [];
    try {
      // Validate required fields
      if (!courseMeta.title || !courseMeta.categoryId || !courseMeta.levelId) {
        add('Please fill in all required fields', 'error');
        return;
      }
      // Upload images if they are files or data URLs, otherwise reuse existing URLs
      const uploadMaybe = async (fileOrData) => {
        if (!fileOrData) return '';
        const form = new FormData();

        if (fileOrData instanceof File) {
          form.append('file', fileOrData, fileOrData.name);
        } else if (typeof fileOrData === 'string') {
          if (fileOrData.startsWith('/uploads/') || /^https?:\/\//.test(fileOrData)) {
            return fileOrData;
          }
          // data URL -> convert to blob
          const res = await fetch(fileOrData);
          const blob = await res.blob();
          form.append('file', blob, 'upload.jpg');
        } else {
          return '';
        }

        const r = await fetch('/api/Uploads', { method: 'POST', body: form });
        if (!r.ok) {
          const t = await r.text();
          throw new Error(t || `Failed to upload file: ${r.status}`);
        }
        const json = await r.json();
        // server now returns both relative path and absolute url; prefer absolute
        return json.url || json.path || '';
      };

      const [courseImgData, badgeImgData, quizBadgeImgData] = await Promise.all([
        uploadMaybe(courseMeta.courseImage),
        uploadMaybe(courseMeta.badgeImage),
        uploadMaybe(courseMeta.quizBadgeImage)
      ]);
      // Use exact C# property names (PascalCase)
      const courseData = {
        Title: courseMeta.title,
        Description: courseMeta.description || '',
        CourseImg: courseImgData,
        CookingTimeMin: parseInt(courseMeta.cookingTime) || 0,
        Servings: parseInt(courseMeta.servings) || 0,
        Video: courseMeta.video || '',
        BadgeImg: badgeImgData,
        QuizBadgeImg: quizBadgeImgData,
        LevelId: parseInt(courseMeta.levelId),
        CategoryId: parseInt(courseMeta.categoryId),
        Rating: courseFromState?.rating || 0
      };
      console.log('Saving course data:', courseData); // Debug log
      if (mode === 'create') {
        const newCourse = await createCourse(courseData);
        add('Course created successfully!', 'success');
        console.log('Created course:', newCourse);

        // Persist child entities (tips, prep items, steps, questions)
  const courseId = newCourse?.courseId ?? newCourse?.course_id ?? newCourse?.id ?? (newCourse?.course?.courseId) ?? (newCourse?.course_id);
  console.log('Derived courseId after create:', courseId, 'raw response:', newCourse);
        try {
          // Tips
          await Promise.all(tips.map(async (t) => {
            if (!t || !t.description) return;
            await tipsAPI.create({ Description: t.description, CourseId: courseId });
          }));

          // Prep items (upload images if present)
          await Promise.all(prepItems.map(async (p) => {
            if (!p) return;
            const itemImgUrl = await uploadMaybe(p.itemImg);
            // amount is numeric, metric is a text unit (e.g. "cups"); send metric as string
            const amount = parseFloat(p.amount) || 0;
            const metric = p.metric || '';
            await prepItemsAPI.create({ Title: p.title || '', Description: p.description || '', ItemImg: itemImgUrl, Type: p.type || '', Amount: amount, Metric: metric, CourseId: courseId });
          }));

          // Steps
          await Promise.all(steps.map(async (s, idx) => {
            if (!s) return;
            const stepImgUrl = await uploadMaybe(s.stepImg);
            const stepNumber = s.step || (idx + 1);
            await stepsAPI.create({ Description: s.description || '', Step: stepNumber, CourseStepImg: stepImgUrl, CourseId: courseId });
          }));

          // Questions (create). Upload question and option/item images and include them in payload.
          await Promise.all(questionsToPersist.map(async (q) => {
            if (!q || !q.type) {
              console.log('[CoursesEdit] Skipping question without type:', q);
              return; // Skip questions without a type selected
            }
            try {
              console.log('[CoursesEdit] Processing question:', q);
              const questionImgUrl = await uploadMaybe(q.questionImg);
              
              // Handle options - upload images for options that use images
              const optionsPayload = await Promise.all((q.options || []).map(async (opt) => {
                if (opt.useImage) {
                  const optImg = await uploadMaybe(opt.image);
                  return { OptionText: '', OptionImg: optImg || '' };
                }
                return { OptionText: opt.text || '', OptionImg: '' };
              }));

              // Build base payload
              const payload = {
                QuestionText: q.content || q.title || '',
                QuestionType: q.type,
                QuestionImg: questionImgUrl || '',
                Options: optionsPayload,
                CourseId: courseId
              };

              console.log('[CoursesEdit] Question type:', q.type);
              console.log('[CoursesEdit] Options payload:', optionsPayload);
              console.log('[CoursesEdit] Options payload detailed:', JSON.stringify(optionsPayload, null, 2));

              // For MCQ questions, add correct answer
              if (q.type === 'mcq') {
                payload.CorrectAnswer = q.correctAnswer || 0;
                console.log('[CoursesEdit] MCQ correct answer:', payload.CorrectAnswer);
              }

              // For Drag & Drop questions, add items
              if (q.type === 'dragdrop') {
                const itemsPayload = await Promise.all((q.items || []).map(async (item) => {
                  if (item.useImage) {
                    const itemImg = await uploadMaybe(item.image);
                    return { ItemText: '', ItemImg: itemImg || '' };
                  }
                  return { ItemText: item.text || '', ItemImg: '' };
                }));
                payload.Items = itemsPayload;
                console.log('[CoursesEdit] DragDrop items payload:', itemsPayload);
              }

              console.log('[CoursesEdit] Final payload:', payload);
              await questionsAPI.create(payload);
            } catch (err) {
              console.error('Failed to create question:', q, err);
              // don't block other creations
            }
          }));
        } catch (childErr) {
          console.error('Error saving child entities:', childErr);
          add('Course created but some child items failed to save', 'warning');
        }

        navigate('/admin/courses');
      } else {
        await updateCourse(courseFromState.courseId, courseData);
        add('Course updated successfully!', 'success');

        // Persist child entities: perform create/update/delete based on presence of server IDs
  const courseId = courseFromState?.courseId ?? courseFromState?.course_id ?? courseFromState?.id;
  console.log('Using courseId for update child sync:', courseId, 'from state:', courseFromState);
        try {
          // Helper to extract server id from various naming conventions
          const extractId = (obj, keys) => {
            if (!obj) return undefined;
            // First check server-specific id keys (snake_case from DB)
            const serverKeys = keys.filter(k => k !== 'id');
            for (const k of serverKeys) {
              if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
                const n = Number(obj[k]);
                if (Number.isInteger(n) && n > 0 && n <= 2147483647) return n;
              }
            }
            // Fallback to generic 'id' only if it's a small integer (not a timestamp like Date.now())
            const maybeId = obj['id'];
            if (maybeId !== undefined && maybeId !== null) {
              const n = Number(maybeId);
              // Timestamps from Date.now() are 13+ digits; real DB IDs are typically < 10 digits
              if (Number.isInteger(n) && n > 0 && n <= 2147483647) return n;
            }
            return undefined;
          };

          // Tips
          const currentTipIds = tips.map(t => extractId(t, ['courseTipId', 'course_tip_id', 'id'])).filter(Boolean);
          console.log('Processing tips:', { tips, currentTipIds, originalTipIds });
          // create or update
          await Promise.all(tips.map(async (t) => {
            const id = extractId(t, ['courseTipId', 'course_tip_id', 'id']);
            try {
              if (id) {
                console.log('Updating tip:', id, { Description: t.description, CourseId: courseId });
                await tipsAPI.update(id, { Description: t.description, CourseId: courseId });
              } else if (t.description) {
                console.log('Creating tip:', { Description: t.description, CourseId: courseId });
                await tipsAPI.create({ Description: t.description, CourseId: courseId });
              }
            } catch (err) {
              console.error('Failed to save tip:', t, err);
              throw err;
            }
          }));
          // deletes
          await Promise.all((originalTipIds || []).map(async (origId) => {
            if (!currentTipIds.includes(origId)) {
              try {
                console.log('Deleting tip:', origId);
                await tipsAPI.delete(origId);
              } catch (e) {
                console.warn('Failed to delete tip', origId, e);
              }
            }
          }));

          // Prep items
          const currentPrepIds = prepItems.map(p => extractId(p, ['coursePrepItemId', 'course_prep_item_id', 'id'])).filter(Boolean);
          console.log('Processing prep items:', { prepItems, currentPrepIds, originalPrepItemIds });
          await Promise.all(prepItems.map(async (p) => {
            const id = extractId(p, ['coursePrepItemId', 'course_prep_item_id', 'id']);
            try {
              // Upload image if it's a new file/data URL, otherwise keep existing URL
              const itemImgUrl = await uploadMaybe(p.itemImg);
              const amount = parseFloat(p.amount) || 0;
              const metric = p.metric || '';
              // Use uploaded URL if available, otherwise use existing itemImg value
              const finalItemImg = itemImgUrl || p.itemImg || '';
              const payload = { Title: p.title || '', Description: p.description || '', ItemImg: finalItemImg, Type: p.type || '', Amount: amount, Metric: metric, CourseId: courseId };
              if (id) {
                console.log('Updating prep item:', id, payload);
                await prepItemsAPI.update(id, payload);
              } else {
                console.log('Creating prep item:', payload);
                await prepItemsAPI.create(payload);
              }
            } catch (err) {
              console.error('Failed to save prep item:', p, err);
              throw err;
            }
          }));
          await Promise.all((originalPrepItemIds || []).map(async (origId) => {
            if (!currentPrepIds.includes(origId)) {
              try { await prepItemsAPI.delete(origId); } catch (e) { console.warn('Failed to delete prep item', origId, e); }
            }
          }));

          // Steps
          const currentStepIds = steps.map(s => extractId(s, ['courseStepId', 'course_step_id', 'id'])).filter(Boolean);
          console.log('Processing steps:', { steps, currentStepIds, originalStepIds });
          await Promise.all(steps.map(async (s, idx) => {
            const id = extractId(s, ['courseStepId', 'course_step_id', 'id']);
            try {
              // Upload image if it's a new file/data URL, otherwise keep existing URL
              const stepImgUrl = await uploadMaybe(s.stepImg);
              const stepNumber = s.step || (idx + 1);
              // Use uploaded URL if available, otherwise use existing stepImg value
              const finalStepImg = stepImgUrl || s.stepImg || '';
              const payload = { Description: s.description || '', Step: stepNumber, CourseStepImg: finalStepImg, CourseId: courseId };
              if (id) {
                console.log('Updating step:', id, payload);
                await stepsAPI.update(id, payload);
              } else {
                console.log('Creating step:', payload);
                await stepsAPI.create(payload);
              }
            } catch (err) {
              console.error('Failed to save step:', s, err);
              throw err;
            }
          }));
          await Promise.all((originalStepIds || []).map(async (origId) => {
            if (!currentStepIds.includes(origId)) {
              try { await stepsAPI.delete(origId); } catch (e) { console.warn('Failed to delete step', origId, e); }
            }
          }));

          // Questions
          const currentQuestionIds = questionsToPersist.map(q => extractId(q, ['questionId', 'question_id', 'id'])).filter(Boolean);
          console.log('Processing questions:', { questions: questionsToPersist, currentQuestionIds, originalQuestionIds });
          await Promise.all(questionsToPersist.map(async (q) => {
            if (!q.type) return; // Skip questions without a type selected
            const id = extractId(q, ['questionId', 'question_id', 'id']);
            try {
              // Upload question image and option images where provided
              const questionImgUrl = await uploadMaybe(q.questionImg);
              
              // Handle options - upload images for options that use images
              const optionsPayload = await Promise.all((q.options || []).map(async (opt) => {
                if (opt.useImage) {
                  const optImg = await uploadMaybe(opt.image);
                  return { OptionText: '', OptionImg: optImg || '' };
                }
                return { OptionText: opt.text || '', OptionImg: '' };
              }));

              // Build base payload
              const payload = { 
                QuestionText: q.content || q.title || '', 
                QuestionType: q.type, 
                QuestionImg: questionImgUrl || '', 
                Options: optionsPayload, 
                CourseId: courseId 
              };

              // For MCQ questions, add correct answer
              if (q.type === 'mcq') {
                payload.CorrectAnswer = q.correctAnswer || 0;
              }

              // For Drag & Drop questions, add items
              if (q.type === 'dragdrop') {
                const itemsPayload = await Promise.all((q.items || []).map(async (item) => {
                  if (item.useImage) {
                    const itemImg = await uploadMaybe(item.image);
                    return { ItemText: '', ItemImg: itemImg || '' };
                  }
                  return { ItemText: item.text || '', ItemImg: '' };
                }));
                payload.Items = itemsPayload;
              }

              if (id) {
                console.log('Updating question:', id, payload);
                await questionsAPI.update(id, payload);
              } else {
                console.log('Creating question:', payload);
                await questionsAPI.create(payload);
              }
            } catch (err) {
              console.error('Failed to save question:', q, err);
              throw err;
            }
          }));
          await Promise.all((originalQuestionIds || []).map(async (origId) => {
            if (!currentQuestionIds.includes(origId)) {
              try { await questionsAPI.delete(origId); } catch (e) { console.warn('Failed to delete question', origId, e); }
            }
          }));

        } catch (childErr) {
          console.error('Error saving child entities (update):', childErr);
          add('Course updated but some child items failed to save', 'warning');
        }

        navigate('/admin/courses');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      add(`Failed to ${mode === 'create' ? 'create' : 'update'} course: ${err.message}`, 'error');
    }
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
    // Merge the form data with the selected item, preserving the itemImg if changed
    setPrepItems(prev => prev.map(p => p.id === selectedPrepItem.id ? {
      ...p,
      ...prepItemForm,
      // If itemImg is undefined in form but exists in selected item, keep the original
      itemImg: prepItemForm.itemImg !== undefined ? prepItemForm.itemImg : p.itemImg
    } : p));
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
    // Merge the form data with the selected step, preserving the stepImg if changed
    setSteps(prev => prev.map(s => s.id === selectedStep.id ? {
      ...s,
      ...stepForm,
      // If stepImg is undefined in form but exists in selected step, keep the original
      stepImg: stepForm.stepImg !== undefined ? stepForm.stepImg : s.stepImg
    } : s));
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
    const newQ = { 
      id: newId, 
      title: '', 
      content: '', 
      type: null, // Type will be selected in QuestionEditor
      questionImg: undefined, 
      correctAnswer: 0,
      options: [],
      items: []
    };
    setQuestions(prev => [...prev, newQ]);
    setSelectedQuestion(newId);
  };
  
  const onSaveQuestion = (questionData) => {
    setQuestions(prev => prev.map(q => q.id === questionData.id ? questionData : q));
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
                      disabled={loadingData}
                    >
                      {loadingData ? (
                        <option>Loading...</option>
                      ) : (
                        categories.map(cat => (
                          <option key={cat.categoryId} value={cat.categoryId}>{cat.title}</option>
                        ))
                      )}
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
                      disabled={loadingData}
                    >
                      {loadingData ? (
                        <option>Loading...</option>
                      ) : (
                        levels.map(level => (
                          <option key={level.levelId} value={level.levelId}>{level.title}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  {/* CourseType field removed */}
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
                    onChange={(fileOrDataUrl) => setCourseMeta(prev => ({ ...prev, courseImage: fileOrDataUrl }))}
                    description="Main course image"
                    className="bg-white h-48"
                    enableCrop
                    cropAspect="4/3"
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
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <ImagePlus className="w-4 h-4" />
                      Ingredient Image
                    </label>
                    <DropUpload
                      value={prepItemForm.itemImg}
                      onChange={(fileOrDataUrl) => setPrepItemForm(prev => ({ ...prev, itemImg: fileOrDataUrl }))}
                      description="Upload ingredient image"
                      className="bg-white h-40"
                    />
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
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <ImagePlus className="w-4 h-4" />
                      Step Image
                    </label>
                    <DropUpload
                      value={stepForm.stepImg}
                      onChange={(file) => setStepForm(prev => ({ ...prev, stepImg: file }))}
                      description="Upload step image"
                      className="bg-white h-40"
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
                          {!q.type ? 'Type not selected' : q.type === 'mcq' ? 'MCQ' : 'Drag & Drop'}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>
            <Card className="lg:col-span-8">
              {selectedQuestionObj ? (
                <QuestionEditor
                  question={selectedQuestionObj}
                  onSave={onSaveQuestion}
                  onDelete={onDeleteQuestion}
                />
              ) : (
                <div>
                  <h2 className="text-lg font-bold mb-4">Select or Create a Question</h2>
                  <div className="text-sm text-gray-500 bg-[var(--surface)] border rounded-xl p-6 text-center" style={{ borderColor: 'var(--border)' }}>
                    Select a question from the list or click "Add" to create a new one.
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}