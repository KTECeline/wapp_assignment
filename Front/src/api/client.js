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
  const res = await fetch(`/api/Users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
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
