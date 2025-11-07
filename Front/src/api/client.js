export async function getUsers() {
  const res = await fetch('/api/Users');
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export async function createUser(user) {
  const res = await fetch('/api/Users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error(`Failed to create user: ${res.status}`);
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
