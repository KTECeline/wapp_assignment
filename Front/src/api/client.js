export async function getUsers() {
  const res = await fetch('/api/Users');
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export async function getCategories() {
  const res = await fetch('/api/Categories');
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

export async function createUser(userData) {
  const formData = new FormData();
  
  // Add all user data fields with exact field names matching the backend
  formData.append('username', userData.username);
  formData.append('email', userData.email);
  formData.append('password', userData.password);
  formData.append('firstName', userData.firstName);
  formData.append('lastName', userData.lastName);
  formData.append('gender', userData.gender);
  formData.append('DOB', userData.DOB);
  formData.append('userType', 'user');  // Default user type
  
  if (userData.levelId) {
    formData.append('levelId', userData.levelId.toString());
  }
  if (userData.categoryId !== null && userData.categoryId !== undefined) {
    formData.append('categoryId', userData.categoryId.toString());
  }
  
  // Handle the profile image
  if (userData.profileimage instanceof File) {
    formData.append('profileimage', userData.profileimage);
  }

  const res = await fetch('/api/Users', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to create user: ${res.status}`);
  }
  
  return res.json();
}

export async function updateUser(id, user) {
  // Always use FormData to handle both file uploads and regular fields
  const formData = new FormData();
  
  // Map and add fields using exact column names from User.cs
  const fieldMappings = {
    username: 'username',
    email: 'email',
    firstName: 'first_name',
    lastName: 'last_name',
    gender: 'gender',
    dob: 'DOB',
    levelId: 'level_id',
    categoryId: 'category_id'
  };

  // Add mapped fields to FormData
  Object.entries(user).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === 'profileimage') {
        formData.append('profileimage', value);
      } else {
        const dbField = fieldMappings[key] || key;
        formData.append(dbField, value);
      }
    }
  });

  const res = await fetch(`/api/Users/${id}`, {
    method: 'PUT',
    // Let the browser set the correct Content-Type for FormData
    body: formData
  });
  if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`/api/Users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);
  return true;
}

// Optional: fetch badge statistics if your backend exposes it
// Expected response example: [{ title: 'Croissant Novice', count: 12 }, ...]
export async function getBadgeStats() {
  const res = await fetch('/api/Badges/stats');
  if (!res.ok) throw new Error(`Failed to fetch badge stats: ${res.status}`);
  return res.json();
}

export async function login(loginId, password) {
  const res = await fetch('/api/Users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, password })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Login failed: ${res.status}`);
  }
  return res.json();
}

// Help sessions and messages
export async function getHelpSessions() {
  const res = await fetch('/api/HelpSessions');
  if (!res.ok) throw new Error(`Failed to fetch help sessions: ${res.status}`);
  return res.json();
}

export async function getHelpSession(id) {
  const res = await fetch(`/api/HelpSessions/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch help session ${id}: ${res.status}`);
  return res.json();
}

export async function createMessage(message) {
  const res = await fetch('/api/Messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  if (!res.ok) throw new Error(`Failed to create message: ${res.status}`);
  return res.json();
}

export async function closeHelpSession(id) {
  const res = await fetch(`/api/HelpSessions/${id}/close`, { method: 'PUT' });
  if (!res.ok) throw new Error(`Failed to close help session: ${res.status}`);
  return res.json();
}

export async function markMessageViewed(id, byAdmin = true) {
  const res = await fetch(`/api/Messages/${id}/mark-viewed`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(byAdmin)
  });
  if (!res.ok) throw new Error(`Failed to mark message viewed: ${res.status}`);
  return res.json();
}

// Announcements
export async function getAnnouncements() {
  const res = await fetch('/api/Announcements');
  if (!res.ok) throw new Error(`Failed to fetch announcements: ${res.status}`);
  return res.json();
}

export async function createAnnouncement({ title, body, annFile, annDataUrl, visible = true }) {
  // Use FormData so we can send either a file or plain text
  const form = new FormData();
  form.append('title', title || '');
  form.append('body', body || '');
  form.append('visible', visible ? 'true' : 'false');

  if (annFile instanceof File) {
    form.append('ann_img', annFile, annFile.name);
  } else if (annDataUrl) {
    // convert dataURL to blob
    const res = await fetch(annDataUrl);
    const blob = await res.blob();
    form.append('ann_img', blob, 'banner.jpg');
  }

  const r = await fetch('/api/Announcements', { method: 'POST', body: form });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `Failed to create announcement: ${r.status}`);
  }
  return r.json();
}

export async function updateAnnouncement(id, { title, body, annFile, annDataUrl, visible }) {
  const form = new FormData();
  if (title !== undefined) form.append('title', title);
  if (body !== undefined) form.append('body', body);
  if (visible !== undefined) form.append('visible', visible ? 'true' : 'false');

  if (annFile instanceof File) {
    form.append('ann_img', annFile, annFile.name);
  } else if (annDataUrl) {
    const res = await fetch(annDataUrl);
    const blob = await res.blob();
    form.append('ann_img', blob, 'banner.jpg');
  }

  const r = await fetch(`/api/Announcements/${id}`, { method: 'PUT', body: form });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `Failed to update announcement: ${r.status}`);
  }
  return r.json();
}

export async function deleteAnnouncement(id) {
  const r = await fetch(`/api/Announcements/${id}`, { method: 'DELETE' });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `Failed to delete announcement: ${r.status}`);
  }
  return true;
}

// User feedback
export async function getUserFeedbacks() {
  const res = await fetch('/api/UserFeedbacks');
  if (!res.ok) throw new Error(`Failed to fetch feedbacks: ${res.status}`);
  return res.json();
}

export async function updateUserFeedback(id, { rating, title, description, type }) {
  const form = new FormData();
  if (rating !== undefined) form.append('rating', rating.toString());
  if (title !== undefined) form.append('title', title);
  if (description !== undefined) form.append('description', description);
  if (type !== undefined) form.append('type', type);

  const res = await fetch(`/api/UserFeedbacks/${id}`, { method: 'PUT', body: form });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Failed to update feedback: ${res.status}`);
  }
  return res.json();
}

export async function deleteUserFeedback(id) {
  const res = await fetch(`/api/UserFeedbacks/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Failed to delete feedback: ${res.status}`);
  }
  return true;
}

// Courses
export async function getCourses() {
  const res = await fetch('/api/Courses');
  if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
  return res.json();
}

export async function getCourse(id) {
  const res = await fetch(`/api/Courses/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch course: ${res.status}`);
  return res.json();
}

export async function getCourseWithDetails(id) {
  const res = await fetch(`/api/Courses/${id}/full`);
  if (!res.ok) throw new Error(`Failed to fetch course details: ${res.status}`);
  return res.json();
}

export async function createCourse(courseData) {
  const res = await fetch('/api/Courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create course: ${res.status}`);
  }
  return res.json();
}

export async function updateCourse(id, courseData) {
  const res = await fetch(`/api/Courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update course: ${res.status}`);
  }
  return res.json();
}

export async function deleteCourse(id) {
  const res = await fetch(`/api/Courses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete course: ${res.status}`);
  return true;
}

// Levels
export async function getLevels() {
  const res = await fetch('/api/Levels');
  if (!res.ok) throw new Error(`Failed to fetch levels: ${res.status}`);
  return res.json();
}

export async function getLevel(id) {
  const res = await fetch(`/api/Levels/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch level: ${res.status}`);
  return res.json();
}

export async function createLevel(levelData) {
  const res = await fetch('/api/Levels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(levelData)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create level: ${res.status}`);
  }
  return res.json();
}

export async function updateLevel(id, levelData) {
  const res = await fetch(`/api/Levels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(levelData)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update level: ${res.status}`);
  }
  return res.json();
}

export async function deleteLevel(id) {
  const res = await fetch(`/api/Levels/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete level: ${res.status}`);
  return true;
}

// Categories (adding missing methods)
export async function getCategory(id) {
  const res = await fetch(`/api/Categories/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch category: ${res.status}`);
  return res.json();
}

export async function createCategory(categoryData) {
  const res = await fetch('/api/Categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create category: ${res.status}`);
  }
  return res.json();
}

export async function updateCategory(id, categoryData) {
  const res = await fetch(`/api/Categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update category: ${res.status}`);
  }
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`/api/Categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete category: ${res.status}`);
  return true;
}
