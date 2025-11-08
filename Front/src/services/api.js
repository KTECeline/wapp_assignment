// API Base URL - change this to match your backend
const API_BASE_URL = 'http://localhost:5170/api';

// Generic API call helper
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ========== COURSES ==========
export const coursesAPI = {
  getAll: () => apiCall('/courses'),
  getById: (id) => apiCall(`/courses/${id}`),
  getWithDetails: (id) => apiCall(`/courses/${id}/full`),
  create: (course) => apiCall('/courses', {
    method: 'POST',
    body: JSON.stringify(course),
  }),
  update: (id, course) => apiCall(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(course),
  }),
  delete: (id) => apiCall(`/courses/${id}`, { method: 'DELETE' }),
};

// ========== CATEGORIES ==========
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),
  getById: (id) => apiCall(`/categories/${id}`),
  create: (category) => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  update: (id, category) => apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  }),
  delete: (id) => apiCall(`/categories/${id}`, { method: 'DELETE' }),
};

// ========== LEVELS ==========
export const levelsAPI = {
  getAll: () => apiCall('/levels'),
  getById: (id) => apiCall(`/levels/${id}`),
  create: (level) => apiCall('/levels', {
    method: 'POST',
    body: JSON.stringify(level),
  }),
  update: (id, level) => apiCall(`/levels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(level),
  }),
  delete: (id) => apiCall(`/levels/${id}`, { method: 'DELETE' }),
};

// ========== COURSE TIPS ==========
export const tipsAPI = {
  getByCourse: (courseId) => apiCall(`/coursetips/course/${courseId}`),
  create: (tip) => apiCall('/coursetips', {
    method: 'POST',
    body: JSON.stringify(tip),
  }),
  update: (id, tip) => apiCall(`/coursetips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tip),
  }),
  delete: (id) => apiCall(`/coursetips/${id}`, { method: 'DELETE' }),
};

// ========== COURSE PREP ITEMS ==========
export const prepItemsAPI = {
  getByCourse: (courseId) => apiCall(`/courseprepitems/course/${courseId}`),
  create: (item) => apiCall('/courseprepitems', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  update: (id, item) => apiCall(`/courseprepitems/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  delete: (id) => apiCall(`/courseprepitems/${id}`, { method: 'DELETE' }),
};

// ========== COURSE STEPS ==========
export const stepsAPI = {
  getByCourse: (courseId) => apiCall(`/coursesteps/course/${courseId}`),
  create: (step) => apiCall('/coursesteps', {
    method: 'POST',
    body: JSON.stringify(step),
  }),
  update: (id, step) => apiCall(`/coursesteps/${id}`, {
    method: 'PUT',
    body: JSON.stringify(step),
  }),
  delete: (id) => apiCall(`/coursesteps/${id}`, { method: 'DELETE' }),
};

// ========== QUESTIONS ==========
export const questionsAPI = {
  getByCourse: (courseId) => apiCall(`/questions/course/${courseId}`),
  create: (question) => apiCall('/questions', {
    method: 'POST',
    body: JSON.stringify(question),
  }),
  update: (id, question) => apiCall(`/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(question),
  }),
  delete: (id) => apiCall(`/questions/${id}`, { method: 'DELETE' }),
};

// ========== HELP SESSIONS ==========
export const helpSessionsAPI = {
  getAll: () => apiCall('/helpsessions'),
  getById: (id) => apiCall(`/helpsessions/${id}`),
  create: (session) => apiCall('/helpsessions', {
    method: 'POST',
    body: JSON.stringify(session),
  }),
  close: (id) => apiCall(`/helpsessions/${id}/close`, {
    method: 'PUT',
  }),
};

// ========== MESSAGES ==========
export const messagesAPI = {
  getBySession: (sessionId) => apiCall(`/messages/session/${sessionId}`),
  create: (message) => apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify(message),
  }),
  markViewed: (id, byAdmin) => apiCall(`/messages/${id}/mark-viewed`, {
    method: 'PUT',
    body: JSON.stringify(byAdmin),
  }),
};

// ========== AUTH ==========
export const logout = async () => {
  try {
    console.log('Logging out...');
    // Clear user data from localStorage
    localStorage.removeItem('user');
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    // Clear localStorage anyway, even if API call fails
    localStorage.removeItem('user');
  }
};

export default {
  courses: coursesAPI,
  categories: categoriesAPI,
  levels: levelsAPI,
  tips: tipsAPI,
  prepItems: prepItemsAPI,
  steps: stepsAPI,
  questions: questionsAPI,
  helpSessions: helpSessionsAPI,
  messages: messagesAPI,
};
