export async function getUsers() {
  const res = await fetch('/api/Users');
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
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
  
  if (userData.levelId) {
    formData.append('levelId', userData.levelId.toString());
  }
  if (userData.categoryId) {
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
