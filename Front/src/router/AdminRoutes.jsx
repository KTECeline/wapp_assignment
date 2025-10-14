import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Courses from '../pages/admin/Courses';
import Posts from '../pages/admin/Posts';
import Feedback from '../pages/admin/Feedback';
import Badges from '../pages/admin/Badges';
import Announcements from '../pages/admin/Announcements';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>        
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="courses" element={<Courses />} />
        <Route path="posts" element={<Posts />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="badges" element={<Badges />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
