import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Courses from '../pages/admin/Courses';
import CoursesEdit from '../pages/admin/CoursesEdit';
import Posts from '../pages/admin/Posts';
import Feedback from '../pages/admin/Feedback';
import Announcements from '../pages/admin/Announcements';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';
import CourseManagement from '../pages/admin/CourseManagement';
import CourseCategories from '../pages/admin/CourseCategories';
import CourseLevels from '../pages/admin/CourseLevels';
import HelpSessions from '../pages/admin/HelpSessions';
import APITest from '../pages/admin/APITest';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/edit" element={<CoursesEdit />} />
        <Route path="course-management" element={<CourseManagement />} />
        <Route path="course-categories" element={<CourseCategories />} />
        <Route path="course-levels" element={<CourseLevels />} />
        <Route path="help-sessions" element={<HelpSessions />} />
        <Route path="api-test" element={<APITest />} />
        <Route path="posts" element={<Posts />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
