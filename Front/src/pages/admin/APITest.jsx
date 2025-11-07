import React, { useState, useEffect } from 'react';
import { categoriesAPI, levelsAPI, coursesAPI } from '../../services/api';

export default function APITest() {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesData, levelsData, coursesData] = await Promise.all([
        categoriesAPI.getAll(),
        levelsAPI.getAll(),
        coursesAPI.getAll()
      ]);

      setCategories(categoriesData);
      setLevels(levelsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">API Connection Failed ❌</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-mono text-sm">{error}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Troubleshooting:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Make sure your C# backend is running</li>
            <li>Check if the API_BASE_URL in Front/src/services/api.js matches your backend port</li>
            <li>Verify CORS is enabled in Server/Program.cs</li>
            <li>Open browser console (F12) for more details</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-green-600">API Connection Successful! ✓</h1>

      <div className="space-y-6">
        {/* Categories */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Categories ({categories.length})</h2>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found. Create one to test!</p>
          ) : (
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.categoryId} className="border-l-4 border-blue-500 pl-3 py-1">
                  <strong>{cat.title}</strong> - {cat.description || 'No description'}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Levels */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Levels ({levels.length})</h2>
          {levels.length === 0 ? (
            <p className="text-gray-500">No levels found. Create one to test!</p>
          ) : (
            <ul className="space-y-2">
              {levels.map(level => (
                <li key={level.levelId} className="border-l-4 border-green-500 pl-3 py-1">
                  <strong>{level.title}</strong> - {level.description || 'No description'}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Courses */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Courses ({courses.length})</h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses found. Create one to test!</p>
          ) : (
            <ul className="space-y-2">
              {courses.map(course => (
                <li key={course.courseId} className="border-l-4 border-red-500 pl-3 py-1">
                  <strong>{course.title}</strong>
                  <div className="text-sm text-gray-600">
                    {course.category?.title} • {course.level?.title} • {course.cookingTimeMin || 0} min
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={fetchData}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Refresh Data
      </button>
    </div>
  );
}
