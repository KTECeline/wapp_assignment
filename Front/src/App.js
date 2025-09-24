import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import pages like Home, Explore
import TestBackend from './TestBackend'; 
import RgUserHome from "./pages/RgUserHome.tsx"; 
import RgUserLearn from "./pages/RgUserLearn.tsx"; 
import RgUserCat from "./pages/RgUserCat.tsx"; 
import RgUserCourse from "./pages/RgUserCourse.tsx"; 
import RgUserCourseStep from "./pages/RgUserCourseStep.tsx"; 
import RgUserMCQ from "./pages/RgUserMCQ.tsx"; 
import RgUserDD from "./pages/RgUserDD.tsx"; 
import RgUserQuizCp from "./pages/RgUserQuizCp.tsx"; 
import RgUserExamCp from "./pages/RgUserExamCp.tsx"; 
import RgUserBadge from "./pages/RgUserBadge.tsx"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestBackend />} />
        <Route path="/RgUserHome" element={<RgUserHome />} />
        <Route path="/RgUserLearn" element={<RgUserLearn />} />
        <Route path="/RgUserCat" element={<RgUserCat />} />
        <Route path="/RgUserCourse" element={<RgUserCourse />} />
        <Route path="/RgUserCourseStep" element={<RgUserCourseStep />} />
        <Route path="/RgUserMCQ" element={<RgUserMCQ />} />
        <Route path="/RgUserDD" element={<RgUserDD />} />
        <Route path="/RgUserQuizCp" element={<RgUserQuizCp />} />
        <Route path="/RgUserExamCp" element={<RgUserExamCp />} />
        <Route path="/RgUserBadge" element={<RgUserBadge />} />
        
      </Routes>
    </Router>
  );
}
export default App;