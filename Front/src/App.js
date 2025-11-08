import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './router/AdminRoutes';
import { ToastProvider } from './components/Toast';
import { ConfirmProvider } from './components/Confirm';
// Import pages like Home, Explore
import TestBackend from './TestBackend'; 
import RgUserHome from "./pages/RgUserHome.tsx"; 
import RgUserLearn from "./pages/RgUserLearn.tsx"; 
import RgUserCat from "./pages/RgUserCat.tsx"; 
import RgUserCourse from "./pages/RgUserCourse.tsx"; 
import RgUserCourseStep from "./pages/RgUserCourseStep.tsx"; 
import RgUserCoursePost from "./pages/RgUserCoursePost.tsx"; 
import RgUserCourseReview from "./pages/RgUserCourseReview.tsx"; 
import RgUserMCQ from "./pages/RgUserMCQ.tsx"; 
import RgUserDD from "./pages/RgUserDD.tsx"; 
import RgUserQuizCp from "./pages/RgUserQuizCp.tsx"; 
import RgUserExamCp from "./pages/RgUserExamCp.tsx"; 
import RgUserBadge from "./pages/RgUserBadge.tsx"; 
import RgUserCol from "./pages/RgUserCol.tsx"; 
import RgUserSearch from "./pages/RgUserSearch.tsx"; 
import RgUserSet from "./pages/RgUserSet.tsx"; 
import RgUserPost from "./pages/RgUserPost.tsx"; 
import RgUserReview from "./pages/RgUserReview.tsx"; 
import Register from "./pages/Register.tsx"; 
import Login from "./pages/Login.tsx"; 
import LandingPage from "./pages/LandingPage.tsx"; 

function App() {
  return (
    <Router>
  <ToastProvider>
  <ConfirmProvider>
      <AdminRoutes />
      <Routes>
        <Route path="/TestBackend" element={<TestBackend />} />
        <Route path="/RgUserHome" element={<RgUserHome />} />
        <Route path="/RgUserLearn" element={<RgUserLearn />} />
        <Route path="/RgUserCat" element={<RgUserCat />} />
        <Route path="/RgUserCourse" element={<RgUserCourse />} />
        <Route path="/RgUserCoursePost" element={<RgUserCoursePost />} />
        <Route path="/RgUserCourseReview" element={<RgUserCourseReview />} />
        <Route path="/RgUserCourseStep" element={<RgUserCourseStep />} />
        <Route path="/RgUserMCQ" element={<RgUserMCQ />} />
        <Route path="/RgUserDD" element={<RgUserDD />} />
        <Route path="/RgUserQuizCp" element={<RgUserQuizCp />} />
        <Route path="/RgUserExamCp" element={<RgUserExamCp />} />
        <Route path="/RgUserBadge" element={<RgUserBadge />} />
        <Route path="/RgUserCol" element={<RgUserCol />} />
        <Route path="/RgUserSearch" element={<RgUserSearch />} />
        <Route path="/RgUserSet" element={<RgUserSet />} />
        <Route path="/RgUserPost" element={<RgUserPost />} />
        <Route path="/RgUserReview" element={<RgUserReview />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<Navigate replace to="/Login" />} />
      </Routes>
      </ConfirmProvider>
      </ToastProvider>
    </Router>
  );
}
export default App;