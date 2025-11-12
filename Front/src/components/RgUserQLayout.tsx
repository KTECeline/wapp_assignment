import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Outlet, useNavigate } from "react-router-dom";
interface RgUserQLayoutProps {
  children: React.ReactNode;
}

const RgUserQLayout: React.FC<RgUserQLayoutProps> = ({ children }) => {
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const navigate = useNavigate();

  // Get courseId from sessionStorage
  const courseId = Number(sessionStorage.getItem("currentCourseId") || 0);

  // Fetch total questions from API
  useEffect(() => {
    if (!courseId) return;

    fetch(`/api/Questions/course/${courseId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch questions")))
      .then((data: any[]) => setTotalQuestions(data.length || 1))
      .catch(() => setTotalQuestions(1));
  }, [courseId]);

  // Poll localProgress from sessionStorage every 0.5s
  useEffect(() => {
    const interval = setInterval(() => {
      const localProgress = Number(sessionStorage.getItem("localProgress") || 0);
      const percent = Math.min((localProgress / totalQuestions) * 100, 100);
      setProgress(percent);
    }, 500);

    return () => clearInterval(interval);
  }, [totalQuestions]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format elapsedSeconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="font-inter bg-white min-h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="w-full h-[80px] bg-[#F8F5F0] left-0 top-0 fixed flex flex-row justify-between items-center z-50">
        <div className="pl-[24px] absolute">
          <img src="/images/WAPP_Logo.png" alt="Logo" className="w-[203px]" />
        </div>

        <div className="flex flex-row mx-auto text-black text-[16px] font-light gap-[28px] pl-32">
          {/* Stop Quiz */}
          <button className="cursor-pointer"
            onClick={() => navigate(`/RgUserCourse/${courseId}`)}>
            <RxCross2 className="h-[28px] w-[28px] transition-all duration-300 hover:text-[#DA1A32]" />
          </button>

          {/* Progress */}
          <div className="w-[685px] bg-[#FFDBDB] rounded-full h-[10px] overflow-hidden my-auto">
            <div
              className="bg-[#DA1A32] h-[10px] transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer placeholder */}
          <div className="flex flex-row w-[96px] h-[30px] bg-white rounded-full border border-black justify-center items-center">
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <Outlet />
    </div>
  );
};

export default RgUserQLayout;
