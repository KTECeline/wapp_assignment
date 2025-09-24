import React, { useEffect, useState } from 'react';

function TestBackend() {
  const [users, setUsers] = useState([]);

  // Fetch from backend
  useEffect(() => {
    fetch('/api/users') // This will proxy to your backend
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 Home Page</h1>
      <p>If you can see this, React Router is working!</p>

      <h2>Users from backend:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(u => (
            <li key={u.userID}>{u.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users found (empty DB or backend not running).</p>
      )}
    </div>
  );
}

export default TestBackend;